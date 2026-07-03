import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import LifeTimeline from "@/components/LifeTimeline";
import SectionHeading from "@/components/SectionHeading";
import PublicationItem from "@/components/PublicationItem";
import {
  news,
  publications,
  researchInterests,
} from "@/lib/data";

export default function HomePage() {
  const featuredPubs = publications.slice(0, 3);

  return (
    <>
      <HeroSection />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionHeading
            title="My Journey"
            subtitle="A winding road through education, industry, teaching, and research — from Lahore to Vancouver."
          />
          <LifeTimeline />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading title="About" />
        <div className="max-w-none text-muted">
          <p className="leading-relaxed">
            I am a PhD student at Simon Fraser University&apos;s School of Interactive
            Arts & Technology, studying human-computer interaction and information
            visualization. My research explores how collaborative design methods can
            support sensemaking, knowledge exchange, and the co-creation of meaningful
            data representations.
          </p>
          <p className="mt-4 leading-relaxed">
            Before starting my PhD, I spent nine years as an instructor at Zayed
            University in the UAE, teaching programming, data structures, machine
            learning, and IT fundamentals. I also taught as a graduate TA at the
            University of Calgary during my M.Sc. I hold an M.Sc. from the University of
            Calgary, where my thesis introduced PairedVis — a co-design tool for
            visualization creation — and a B.Sc. from Kinnaird College for Women in
            Lahore, Pakistan.
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
            subtitle="Updates on research, publications, and academic milestones."
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
        <SectionHeading title="Selected Publications" />
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
