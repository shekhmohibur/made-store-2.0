"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signUpAction(prevState, formData) {
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");
  const accountType = formData.get("accountType"); // "CUSTOMER" or "ADMIN"
  const adminCode = formData.get("adminCode")?.trim();

  if (!name || !email || !password || password.length < 6) {
    return { error: "Please fill all fields (password must be at least 6 characters)." };
  }

  let role = "CUSTOMER";
  if (accountType === "ADMIN") {
    if (adminCode !== process.env.ADMIN_SECRET) {
      return { error: "Invalid Admin Studio Passcode." };
    }
    role = "ADMIN";
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  await createSession(user);
  redirect(user.role === "ADMIN" ? "/admin" : "/account");
}

export async function signInAction(prevState, formData) {
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(user);
  redirect(user.role === "ADMIN" ? "/admin" : "/account");
}

export async function signOutAction() {
  await clearSession();
  redirect("/login");
}