"use client"; // Make it a client function

import { signIn, signOut } from "next-auth/react";

export function signInAction() {
  return signIn("google", { callbackUrl: "/" }); // No `await` needed in client
}

export function signOutAction() {
  return signOut({ callbackUrl: "/" });
}
