"use server";

import { createSession, deleteSession, verifyCredentials } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Vui lòng nhập tên đăng nhập và mật khẩu" };
  }

  const user = await verifyCredentials(username, password);
  if (!user) {
    return { error: "Sai tên đăng nhập hoặc mật khẩu" };
  }

  await createSession(user);
  redirect("/contacts");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
