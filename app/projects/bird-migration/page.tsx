import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data";

const project = projects.find((p) => p.id === "bird-migration")!;

const BIRD_MIGRATION_VIDEO_URL =
  "https://1sfu-my.sharepoint.com/:v:/r/personal/sfa143_sfu_ca/Documents/Final%20Project%20Video/Final%20Video%20View%203%20_v4.mp4?csf=1&web=1&e=fUjgFs&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D";

const BIRD_MIGRATION_VIDEO_EMBED_URL = `https://1sfu-my.sharepoint.com/personal/sfa143_sfu_ca/_layouts/15/embed.aspx?newTargetListUrl=${encodeURIComponent(
  "https://1sfu-my.sharepoint.com/personal/sfa143_sfu_ca/Documents/Final%20Project%20Video/Final%20Video%20View%203%20_v4.mp4"
)}`;

export const metadata: Metadata = {
  title: "Bird Migration Visualization",
};

export default function BirdMigrationPage() {
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
          {project.year} · Information Visualization
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{project.description}</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-accent-light/40 px-4 py-3">
          <p className="text-sm font-medium text-foreground">Project Video</p>
          <p className="text-xs text-muted">
            Final walkthrough of the bird migration visualization
          </p>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={BIRD_MIGRATION_VIDEO_EMBED_URL}
            title="Bird Migration Visualization — project video"
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="border-t border-border px-4 py-3">
          <a
            href={BIRD_MIGRATION_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            Open video in SharePoint →
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Key Features
          </h2>
          <ul className="mt-4 space-y-2">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Technologies
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="mt-8 font-serif text-xl font-semibold text-foreground">
            Data Source
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Historical bird migration records collected from ornithological books,
            encoding migratory routes, seasonal timing, bird categories, and
            geographic waypoints across origin, transit, and destination nodes.
          </p>
        </section>
      </div>
    </div>
  );
}
