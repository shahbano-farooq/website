import type { Publication } from "@/lib/data";

type PublicationItemProps = {
  publication: Publication;
  index?: number;
};

const typeLabels: Record<Publication["type"], string> = {
  journal: "Journal",
  conference: "Conference",
  workshop: "Workshop",
  thesis: "Thesis",
};

export default function PublicationItem({ publication, index }: PublicationItemProps) {
  return (
    <article className="group border-b border-border py-6 last:border-b-0">
      <div className="flex gap-4">
        {index !== undefined && (
          <span className="mt-0.5 w-8 shrink-0 font-serif text-lg text-muted/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded bg-background px-2 py-0.5 text-xs font-medium text-muted">
              {typeLabels[publication.type]}
            </span>
            <span className="text-xs text-muted">{publication.year}</span>
            {publication.award && (
              <span className="rounded bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
                {publication.award}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-accent">
            {publication.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{publication.authors}</p>
          <p className="mt-0.5 text-sm italic text-muted">{publication.venue}</p>

          {publication.links && publication.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {publication.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                  [{link.label}]
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
