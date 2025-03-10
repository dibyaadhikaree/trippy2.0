"use client";

import { useFormStatus } from "react-dom";

export default function Button({ buttonname, updating }) {
  const { pending } = useFormStatus();

  console.log(pending);
  return (
    <button
      type="submit"
      className={` disabled bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-30`}
      disabled={pending ?? false}
    >
      {pending ? updating : buttonname}
    </button>
  );
}
