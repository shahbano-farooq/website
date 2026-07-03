import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { cvSections, siteConfig } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "CV",
};

export default function CVPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Curriculum Vitae"
          subtitle={`${siteConfig.name} — ${siteConfig.department}`}
        />
        <a
          href={withBasePath("/cv/Shahbano_Farooq_CV_2026.pdf")}
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </a>
      </div>

      <div className="space-y-12">
        {cvSections.map((section) => (
          <section key={section.title}>
            <h3 className="mb-4 border-b border-border pb-2 font-serif text-xl font-semibold text-foreground">
              {section.title}
            </h3>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div
                  key={item.heading + item.period}
                  className="flex flex-col gap-1 sm:flex-row sm:gap-8"
                >
                  <div className="shrink-0 sm:w-36">
                    {item.period && (
                      <p className="text-sm font-medium text-accent">{item.period}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.heading}</h4>
                    {item.subheading && (
                      <p className="text-sm text-muted">{item.subheading}</p>
                    )}
                    {item.details && (
                      <ul className="mt-2 space-y-1">
                        {item.details.map((detail) => (
                          <li key={detail} className="text-sm text-muted">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
