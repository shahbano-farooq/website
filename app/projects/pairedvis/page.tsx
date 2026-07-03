import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

const project = projects.find((p) => p.id === "pairedvis")!;

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

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-black">
        <video
          className="mx-auto block max-h-[520px] w-full"
          controls
          preload="metadata"
          playsInline
        >
          <source
            src={withBasePath("/projects/pairedvis/pairedvis-demo.mp4")}
            type="video/mp4"
          />
          Your browser does not support embedded video playback.
        </video>
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
