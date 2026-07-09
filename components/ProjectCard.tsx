import Link from "next/link";
import type { Project } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md">
      <div className="flex h-48 items-center justify-center overflow-hidden bg-background p-3">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- plain img so GitHub Pages basePath is always applied
          <img
            src={withBasePath(project.image)}
            alt={project.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent-light/30 text-sm text-muted">
            {project.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            {project.year}
          </p>
          {project.featured && (
            <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs text-accent">
              Featured
            </span>
          )}
        </div>
        <h3 className="mt-2 font-serif text-xl font-semibold text-foreground group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={project.href}
          className="mt-5 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          View project →
        </Link>
      </div>
    </article>
  );
}
