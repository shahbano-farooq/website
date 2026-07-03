import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PublicationItem from "@/components/PublicationItem";
import { publications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Publications",
};

const typeOrder = ["journal", "book", "chapter", "conference", "workshop", "thesis"] as const;

const typeLabels: Record<(typeof typeOrder)[number], string> = {
  journal: "Journal Articles",
  book: "Books",
  chapter: "Book Chapters",
  conference: "Conference Papers",
  workshop: "Workshop Papers",
  thesis: "Theses",
};

export default function PublicationsPage() {
  const grouped = typeOrder
    .map((type) => ({
      type,
      label: typeLabels[type],
      items: publications.filter((p) => p.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Publications"
        subtitle="Research spanning visualization co-design, immersive learning, chatbot usability, visual programming, and machine learning education."
      />

      <div className="space-y-12">
        {grouped.map((group) => (
          <section key={group.type}>
            <h3 className="mb-4 border-b border-border pb-2 font-serif text-xl font-semibold text-foreground">
              {group.label}
            </h3>
            <div>
              {group.items.map((pub, i) => (
                <PublicationItem key={pub.id} publication={pub} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
