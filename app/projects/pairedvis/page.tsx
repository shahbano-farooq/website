import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/data";

const project = projects.find((p) => p.id === "pairedvis")!;

const PAIREDVIS_VIDEO_URL =
  "https://1drv.ms/v/c/c7d96879b83171be/IQCojl57DkzPRYE3rXt2oQQjAVqkefUVmSexeX7OJJQEXxc?e=OSUUnq";

const PAIREDVIS_VIDEO_EMBED_URL =
  "https://onedrive.live.com/embed?resid=C7D96879B83171BE%21s7b5e8ea84c0e45cf8137ad7b76a10423";

export const metadata: Metadata = {
  title: "PairedVis — M.Sc. Thesis",
};

export default function PairedVisPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/projects"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← Back to projects
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          {project.year} · M.Sc. Thesis · University of Calgary
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-1 text-lg text-muted">
          Design and Discussion of Visualizations in Pairs
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          {project.description}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-accent-light/40 px-4 py-3">
          <p className="text-sm font-medium text-foreground">Project Video</p>
          <p className="text-xs text-muted">
            Demonstration of the PairedVis co-design tabletop system
          </p>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={PAIREDVIS_VIDEO_EMBED_URL}
            title="PairedVis — project video"
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="border-t border-border px-4 py-3">
          <a
            href={PAIREDVIS_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            Open video in OneDrive →
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <SectionHeading title="Research Contributions" />
          <ul className="space-y-3">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading title="Publication" />
          <blockquote className="rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
            Farooq, S., Carpendale, S., & Maurer, F. (2016). Pairing for Designing
            Visualizations. In F. Maurer (Ed.),{" "}
            <em>Designing Digital Surface Applications</em> (pp. 155–165). SurfNet.
          </blockquote>

          <h3 className="mt-8 font-serif text-lg font-semibold text-foreground">
            Advisors
          </h3>
          <p className="mt-2 text-sm text-muted">
            Dr. Sheelagh Carpendale & Dr. Frank Maurer — University of Calgary
          </p>

          <h3 className="mt-6 font-serif text-lg font-semibold text-foreground">
            Award
          </h3>
          <p className="mt-2 text-sm text-muted">
            Queen Elizabeth II Scholarship for research excellence in co-design
            visualization tools.
          </p>
        </section>
      </div>
    </div>
  );
}
