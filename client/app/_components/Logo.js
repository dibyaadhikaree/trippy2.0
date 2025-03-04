import Image from "next/image";
import Link from "next/link";

import logoImg from "@/app/icon.png";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        height="60"
        width="60"
        alt="Trippy logo"
        src={logoImg}
        priority={false} // {false} | {true}
      />
      <span className="text-xl font-semibold text-primary-100">Trippy</span>
    </Link>
  );
}

export default Logo;
