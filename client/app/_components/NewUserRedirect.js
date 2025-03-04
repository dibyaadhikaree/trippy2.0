"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewUserRedirect({ isNewUser }) {
  const router = useRouter();

  useEffect(() => {
    // Check if this is a new user

    if (isNewUser) {
      // Mark the user as not new anymore

      // Redirect to onboarding or welcome page
      router.push("/account/preferences");
    }
  }, [isNewUser, router]);

  return null; // This component doesn't render anything
}
