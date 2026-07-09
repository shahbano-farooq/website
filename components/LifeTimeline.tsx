"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  categoryColors,
  categoryLabels,
  lifeEvents,
  type LifeCategory,
  type LifeEvent,
} from "@/lib/data";
import {
  JOURNEY_PANEL_W,
  drawJourneyPanel,
  journeyPanelImages,
} from "@/lib/drawJourneyPanel";

const PAINTERLY_BG = "#f7f4ef";
const INK = "#2a3344";
const ROAD_FILL = "#c4b5a0";
const ROAD_EDGE = "#8a7a66";
const PREVIEW_IMAGE_WIDTH = 280;
const PREVIEW_IMAGE_HEIGHT = 380;

function JourneyCallout({ event }: { event: LifeEvent }) {
  const accent = categoryColors[event.category];
  return (
    <>
      <span
        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
        style={{ backgroundColor: accent }}
      >
        {categoryLabels[event.category]}
      </span>
      <h4 className="mt-2 font-serif text-lg font-semibold leading-snug text-foreground">
        {event.title}
      </h4>
      <p className="mt-1 text-sm text-muted">
        {event.subtitle} · {event.location}
      </p>
      <p className="text-xs text-muted">
        {event.startYear}–{event.endYear}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{event.description}</p>
    </>
  );
}

function JourneyHoverPreview({ event }: { event: LifeEvent }) {
  const src = journeyPanelImages[event.id];

  const panel = event.ongoing ? (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#7eb8d4] bg-gradient-to-b from-[#e8f4fa] to-[#d4e8f2] text-center text-[#3d5a6e]"
      style={{
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
        maxWidth: "72vw",
        maxHeight: "52vh",
      }}
    >
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden className="mb-3 opacity-90">
        <path
          d="M32 6 C18 16, 8 30, 12 46 C16 58, 28 60, 40 52 C50 46, 54 34, 48 22"
          fill="none"
          stroke="#7eb8d4"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <circle cx="48" cy="22" r="4" fill="#c47d3a" />
      </svg>
      <span className="font-serif text-base font-semibold">Ongoing exploration</span>
      <span className="mt-2 px-6 text-sm italic text-[#5c7a8e]">
        The path ahead is still unfolding
      </span>
    </div>
  ) : src ? (
    <img
      src={src}
      alt={event.title}
      className="block object-cover"
      style={{
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
        maxWidth: "38vw",
        maxHeight: "52vh",
      }}
    />
  ) : null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-live="polite"
      role="presentation"
    >
      <div className="absolute inset-0 bg-[#1a2332]/25 backdrop-blur-[2px]" />

      <div className="relative flex flex-col items-center sm:block">
        <div className="shrink-0 overflow-hidden rounded-xl border-2 border-border bg-surface shadow-2xl">
          {panel}
        </div>

        <div className="journey-callout journey-callout--right mt-4 w-full max-w-sm rounded-xl border border-border bg-surface px-4 py-3.5 shadow-xl sm:absolute sm:left-full sm:top-1/2 sm:mt-0 sm:ml-4 sm:w-[260px] sm:-translate-y-1/2">
          <JourneyCallout event={event} />
        </div>
      </div>
    </div>
  );
}

type MilestoneNode = LifeEvent & {
  x: number;
  y: number;
  side: "left" | "right";
};

/** Normalize place names so nearby labels (e.g. Lahore / Pakistan) share a region. */
function locationKey(location: string): string {
  const loc = location.toLowerCase();
  if (loc.includes("lahore") || loc === "pakistan") return "pakistan";
  if (loc.includes("uae")) return "uae";
  if (loc.includes("calgary")) return "calgary";
  if (loc.includes("vancouver") || loc === "sfu") return "vancouver";
  return loc.split(",")[0].trim();
}

function placeLabel(location: string): string {
  const key = locationKey(location);
  if (key === "pakistan") return "Pakistan";
  if (key === "uae") return "UAE";
  if (key === "calgary") return "Calgary";
  if (key === "vancouver") return "Vancouver";
  return location.split(",")[0];
}

