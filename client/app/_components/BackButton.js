"use client";

import { BackspaceIcon } from "@heroicons/react/24/solid";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";

export default function Button() {
  const router = useRouter();

  return (
    <button className=" " onClick={() => router.back()}>
      <ArrowLeft className=" bg-primary-500 size-6 rounded-s-xl p-2 w-11 h-10 text-primary-900  translate-y-[-20px]" />
    </button>
  );
}
