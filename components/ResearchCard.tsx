import type { ResearchProject } from "@/lib/data";

type ResearchCardProps = {
  project: ResearchProject;
};

export default function ResearchCard({ project }: ResearchCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === "ongoing"
              ? "bg-accent-light text-accent"
              : "bg-background text-muted"
          }`}
        >
          {project.status === "ongoing" ? "Ongoing" : "Completed"}
        </span>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="font-serif text-xl font-semibold text-foreground">{project.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

      {project.collaborators && (
        <p className="mt-3 text-xs text-muted">
          <span className="font-medium text-foreground">Collaborators:</span>{" "}
          {project.collaborators.join(", ")}
        </p>
      )}

      {project.links && project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