/** Space milestones by location change: larger gaps when the place changes. */
function buildRoadPoints(
  events: LifeEvent[],
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number }
) {
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const count = events.length;
  if (count === 0) return [];

  const SAME_PLACE = 1;
  const NEW_PLACE = 2.6;
  const weights: number[] = [0];
  for (let i = 1; i < count; i++) {
    const moved =
      locationKey(events[i].location) !== locationKey(events[i - 1].location);
    weights.push(weights[i - 1] + (moved ? NEW_PLACE : SAME_PLACE));
  }
  const total = weights[count - 1] || 1;

  return events.map((_, i) => {
    const t = count === 1 ? 0.5 : weights[i] / total;
    const y = margin.top + t * innerH;
    const wave = Math.sin(t * Math.PI * 2.6 + 0.4) * (innerW * 0.3);
    const x = margin.left + innerW * 0.5 + wave;
    return { x, y, side: (wave < 0 ? "left" : "right") as "left" | "right" };
  });
}

export default function LifeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<LifeEvent | null>(null);
  const [selected, setSelected] = useState<LifeEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState<LifeCategory | null>(null);
  const [size, setSize] = useState({ width: 720, height: 680 });

  useEffect(() => {
    setHovered(null);
  }, [activeCategory]);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const width = Math.min(containerRef.current!.clientWidth, 720);
      const filtered = activeCategory
        ? lifeEvents.filter((e) => e.category === activeCategory)
        : lifeEvents;
      // Extra height so location-change gaps stay readable
      const height = Math.max(640, filtered.length * 120 + 160);
      setSize({ width, height });
    };
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    update();
    return () => ro.disconnect();
  }, [activeCategory]);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = size;
    const margin = { top: 48, right: JOURNEY_PANEL_W + 28, bottom: 48, left: JOURNEY_PANEL_W + 28 };

    const filtered = activeCategory
      ? lifeEvents.filter((e) => e.category === activeCategory)
      : lifeEvents;

    const sorted = filtered.slice().sort((a, b) => a.startYear - b.startYear);
    const roadPoints = buildRoadPoints(sorted, width, height, margin);

    const nodes: MilestoneNode[] = sorted.map((event, i) => ({
      ...event,
      x: roadPoints[i].x,
      y: roadPoints[i].y,
      side: roadPoints[i].side,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");

    const roadLine = d3
      .line<{ x: number; y: number }>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => d.x)
      .y((d) => d.y);

    const pathData = roadPoints.map(({ x, y }) => ({ x, y }));

    if (pathData.length > 1) {
      g.append("path")
        .attr("d", roadLine(pathData))
        .attr("fill", "none")
        .attr("stroke", ROAD_EDGE)
        .attr("stroke-width", 28)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("opacity", 0.45);

      g.append("path")
        .attr("d", roadLine(pathData))
        .attr("fill", "none")
        .attr("stroke", ROAD_FILL)
        .attr("stroke-width", 22)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

      g.append("path")
        .attr("d", roadLine(pathData))
        .attr("fill", "none")
        .attr("stroke", "#e8d48a")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "6,10")
        .attr("opacity", 0.85);
    }

    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const nodeG = g.append("g").attr("class", "nodes");

    nodeG
      .selectAll(".milestone-ring")
      .data(nodes)
      .join("circle")
      .attr("class", "milestone-ring")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 16)
      .attr("fill", "#fffef5")
      .attr("stroke", ROAD_EDGE)
      .attr("stroke-width", 2);

    const defs = svg.append("defs");
    const panelsG = g.append("g").attr("class", "panels");
    nodes.forEach((node) => {
      drawJourneyPanel(panelsG, defs, node, node.x, node.y, node.side);
    });

    function showHoverPreview(d: LifeEvent) {
      setHovered(d);
    }

    function hideHoverPreview() {
      setHovered(null);
    }

    function highlightMilestone(d: MilestoneNode) {
      nodeG.selectAll(".milestone").attr("opacity", (n) =>
        (n as MilestoneNode).id === d.id ? 1 : 0.4
      );
      nodeG.selectAll(".milestone-ring").attr("opacity", (n) =>
        (n as MilestoneNode).id === d.id ? 1 : 0.35
      );
      panelsG
        .selectAll<SVGGElement, LifeEvent>(".journey-panel")
        .attr("opacity", (n) => (n.id === d.id ? 1 : 0.3));
      showHoverPreview(d);
    }

    function resetHighlight() {
      nodeG.selectAll(".milestone").attr("opacity", 1);
      nodeG.selectAll(".milestone-ring").attr("opacity", 1);
      panelsG.selectAll(".journey-panel").attr("opacity", 1);
      hideHoverPreview();
    }

    panelsG
      .selectAll<SVGGElement, LifeEvent>(".journey-panel")
      .on("mouseenter", (_, d) => {
        highlightMilestone(nodeById.get(d.id)!);
      })
      .on("mouseleave", resetHighlight)
      .on("click", (_, d) => setSelected(d));

    nodeG
      .selectAll(".milestone")
      .data(nodes)
      .join("circle")
      .attr("class", "milestone")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => (d.highlight ? 11 : 8))
      .attr("fill", (d) => categoryColors[d.category])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (_, d) {
        d3.select(this).attr("r", (d.highlight ? 11 : 8) + 3);
        highlightMilestone(d);
      })
      .on("mouseleave", function (_, d) {
        d3.select(this).attr("r", d.highlight ? 11 : 8);
        resetHighlight();
      })
      .on("click", (_, d) => setSelected(d));

    nodeG
      .selectAll(".year-label")
      .data(nodes)
      .join("text")
      .attr("class", "year-label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + (d.side === "left" ? 34 : -26))
      .attr("text-anchor", "middle")
      .attr("fill", INK)
      .attr("font-size", 12)
      .attr("font-weight", 800)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", 3)
      .text((d) => d.startYear);

    // Show place when it changes (or on the first node) so moves stand out
    const placeNodes = nodes.filter(
      (d, i) =>
        i === 0 ||
        locationKey(d.location) !== locationKey(nodes[i - 1].location)
    );

    nodeG
      .selectAll(".place-label")
      .data(placeNodes)
      .join("text")
      .attr("class", "place-label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + (d.side === "left" ? 50 : -12))
      .attr("text-anchor", "middle")
      .attr("fill", INK)
      .attr("font-size", 11)
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", 3)
      .text((d) => placeLabel(d.location));

    g.append("text")
      .attr("x", margin.left)
      .attr("y", 24)
      .attr("fill", "#8a7f72")
      .attr("font-size", 10)
      .attr("font-weight", 500)
      .text("Lahore · 1999");

    g.append("text")
      .attr("x", width - margin.right)
      .attr("y", height - 16)
      .attr("text-anchor", "end")
      .attr("fill", "#8a7f72")
      .attr("font-size", 10)
      .attr("font-weight", 500)
      .text("Vancouver · Now");
  }, [activeCategory, size]);

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Follow a path:</span>
        {(Object.keys(categoryLabels) as LifeCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "text-white"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
            style={
              activeCategory === cat
                ? { backgroundColor: categoryColors[cat] }
                : undefined
            }
          >
            {categoryLabels[cat]}
          </button>
        ))}
        {activeCategory && (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="text-xs text-accent underline-offset-2 hover:underline"
          >
            Show all
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto overflow-hidden rounded-xl border border-border"
        style={{ background: PAINTERLY_BG, maxWidth: 720 }}
      >
        <svg
          ref={svgRef}
          className="mx-auto block"
          role="img"
          aria-label="Winding road life journey visualization"
        />
        <p className="border-t border-border/60 px-4 py-3 text-center text-xs text-muted">
          A winding road from Lahore (1999) to Vancouver — each milestone has an illustrated panel from that chapter
        </p>
      </div>

      {hovered && <JourneyHoverPreview event={hovered} />}

      {selected && (
        <div className="mt-6 rounded-lg border border-border bg-accent-light/30 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: categoryColors[selected.category] }}
              >
                {categoryLabels[selected.category]}
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold text-foreground">
                {selected.title}
              </h3>
              <p className="text-sm text-muted">
                {selected.subtitle} · {selected.location} · {selected.startYear}–{selected.endYear}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{selected.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 text-muted hover:text-foreground"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
