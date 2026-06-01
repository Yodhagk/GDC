import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'itsupport@goldendollarconsulting.com';
const FROM = process.env.SMTP_FROM || 'Golden Dollar Consultancy <noreply@goldendollarconsulting.com>';

export async function sendTicketCreatedEmail(opts: {
  clientName: string;
  clientEmail: string;
  ticketNo: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
}) {
  // Skip silently if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const transporter = getTransporter();

  // Notify IT support
  await transporter.sendMail({
    from: FROM,
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
  await transporter.sendMail({
    from: FROM,
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

export async function sendTicketResolvedEmail(opts: {
  clientName: string;
  clientEmail: string;
  ticketNo: string;
  subject: string;
  response: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const transporter = getTransporter();

  await transporter.sendMail({
    from: FROM,
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
