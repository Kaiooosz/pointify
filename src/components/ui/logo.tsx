import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  withText?: boolean;
}

export function Logo({ className, width = 40, height = 40, withText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
        <Image
          src="/p-icone-escuro.jpg"
          alt="Pointify Logo"
          width={width}
          height={height}
          className="object-contain dark:hidden rounded-xl"
        />
        <Image
          src="/p-icone-claro.jpg"
          alt="Pointify Logo"
          width={width}
          height={height}
          className="object-contain hidden dark:block rounded-xl"
        />
      </div>
      {withText && (
        <span className="text-xl font-black tracking-tighter text-white">
          Pointify<span className="text-[#1DB954]">.</span>
        </span>
      )}
    </Link>

  );
}
