import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
};

const contactMethods = [
  {
    label: "Email",
    emails: [
      { address: siteConfig.email, description: "Personal" },
      { address: siteConfig.emailSfu, description: "SFU" },
    ],
    description: "Best for research inquiries and collaboration.",
  },
  {
    label: "LinkedIn",
    value: "shahbanofarooq",
    href: siteConfig.linkedin,
    description: "Professional network and academic updates.",
  },
  {
    label: "Location",
    value: siteConfig.university,
    href: undefined,
    description: `${siteConfig.institution}, ${siteConfig.department}`,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Contact"
        subtitle="I'm always interested in discussing research, collaboration, and visualization design."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {contactMethods.map((method) => (
          <div
            key={method.label}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted">
              {method.label}
            </h3>
            {"emails" in method && method.emails ? (
              <div className="mt-2 space-y-2">
                {method.emails.map((entry) => (
                  <div key={entry.address}>
                    <a
                      href={`mailto:${entry.address}`}
                      className="block font-serif text-lg font-semibold text-accent underline-offset-2 hover:underline"
                    >
                      {entry.address}
                    </a>
                    <p className="text-xs text-muted">{entry.description}</p>
                  </div>
                ))}
              </div>
            ) : method.href ? (
              <a
                href={method.href}
                className="mt-2 block font-serif text-lg font-semibold text-accent underline-offset-2 hover:underline"
                target={method.href.startsWith("mailto:") || method.href.startsWith("tel:") ? undefined : "_blank"}
                rel={method.href.startsWith("mailto:") || method.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
              >
                {method.value}
              </a>
            ) : (
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">
                {method.value}
              </p>
            )}
            <p className="mt-2 text-sm text-muted">{method.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
