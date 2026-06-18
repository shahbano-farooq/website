import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PublicationItem from "@/components/PublicationItem";
import {
  news,
  publications,
  researchInterests,
  siteConfig,
} from "@/lib/data";

export default function HomePage() {
  const featuredPubs = publications.slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div className="mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-border bg-accent-light lg:mx-0">
              <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-accent/40">
                SF
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                {siteConfig.title}
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {siteConfig.name}
              </h1>
              <p className="mt-3 text-lg text-muted">
                {siteConfig.department}
              </p>
              <p className="text-muted">
                {siteConfig.institution}, {siteConfig.university}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
                {siteConfig.tagline}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  href="/research"
                  className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  View Research
                </Link>
                <Link
                  href="/publications"
                  className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  Publications
                </Link>
                <Link
                  href="/cv"
                  className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  CV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading title="About" />
        <div className="prose prose-neutral max-w-none text-muted">
          <p className="leading-relaxed">
            I am a PhD candidate studying how people interact with data through
            visualization. My research sits at the intersection of human-computer
            interaction and information visualization, with a focus on making complex
            data more understandable, actionable, and accessible.
          </p>
          <p className="mt-4 leading-relaxed">
            I use a mix of empirical methods — controlled experiments, interviews,
            and think-aloud studies — alongside system building to evaluate new
            visualization techniques and interaction paradigms. I am particularly
            interested in uncertainty communication, collaborative analytics, and
            inclusive design for data visualization.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted">
            Research Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionHeading
            title="Recent News"
            subtitle="Updates on publications, awards, and presentations."
          />
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.date + item.text} className="flex gap-4">
                <time className="w-20 shrink-0 text-sm font-medium text-accent">
                  {item.date}
                </time>
                <p className="text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <SectionHeading title="Selected Publications" />
        </div>
        <div>
          {featuredPubs.map((pub, i) => (
            <PublicationItem key={pub.id} publication={pub} index={i} />
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/publications"
            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            View all publications →
          </Link>
        </div>
      </section>
    </>
  );
}
