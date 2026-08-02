import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { sendMfaCodeEmail } from './email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const MFA_CODE_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const MFA_RESEND_COOLDOWN_MS = 60 * 1000; // min gap between emailed codes
const MFA_MAX_ATTEMPTS = 5;

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export const authOptions: NextAuthOptions = {
  providers: [
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.customerId = (user as any).customerId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).customerId = token.customerId;
        (session.user as any).role = token.role;
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
