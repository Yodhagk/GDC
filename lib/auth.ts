import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { prisma } from './prisma';
import { sendMfaCodeEmail } from './email';
import { generateCustomerId } from './utils';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const MFA_CODE_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const MFA_RESEND_COOLDOWN_MS = 60 * 1000; // min gap between emailed codes
const MFA_MAX_ATTEMPTS = 5;

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

const azureAdEnabled = !!(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(azureAdEnabled
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            // "common" accepts both personal Outlook/Hotmail accounts and work/school (Office 365) accounts
            tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
            authorization: { params: { scope: 'openid profile email' } },
            async profile(profile) {
              // Skip the default Graph "photo" fetch — portal has no avatar UI, and it
              // fails/slows sign-in for personal accounts without Graph photo access.
              // customerId/role are placeholders; the signIn callback overwrites them
              // with the real values from our User table before the jwt callback runs.
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email ?? profile.preferred_username,
                customerId: '',
                role: 'client',
              };
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'Verification Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        if (!user.isActive) throw new Error('ACCOUNT_DEACTIVATED');
        if (!user.emailVerified) throw new Error('EMAIL_NOT_VERIFIED');

        // Step 2: password already verified, an OTP was submitted
        if (credentials.otp) {
          if (!user.mfaCode || !user.mfaCodeExpires) throw new Error('MFA_REQUIRED');
          if (user.mfaCodeExpires < new Date()) throw new Error('MFA_EXPIRED');
          if (user.mfaAttempts >= MFA_MAX_ATTEMPTS) throw new Error('MFA_LOCKED');

          const submitted = hashCode(credentials.otp.trim());
          if (submitted !== user.mfaCode) {
            await prisma.user.update({
              where: { id: user.id },
              data: { mfaAttempts: { increment: 1 } },
            });
            throw new Error(
              user.mfaAttempts + 1 >= MFA_MAX_ATTEMPTS ? 'MFA_LOCKED' : 'MFA_INVALID'
            );
          }

          // Success — clear the code so it can't be replayed
          await prisma.user.update({
            where: { id: user.id },
            data: { mfaCode: null, mfaCodeExpires: null, mfaCodeIssuedAt: null, mfaAttempts: 0 },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            customerId: user.customerId,
            role: user.role,
          };
        }

        // Step 1: password verified, no OTP yet — issue a code and ask for it.
        // Throttle resends so repeated step-1 calls can't spam the inbox.
        const now = new Date();
        const recentlyIssued =
          user.mfaCodeIssuedAt &&
          now.getTime() - user.mfaCodeIssuedAt.getTime() < MFA_RESEND_COOLDOWN_MS &&
          user.mfaCodeExpires &&
          user.mfaCodeExpires > now;

        if (!recentlyIssued) {
          const code = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
          await prisma.user.update({
            where: { id: user.id },
            data: {
              mfaCode: hashCode(code),
              mfaCodeExpires: new Date(now.getTime() + MFA_CODE_TTL_MS),
              mfaCodeIssuedAt: now,
              mfaAttempts: 0,
            },
          });
          try {
            await sendMfaCodeEmail({ name: user.name, email: user.email, code });
          } catch (err) {
            console.error('Failed to send MFA email:', err);
            throw new Error('MFA_EMAIL_FAILED');
          }
        }

        throw new Error('MFA_REQUIRED');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'azure-ad') return true;
      if (!user.email) return false;

      const email = user.email.toLowerCase().trim();

      // Find-or-create: link into an existing account by email (Microsoft verifies
      // email ownership, so this is safe), or auto-provision a new client on first login.
      let dbUser = await prisma.user.findUnique({ where: { email } });

      if (!dbUser) {
        let customerId = generateCustomerId();
        for (let attempts = 0; attempts < 5; attempts++) {
          const collision = await prisma.user.findUnique({ where: { customerId } });
          if (!collision) break;
          customerId = generateCustomerId();
        }

        dbUser = await prisma.user.create({
          data: {
            name: user.name || email,
            email,
            customerId,
            // No local password — this account signs in via Microsoft only
            emailVerified: new Date(), // Microsoft already verified this email address
          },
        });
      }

      if (!dbUser.isActive) return '/portal/login?error=AccountDeactivated';

      // Stamp the internal identity onto the OAuth user object so the jwt
      // callback below picks up our id/role/customerId instead of Azure's.
      user.id = dbUser.id;
      (user as any).customerId = dbUser.customerId;
      (user as any).role = dbUser.role;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.customerId = (user as any).customerId;
        token.role = (user as any).role;
        token.isActive = true; // just completed a fresh sign-in
        token.backupPlan = false; // refreshed from the DB on the next session read
      } else if (token.id) {
        // Re-check on every session refresh so deactivation/role changes take
        // effect without waiting for the 30-day JWT to expire.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isActive: true, customerId: true, backupPlan: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
          token.customerId = dbUser.customerId;
          token.backupPlan = dbUser.backupPlan;
        } else {
          token.isActive = false; // account no longer exists
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).customerId = token.customerId;
        (session.user as any).role = token.role;
        (session.user as any).backupPlan = !!token.backupPlan;
      }
      return session;
    },
  },
  pages: {
    signIn: '/portal/login',
    error: '/portal/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
