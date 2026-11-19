import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { role } = await req.json();

    if (!['CUSTOMER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    if (id === session.user.id && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You cannot remove your own Admin access.' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own active admin account.' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Cannot delete user with existing order records.' },
      { status: 400 }
    );
  }
}