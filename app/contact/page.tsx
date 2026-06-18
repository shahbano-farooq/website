import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
};

const contactMethods = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    description: "Best for research inquiries and collaboration.",
  },
  {
    label: "Office",
    value: siteConfig.office,
    href: undefined,
    description: `${siteConfig.university}. Available by appointment.`,
  },
  {
    label: "GitHub",
    value: "shahbano-farooq",
    href: siteConfig.github,
    description: "Open-source projects and code.",
  },
  {
    label: "Google Scholar",
    value: siteConfig.name,
    href: siteConfig.scholar,
    description: "Full publication list and citations.",
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
            {method.href ? (
              <a
                href={method.href}
                className="mt-2 block font-serif text-lg font-semibold text-accent underline-offset-2 hover:underline"
                target={method.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={method.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
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

      <section className="mt-12 rounded-lg border border-border bg-surface p-8">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Send a Message
        </h3>
        <p className="mt-2 text-sm text-muted">
          For the quickest response, email me directly. I typically reply within
          2–3 business days.
        </p>
        <form className="mt-6 space-y-4" action={`mailto:${siteConfig.email}`} method="post">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Research collaboration, etc."
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
