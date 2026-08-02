import { sendGraphMail, graphMailConfigured } from './graphMail';

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'itsupport@goldendollarconsulting.com';

export async function sendTicketCreatedEmail(opts: {
  clientName: string;
  clientEmail: string;
  ticketNo: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
}) {
  if (!graphMailConfigured()) return;

  // Notify IT support
  await sendGraphMail({
    to: SUPPORT_EMAIL,
    subject: `[${opts.ticketNo}] New Support Ticket: ${opts.subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">New Support Ticket Raised</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Ticket #</td><td style="padding:8px">${opts.ticketNo}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Client</td><td style="padding:8px">${opts.clientName} (${opts.clientEmail})</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Subject</td><td style="padding:8px">${opts.subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Category</td><td style="padding:8px">${opts.category}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Priority</td><td style="padding:8px">${opts.priority}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Message</td><td style="padding:8px">${opts.message}</td></tr>
        </table>
        <p style="color:#666;font-size:13px">Please log in to the IT Support dashboard to respond.</p>
      </div>`,
  });

  // Confirm to client
  await sendGraphMail({
    to: opts.clientEmail,
    subject: `Your Support Ticket ${opts.ticketNo} Has Been Received`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">We've Received Your Ticket</h2>
        <p>Hi ${opts.clientName},</p>
        <p>Your support ticket has been submitted successfully. Our IT support team will respond shortly.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Ticket #</td><td style="padding:8px">${opts.ticketNo}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Subject</td><td style="padding:8px">${opts.subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Priority</td><td style="padding:8px">${opts.priority}</td></tr>
        </table>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy · +1 (469) 269-9784</p>
      </div>`,
  });
}

export async function sendPasswordResetEmail(opts: {
  name: string;
  email: string;
  resetUrl: string;
}) {
  if (!graphMailConfigured()) {
    console.log(`[DEV] Password reset link for ${opts.email}: ${opts.resetUrl}`);
    return;
  }

  await sendGraphMail({
    to: opts.email,
    subject: 'Reset Your Golden Dollar Consultancy Password',
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Password Reset Request</h2>
        <p>Hi ${opts.name},</p>
        <p>We received a request to reset the password for your client portal account. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
        <p style="margin:24px 0">
          <a href="${opts.resetUrl}" style="background:#d4a018;color:#0a1628;font-weight:bold;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block">Reset Password</a>
        </p>
        <p style="color:#666;font-size:13px">If the button doesn't work, copy and paste this link into your browser:<br/>${opts.resetUrl}</p>
        <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email — your password will not change.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy · +1 (469) 269-9784</p>
      </div>`,
  });
}

export async function sendMfaCodeEmail(opts: { name: string; email: string; code: string }) {
  if (!graphMailConfigured()) {
    console.log(`[DEV] MFA code for ${opts.email}: ${opts.code}`);
    return;
  }

  await sendGraphMail({
    to: opts.email,
    subject: `${opts.code} is your Golden Dollar Consultancy verification code`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Your Verification Code</h2>
        <p>Hi ${opts.name},</p>
        <p>Use this code to finish signing in to your portal. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0a1628">${opts.code}</span>
        </div>
        <p style="color:#666;font-size:13px">If you didn't try to sign in, someone may have your password — please reset it immediately.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy · +1 (469) 269-9784</p>
      </div>`,
  });
}

export async function sendTicketResolvedEmail(opts: {
  clientName: string;
  clientEmail: string;
  ticketNo: string;
  subject: string;
  response: string;
}) {
  if (!graphMailConfigured()) return;

  await sendGraphMail({
    to: opts.clientEmail,
    subject: `[${opts.ticketNo}] Your Ticket Has Been Resolved`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Ticket Resolved</h2>
        <p>Hi ${opts.clientName},</p>
        <p>Your support ticket <strong>${opts.ticketNo}</strong> — <em>${opts.subject}</em> — has been resolved.</p>
        <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;margin:16px 0">
          <strong>Response from IT Support:</strong><br/>${opts.response}
        </div>
        <p style="color:#666;font-size:13px">If you need further assistance, please raise a new ticket from your portal.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy · +1 (469) 269-9784</p>
      </div>`,
  });
}
