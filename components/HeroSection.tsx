"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

const SCROLL_THRESHOLD = 8;

export default function HeroSection() {
  const introRef = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(motionQuery.matches);

    const revealIntro = () => {
      setIntroVisible(true);
    };

    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        revealIntro();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        revealIntro();
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    if (!introVisible || reduceMotion || !introRef.current) return;

    introRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [introVisible, reduceMotion]);

  const showIntro = introVisible || reduceMotion;

  return (
    <section className="relative flex min-h-[82vh] flex-col overflow-hidden border-b border-border sm:min-h-[88vh]">
      {/* eslint-disable-next-line @next/next/no-img-element -- plain img so GitHub Pages basePath is always applied */}
      <img
        src={withBasePath("/hero-vangogh.png")}
        alt="Shahbano Farooq — Van Gogh style underwater portrait"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <div
          ref={introRef}
          className={`sticky bottom-0 w-full transition-all ${
            reduceMotion ? "duration-0" : "duration-300 ease-out"
          } ${
            showIntro
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
          aria-hidden={!showIntro}
        >
          <div
            className={`bg-gradient-to-t from-background via-background/97 to-transparent px-6 pb-8 pt-14 sm:pb-10 sm:pt-16 ${
              showIntro ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div className="mx-auto max-w-5xl">
              <div
                className={`rounded-xl border border-border/50 bg-background/88 px-7 py-9 shadow-xl backdrop-blur-md sm:px-10 sm:py-10 ${
                  showIntro && !reduceMotion ? "hero-intro-panel" : ""
                }`}
              >
                <p
                  className="hero-intro-item text-sm font-medium uppercase tracking-widest text-accent"
                  style={{ animationDelay: "0s" }}
                >
                  {siteConfig.title}
                </p>
                <h1
                  className="hero-intro-item mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
                  style={{ animationDelay: "0.04s" }}
                >
                  {siteConfig.name}
                </h1>
                <p
                  className="hero-intro-item mt-3 text-lg text-muted"
                  style={{ animationDelay: "0.08s" }}
                >
                  {siteConfig.department}
                </p>
                <p
                  className="hero-intro-item text-muted"
                  style={{ animationDelay: "0.12s" }}
                >
                  {siteConfig.institution}, {siteConfig.university}
                </p>
                <p
                  className="hero-intro-item mt-6 max-w-2xl text-base leading-relaxed text-muted"
                  style={{ animationDelay: "0.16s" }}
                >
                  {siteConfig.tagline}
                </p>

                <div
                  className="hero-intro-item mt-8 flex flex-wrap gap-3"
                  style={{ animationDelay: "0.2s" }}
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
      </div>

      <div
        className={`absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-300 ${
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
