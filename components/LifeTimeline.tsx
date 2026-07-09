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
  JOURNEY_PANEL_H,
  JOURNEY_PANEL_W,
  JOURNEY_SCALE,
  drawJourneyPanel,
  journeyPanelImages,
  panelCenterFrom,
  type PanelPlacement,
} from "@/lib/drawJourneyPanel";
import {
  eventSegment,
  filterJourneyEvents,
  journeyGaps,
  segmentMidpoint,
  yearRangeLabel,
  yearToT,
} from "@/lib/journeyTimeline";

const PAINTERLY_BG = "#f7f4ef";
const INK = "#2a3344";
const ROAD_FILL = "#c4b5a0";
const ROAD_EDGE = "#8a7a66";
const GAP_ROAD = "#d8cfc0";
const PREVIEW_IMAGE_WIDTH = 220;
const PREVIEW_IMAGE_HEIGHT = 300;

const s = (value: number) => Math.round(value * JOURNEY_SCALE);
const STRIP_WIDTH = s(14);

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
      <p className="text-xs text-muted">{yearRangeLabel(event)}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{event.description}</p>
    </>
  );
}

function JourneyHoverPreview({
  event,
  active = false,
}: {
  event: LifeEvent;
  active?: boolean;
}) {
  const src = journeyPanelImages[event.id];

  const panel = event.ongoing ? (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#7eb8d4] bg-gradient-to-b from-[#e8f4fa] to-[#d4e8f2] text-center text-[#3d5a6e]"
      style={{
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 64 64" aria-hidden className="mb-2 opacity-90">
        <path
          d="M32 6 C18 16, 8 30, 12 46 C16 58, 28 60, 40 52 C50 46, 54 34, 48 22"
          fill="none"
          stroke="#7eb8d4"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <circle cx="48" cy="22" r="4" fill="#c47d3a" />
      </svg>
      <span className="font-serif text-sm font-semibold">Ongoing exploration</span>
      <span className="mt-1.5 px-4 text-xs italic text-[#5c7a8e]">
        The path ahead is still unfolding
      </span>
    </div>
  ) : src ? (
    <img
      src={src}
      alt={event.title}
      className="block w-full object-contain"
      style={{
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
      }}
    />
  ) : null;

  return (
    <div
      className={`rounded-xl border bg-surface/95 p-3 shadow-lg backdrop-blur-sm ${
        active ? "border-accent ring-2 ring-accent/30" : "border-border"
      }`}
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-[#fffef5]">
        {panel}
      </div>
      <div className="mt-3">
        <JourneyCallout event={event} />
      </div>
    </div>
  );
}

type PathPoint = { x: number; y: number; t: number };

type MilestoneNode = LifeEvent & {
  x: number;
  y: number;
  angle: number;
  placement: PanelPlacement;
  tMid: number;
  t0: number;
  t1: number;
};

type SpiralLayout = {
  cx: number;
  cy: number;
  pathPoints: PathPoint[];
  labelPad: number;
  pointAt: (t: number) => {
    x: number;
    y: number;
    angle: number;
    placement: PanelPlacement;
  };
};

const NODE_MARKER_R = s(5);
const PANEL_GAP = s(5);
const JOURNEY_MAX_HEIGHT_RATIO = 0.58 * JOURNEY_SCALE;
const JOURNEY_MAX_WIDTH_PX = s(768);
const JOURNEY_MAX_HEIGHT_PX = s(560);

function panelDistance(t: number) {
  return NODE_MARKER_R + PANEL_GAP + JOURNEY_PANEL_H / 2 + t * s(4);
}

/** Archimedean spiral mapped to calendar years (1999 → present). */
function buildSpiralLayout(layoutWidth: number): SpiralLayout {
  const cx = layoutWidth / 2;
  const cy = layoutWidth / 2;
  const panelPad = JOURNEY_PANEL_W / 2 + s(22);
  const labelPad = s(20);
  const maxR = layoutWidth / 2 - panelPad;
  const minR = Math.max(s(30), maxR * 0.1);
  const turns = 2;
  const totalAngle = turns * Math.PI * 2;
  const startAngle = -Math.PI / 2;

  const pointAt = (t: number) => {
    const angle = startAngle + t * totalAngle;
    const r = minR + t * (maxR - minR);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
      placement: {
        type: "radial" as const,
        angle,
        distance: panelDistance(t),
      },
    };
  };

  const pathSamples = 220;
  const pathPoints: PathPoint[] = Array.from({ length: pathSamples + 1 }, (_, i) => {
    const t = i / pathSamples;
    const { x, y } = pointAt(t);
    return { x, y, t };
  });

  return { cx, cy, pathPoints, labelPad, pointAt };
}

function slicePathByT(pathPoints: PathPoint[], t0: number, t1: number): PathPoint[] {
  return pathPoints.filter((p) => p.t >= t0 - 0.0001 && p.t <= t1 + 0.0001);
}

function computeJourneyBounds(
  nodes: MilestoneNode[],
  spiral: SpiralLayout,
  showOrigin: boolean,
  showGaps: boolean
) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const pad = s(10);

  const include = (x: number, y: number, radius = 0) => {
    minX = Math.min(minX, x - radius);
    minY = Math.min(minY, y - radius);
    maxX = Math.max(maxX, x + radius);
    maxY = Math.max(maxY, y + radius);
  };

  for (const p of spiral.pathPoints) {
    include(p.x, p.y, STRIP_WIDTH);
  }

  if (showOrigin) {
    include(spiral.cx, spiral.cy, s(28));
  }

  for (const node of nodes) {
    include(node.x, node.y, NODE_MARKER_R + s(6));
    const { cx, cy } = panelCenterFrom(node.x, node.y, node.placement);
    include(cx, cy, JOURNEY_PANEL_W / 2 + 4);
    include(cx, cy, JOURNEY_PANEL_H / 2 + 4);
    const labels = labelsAbovePanel(node);
    include(labels.year.x, labels.year.y, 8);
    include(labels.place.x, labels.place.y, 8);
  }

  if (showGaps) {
    for (const gap of journeyGaps) {
      const tMid = (yearToT(gap.startYear) + yearToT(gap.endYear)) / 2;
      const pt = spiral.pointAt(tMid);
      include(pt.x, pt.y, s(24));
    }
  }

  if (nodes.length > 0) {
    const last = nodes[nodes.length - 1];
    const { cx, cy } = panelCenterFrom(last.x, last.y, last.placement);
    include(cx, cy + JOURNEY_PANEL_H / 2 + s(20), s(12));
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: spiral.cx * 2, maxY: spiral.cy * 2 };
  }

  return {
    minX: minX - pad,
    minY: minY - pad - spiral.labelPad,
    maxX: maxX + pad,
    maxY: maxY + pad,
  };
}

