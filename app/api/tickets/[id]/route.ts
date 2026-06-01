import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendTicketResolvedEmail } from '@/lib/email';

export const runtime = 'nodejs';

// PATCH — update ticket status / add response (IT support / admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const agent = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!agent || !['admin', 'it_support'].includes(agent.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { status, response } = await req.json();

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(response !== undefined && { response }),
    },
    include: { user: { select: { name: true, email: true } } },
  });

  // Send resolved email when status changes to resolved
  if (status === 'resolved' && response && ticket.user.email) {
    sendTicketResolvedEmail({
      clientName: ticket.user.name,
      clientEmail: ticket.user.email,
      ticketNo: ticket.ticketNo,
      subject: ticket.subject,
      response,
    }).catch(() => {});
  }

  return NextResponse.json({ ticket });
}
