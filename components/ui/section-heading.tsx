import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl space-y-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-400/85">{eyebrow}</p>
      <h2 className="font-[var(--font-serif)] text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      <p className="text-base text-mist sm:text-lg">{description}</p>
    </div>
  );
}
