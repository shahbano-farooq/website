import type { Publication } from "@/lib/data";

const typeLabels: Record<Publication["type"], string> = {
  journal: "Journal",
  conference: "Conference",
  workshop: "Workshop",
  thesis: "Theses",
  book: "Book",
  chapter: "Book Chapter",
};

export default function PublicationItem({
  publication,
  index,
}: {
  publication: Publication;
  index: number;
}) {
  return (
    <article
      className={`py-5 ${index > 0 ? "border-t border-border" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
          {typeLabels[publication.type]}
        </span>
        <span className="text-sm text-muted">{publication.year}</span>
      </div>
      <h3 className="mt-2 font-medium leading-snug text-foreground">
        {publication.title}
      </h3>
      <p className="mt-1 text-sm text-muted">{publication.authors}</p>
      <p className="mt-0.5 text-sm italic text-muted">{publication.venue}</p>
      {publication.links && publication.links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {publication.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
