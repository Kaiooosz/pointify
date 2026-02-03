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
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 p-1 shadow-lg">
        <Image
          src="/logo-pointify.jpg"
          alt="Pointify Logo"
          width={width}
          height={height}
          className="rounded-lg object-cover"
        />
      </div>
      {withText && (
        <span className="text-xl font-black tracking-tighter text-emerald-600 dark:text-white">
          Pointify<span className="text-emerald-500">.</span>
        </span>
      )}
    </Link>
  );
}
