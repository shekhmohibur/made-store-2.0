import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      phone: true,
      password: true,
      accounts: { select: { provider: true } },
    },
  });

  return NextResponse.json({
    email: user.email,
    phone: user.phone,
    hasPassword: Boolean(user.password),
    googleLinked: user.accounts.some((a) => a.provider === 'google'),
  });
}

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, phone, password } = await req.json();
    const updateData = {};

    if (email !== undefined) {
      const cleanEmail = email.trim().toLowerCase();
      const conflict = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id: session.user.id } },
      });
      if (conflict) {
        return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
      }
      updateData.email = cleanEmail;
    }

    if (phone !== undefined) {
      const cleanPhone = phone.trim();
      const conflict = await prisma.user.findFirst({
        where: { phone: cleanPhone, NOT: { id: session.user.id } },
      });
      if (conflict) {
        return NextResponse.json({ error: 'Phone number is already in use.' }, { status: 409 });
      }
      updateData.phone = cleanPhone;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { email: true, phone: true },
    });

    return NextResponse.json({ message: 'Account updated', user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update account.' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Prevent locking user out if they have no password/email/phone backup
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true, email: true, phone: true },
  });

  if (!user?.password || (!user?.email && !user?.phone)) {
    return NextResponse.json(
      { error: 'Set a password and email or phone number before unlinking Google.' },
      { status: 400 }
    );
  }

  await prisma.account.deleteMany({
    where: { userId: session.user.id, provider: 'google' },
  });

  return NextResponse.json({ message: 'Google account unlinked.' });
}