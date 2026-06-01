import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendTicketCreatedEmail } from '@/lib/email';

export const runtime = 'nodejs';

function generateTicketNo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'GDC-TKT-';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// GET — list tickets (own for client, all for admin/it_support)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const tickets = await prisma.ticket.findMany({
    where: ['admin', 'it_support'].includes(user.role) ? {} : { userId: user.id },
    include: { user: { select: { name: true, email: true, customerId: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ tickets });
}

// POST — create ticket (client)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { subject, category, priority, message } = await req.json();

  if (!subject?.trim() || !category?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Subject, category and message are required' }, { status: 400 });
  }

  let ticketNo = generateTicketNo();
  // Ensure uniqueness
  while (await prisma.ticket.findUnique({ where: { ticketNo } })) {
    ticketNo = generateTicketNo();
  }

  const ticket = await prisma.ticket.create({
    data: {
      ticketNo,
      userId: user.id,
      subject: subject.trim(),
      category,
      priority: priority || 'medium',
      message: message.trim(),
    },
  });

  // Send email notifications (non-blocking)
  sendTicketCreatedEmail({
    clientName: user.name,
    clientEmail: user.email,
    ticketNo,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    message: ticket.message,
  }).catch(() => {});

  return NextResponse.json({ ticket }, { status: 201 });
}
