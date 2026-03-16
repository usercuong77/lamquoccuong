import Link from "next/link";

import { cn } from "@/lib/cn";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
  external = false
}: CtaLinkProps) {
  const shared =
    "focus-outline inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition duration-300";

  const styles = {
    primary:
      "border-accent-400/55 bg-accent-500/18 text-ink shadow-glow hover:-translate-y-0.5 hover:border-accent-400/70 hover:bg-accent-500/30",
    secondary:
      "border-white/20 bg-white/[0.04] text-ink hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]",
    ghost:
      "border-transparent bg-transparent text-mist hover:text-ink"
  };

  return (
    <Link
      href={href}
      className={cn(shared, styles[variant], className)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
