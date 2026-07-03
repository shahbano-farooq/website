type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>}
      <div className="mt-4 h-px w-12 bg-accent" />
    </div>
  );
}
