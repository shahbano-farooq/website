import Link from "next/link";
import { siteConfig } from "@/lib/data";

const socialLinks = [
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: siteConfig.linkedin },
  { label: "GitHub", href: siteConfig.github },
  { label: "Google Scholar", href: siteConfig.scholar },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
