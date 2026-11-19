import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      email,
      phone,
      oldPassword,
      newPassword,
      confirmPassword,
    } = await req.json();

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, phone: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updateData = {};

    // 1. Email cannot be changed once set; allow setting only if currently empty (phone-only signup)
    if (!currentUser.email && email?.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const emailTaken = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id: currentUser.id } },
      });
      if (emailTaken) {
        return NextResponse.json(
          { error: 'This email is already linked to another account.' },
          { status: 409 }
        );
      }
      updateData.email = cleanEmail;
    }

    // 2. Phone number update with uniqueness check
    if (phone !== undefined) {
      const cleanPhone = phone.trim() || null;
      if (cleanPhone && cleanPhone !== currentUser.phone) {
        const phoneTaken = await prisma.user.findFirst({
          where: { phone: cleanPhone, NOT: { id: currentUser.id } },
        });
        if (phoneTaken) {
          return NextResponse.json(
            { error: 'This phone number is already linked to another account.' },
            { status: 409 }
          );
        }
      }
      updateData.phone = cleanPhone;
    }

    // 3. Password change validation (Old Password + New Password + Re-enter New Password)
    const wantsPasswordChange = Boolean(oldPassword || newPassword || confirmPassword);

    if (wantsPasswordChange) {
      if (currentUser.password) {
        if (!oldPassword) {
          return NextResponse.json(
            { error: 'Please enter your current (old) password.' },
            { status: 400 }
          );
        }
        const isOldValid = await bcrypt.compare(oldPassword, currentUser.password);
        if (!isOldValid) {
          return NextResponse.json(
            { error: 'Your current (old) password is incorrect.' },
            { status: 400 }
          );
        }
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: 'New password and re-entered password do not match.' },
          { status: 400 }
        );
      }

      if (oldPassword && oldPassword === newPassword) {
        return NextResponse.json(
          { error: 'New password must be different from your current password.' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update account credentials.' },
      { status: 500 }
    );
  }
}