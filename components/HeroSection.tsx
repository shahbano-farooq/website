"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

const SCROLL_THRESHOLD = 56;

export default function HeroSection() {
  const [introVisible, setIntroVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onScroll = () => {
      setIntroVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showIntro = introVisible || reduceMotion;

  return (
    <section className="relative min-h-[78vh] overflow-hidden border-b border-border sm:min-h-[85vh]">
      {/* eslint-disable-next-line @next/next/no-img-element -- plain img so GitHub Pages basePath is always applied */}
      <img
        src={withBasePath("/hero-vangogh.png")}
        alt="Shahbano Farooq — Van Gogh style underwater portrait"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-all ${
          reduceMotion ? "duration-0" : "duration-700 ease-out"
        } ${
          showIntro
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
        aria-hidden={!showIntro}
      >
        <div className="pointer-events-auto bg-gradient-to-t from-background via-background/97 to-transparent px-6 pb-10 pt-20 sm:pb-12 sm:pt-24">
          <div className="mx-auto max-w-5xl">
            <div
              className={`rounded-xl border border-border/50 bg-background/88 px-7 py-9 shadow-xl backdrop-blur-md sm:px-10 sm:py-10 ${
                showIntro && !reduceMotion ? "hero-intro-panel" : ""
              }`}
            >
              <p
                className="hero-intro-item text-sm font-medium uppercase tracking-widest text-accent"
                style={{ animationDelay: "0.05s" }}
              >
                {siteConfig.title}
              </p>
              <h1
                className="hero-intro-item mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
                style={{ animationDelay: "0.12s" }}
              >
                {siteConfig.name}
              </h1>
              <p
                className="hero-intro-item mt-3 text-lg text-muted"
                style={{ animationDelay: "0.19s" }}
              >
                {siteConfig.department}
              </p>
              <p
                className="hero-intro-item text-muted"
                style={{ animationDelay: "0.26s" }}
              >
                {siteConfig.institution}, {siteConfig.university}
              </p>
              <p
                className="hero-intro-item mt-6 max-w-2xl text-base leading-relaxed text-muted"
                style={{ animationDelay: "0.33s" }}
              >
                {siteConfig.tagline}
              </p>

              <div
                className="hero-intro-item mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "0.42s" }}
              >
                <Link
                  href="/projects"
                  className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  View Projects
                </Link>
                <Link
                  href="/teaching"
                  className="rounded-md border border-border bg-surface/80 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  Teaching
                </Link>
                <Link
                  href="/cv"
                  className="rounded-md border border-border bg-surface/80 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  CV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${
          showIntro ? "pointer-events-none opacity-0" : "opacity-90"
        }`}
        aria-hidden={showIntro}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-white/90 drop-shadow-md">
          Scroll to meet me
        </span>
        <svg
          className="h-5 w-5 animate-bounce text-white/90 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