function labelsAbovePanel(node: MilestoneNode) {
  const { cx, cy } = panelCenterFrom(node.x, node.y, node.placement);
  const panelTop = cy - JOURNEY_PANEL_H / 2;
  return {
    year: { x: cx, y: panelTop - s(16) },
    place: { x: cx, y: panelTop - s(5) },
  };
}

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

function defaultPreviewEvent(category: LifeCategory | null): LifeEvent | null {
  if (!category) {
    return lifeEvents.find((e) => e.id === "phd") ?? null;
  }
  const sorted = filterJourneyEvents(category)
    .slice()
    .sort((a, b) => a.startYear - b.startYear);
  return sorted[sorted.length - 1] ?? null;
}

export default function LifeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<LifeEvent | null>(() => defaultPreviewEvent(null));
  const [selected, setSelected] = useState<LifeEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState<LifeCategory | null>(null);
  const [width, setWidth] = useState(JOURNEY_MAX_WIDTH_PX);
  const [maxHeight, setMaxHeight] = useState(JOURNEY_MAX_HEIGHT_PX);

  useEffect(() => {
    setHovered(defaultPreviewEvent(activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      setWidth(containerRef.current!.clientWidth);
      setMaxHeight(
        Math.min(
          JOURNEY_MAX_HEIGHT_PX,
          Math.round(window.innerHeight * JOURNEY_MAX_HEIGHT_RATIO)
        )
      );
    };
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    window.addEventListener("resize", update);
    update();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeCategory]);

  useEffect(() => {
    if (!svgRef.current) return;

    const filtered = filterJourneyEvents(activeCategory);
    const sorted = filtered.slice().sort((a, b) => a.startYear - b.startYear);
    const spiral = buildSpiralLayout(width);

    const nodes: MilestoneNode[] = sorted.map((event) => {
      const { t0, t1 } = eventSegment(event);
      const tMid = segmentMidpoint(event);
      const pt = spiral.pointAt(tMid);
      return {
        ...event,
        x: pt.x,
        y: pt.y,
        angle: pt.angle,
        placement: pt.placement,
        tMid,
        t0,
        t1,
      };
    });

    const showOrigin = !activeCategory;
    const showGaps = !activeCategory;
    const bounds = computeJourneyBounds(nodes, spiral, showOrigin, showGaps);
    const vbW = bounds.maxX - bounds.minX;
    const vbH = bounds.maxY - bounds.minY;
    const naturalHeight = width * (vbH / vbW);
    const svgHeight = Math.min(maxHeight, Math.max(s(280), naturalHeight));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("width", width)
      .attr("height", svgHeight)
      .attr("viewBox", `${bounds.minX} ${bounds.minY} ${vbW} ${vbH}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g");

    const spiralLine = d3
      .line<PathPoint>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => d.x)
      .y((d) => d.y);

    const pathData = spiral.pathPoints;

    if (pathData.length > 1) {
      g.append("path")
        .attr("d", spiralLine(pathData))
        .attr("fill", "none")
        .attr("stroke", ROAD_EDGE)
        .attr("stroke-width", s(16))
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("opacity", 0.45);

      g.append("path")
        .attr("d", spiralLine(pathData))
        .attr("fill", "none")
        .attr("stroke", ROAD_FILL)
        .attr("stroke-width", s(12))
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

      if (showGaps) {
        for (const gap of journeyGaps) {
          const gapPoints = slicePathByT(
            pathData,
            yearToT(gap.startYear),
            yearToT(gap.endYear)
          );
          if (gapPoints.length > 1) {
            g.append("path")
              .attr("d", spiralLine(gapPoints))
              .attr("fill", "none")
              .attr("stroke", GAP_ROAD)
              .attr("stroke-width", s(12))
              .attr("stroke-linecap", "butt")
              .attr("stroke-linejoin", "round")
              .attr("stroke-dasharray", "2,6")
              .attr("opacity", 0.85);
          }
        }
      }

      g.append("path")
        .attr("d", spiralLine(pathData))
        .attr("fill", "none")
        .attr("stroke", "#e8d48a")
        .attr("stroke-width", s(2))
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "6,10")
        .attr("opacity", 0.85);
    }

    const stripsG = g.append("g").attr("class", "strips");

    sorted.forEach((event) => {
      const { t0, t1 } = eventSegment(event);
      const segmentPoints = slicePathByT(pathData, t0, t1);
      if (segmentPoints.length < 2) return;

      const color = categoryColors[event.category];

      stripsG
        .append("path")
        .datum(event)
        .attr("class", "journey-strip")
        .attr("data-event-id", event.id)
        .attr("d", spiralLine(segmentPoints)!)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", STRIP_WIDTH)
        .attr("stroke-linecap", "butt")
        .attr("stroke-linejoin", "round")
        .attr("opacity", 1);

      stripsG
        .append("path")
        .datum(event)
        .attr("class", "journey-strip-hit")
        .attr("d", spiralLine(segmentPoints)!)
        .attr("fill", "none")
        .attr("stroke", "transparent")
        .attr("stroke-width", s(22))
        .attr("stroke-linecap", "round")
        .style("cursor", "pointer");
    });

    if (showOrigin) {
      g.append("circle")
        .attr("cx", spiral.cx)
        .attr("cy", spiral.cy)
        .attr("r", s(22))
        .attr("fill", "#fffef5")
        .attr("stroke", ROAD_EDGE)
        .attr("stroke-width", s(1.5))
        .attr("opacity", 0.9);

      g.append("text")
        .attr("x", spiral.cx)
        .attr("y", spiral.cy - s(4))
        .attr("text-anchor", "middle")
        .attr("fill", "#8a7f72")
        .attr("font-size", s(9))
        .attr("font-weight", 600)
        .text("1999");

      g.append("text")
        .attr("x", spiral.cx)
        .attr("y", spiral.cy + s(10))
        .attr("text-anchor", "middle")
        .attr("fill", "#8a7f72")
        .attr("font-size", s(8))
        .text("Lahore");
    }

    if (showGaps) {
      for (const gap of journeyGaps) {
        const tMid = (yearToT(gap.startYear) + yearToT(gap.endYear)) / 2;
        const pt = spiral.pointAt(tMid);
        g.append("text")
          .attr("x", pt.x)
          .attr("y", pt.y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#9a8f82")
          .attr("font-size", s(8))
          .attr("font-weight", 600)
          .attr("font-style", "italic")
          .attr("paint-order", "stroke")
          .attr("stroke", PAINTERLY_BG)
          .attr("stroke-width", s(3))
          .text(`${gap.startYear}–${gap.endYear}`);
      }
    }

    const defs = svg.append("defs");
    const panelsG = g.append("g").attr("class", "panels");
    nodes.forEach((node) => {
      drawJourneyPanel(panelsG, defs, node, node.x, node.y, node.placement);
    });

    const nodeG = g.append("g").attr("class", "nodes");

    const defaultPreview = defaultPreviewEvent(activeCategory);
    const defaultNode = defaultPreview
      ? nodes.find((n) => n.id === defaultPreview.id)
      : undefined;

    function showPreview(d: LifeEvent) {
      setHovered(d);
    }

    function resetPreview() {
      if (defaultNode) {
        showPreview(defaultNode);
      } else {
        setHovered(null);
      }
    }

    stripsG
      .selectAll<SVGPathElement, LifeEvent>(".journey-strip-hit")
      .on("mouseenter", (_, d) => showPreview(d))
      .on("mouseleave", resetPreview)
      .on("click", (_, d) => setSelected(d));

    panelsG
      .selectAll<SVGGElement, LifeEvent>(".journey-panel")
      .on("mouseenter", (_, d) => showPreview(d))
      .on("mouseleave", resetPreview)
      .on("click", (_, d) => setSelected(d));

    nodeG
      .selectAll(".path-marker")
      .data(nodes)
      .join("circle")
      .attr("class", "path-marker")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", NODE_MARKER_R)
      .attr("fill", (d) => categoryColors[d.category])
      .attr("stroke", "#fff")
      .attr("stroke-width", s(2))
      .attr("paint-order", "stroke")
      .style("cursor", "pointer")
      .on("mouseenter", (_, d) => showPreview(d))
      .on("mouseleave", resetPreview)
      .on("click", (_, d) => setSelected(d));

    nodeG
      .selectAll(".year-label")
      .data(nodes)
      .join("text")
      .attr("class", "year-label")
      .attr("x", (d) => labelsAbovePanel(d).year.x)
      .attr("y", (d) => labelsAbovePanel(d).year.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "auto")
      .attr("fill", INK)
      .attr("font-size", s(9))
      .attr("font-weight", 800)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", s(3))
      .text((d) => yearRangeLabel(d));

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
      .attr("x", (d) => labelsAbovePanel(d).place.x)
      .attr("y", (d) => labelsAbovePanel(d).place.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "auto")
      .attr("fill", INK)
      .attr("font-size", s(9))
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", s(3))
      .text((d) => placeLabel(d.location));

    if (!activeCategory && nodes.length > 0 && nodes[nodes.length - 1].id === "phd") {
      const last = nodes[nodes.length - 1];
      const { cx, cy } = panelCenterFrom(last.x, last.y, last.placement);
      const panelBottom = cy + JOURNEY_PANEL_H / 2;
      g.append("text")
        .attr("x", cx)
        .attr("y", panelBottom + s(12))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "auto")
        .attr("fill", "#8a7f72")
        .attr("font-size", s(10))
        .attr("font-weight", 600)
        .text("Vancouver · Now");
    }
  }, [activeCategory, width, maxHeight]);

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Follow the spiral:</span>
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

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span className="font-medium text-foreground">Strip colors:</span>
        {(["education", "industry", "teaching", "research"] as LifeCategory[]).map(
          (cat) => (
            <span key={cat} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-6 rounded-full"
                style={{ backgroundColor: categoryColors[cat] }}
              />
              {categoryLabels[cat]}
            </span>
          )
        )}
      </div>

      <div className="flex flex-col items-stretch gap-4 xl:flex-row xl:items-start xl:gap-6">
        <div
          ref={containerRef}
          className="relative mx-auto w-full min-w-0 flex-1 overflow-visible rounded-xl border border-border"
          style={{ background: PAINTERLY_BG, maxWidth: JOURNEY_MAX_WIDTH_PX }}
        >
          <svg
            ref={svgRef}
            className="mx-auto block"
            role="img"
            aria-label="Spiral life journey visualization"
          />
          <p className="border-t border-border/60 px-4 py-3 text-center text-xs text-muted">
            Colored strips along the spiral mark each chapter — length follows years on the path from Lahore (1999) to Vancouver today
          </p>
        </div>

        {hovered && (
          <aside className="w-full shrink-0 xl:sticky xl:top-24 xl:w-72">
            <JourneyHoverPreview event={hovered} active={true} />
          </aside>
        )}
      </div>

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
                {selected.subtitle} · {selected.location} · {yearRangeLabel(selected)}
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
