import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PublicationItem from "@/components/PublicationItem";
import { publications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Publications",
};

const typeOrder = ["conference", "journal", "workshop", "thesis"] as const;
const typeHeadings: Record<(typeof typeOrder)[number], string> = {
  conference: "Conference Papers",
  journal: "Journal Articles",
  workshop: "Workshop Papers",
  thesis: "Theses",
};

export default function PublicationsPage() {
  const grouped = typeOrder
    .map((type) => ({
      type,
      items: publications.filter((p) => p.type === type),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Publications"
        subtitle="Peer-reviewed papers and theses in HCI and visualization."
      />

      <p className="mb-10 text-sm text-muted">
        For a complete list, see my{" "}
        <a
          href="https://scholar.google.com"
          className="font-medium text-accent underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Scholar
        </a>{" "}
        profile. Names in <strong className="font-semibold text-foreground">bold</strong> indicate
        my authorship position in the formatted citation.
      </p>

      {grouped.map((group) => (
        <section key={group.type} className="mb-12 last:mb-0">
          <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
            {typeHeadings[group.type]}
          </h3>
          <div>
            {group.items.map((pub, i) => (
              <PublicationItem key={pub.id} publication={pub} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
