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
const PREVIEW_WIDTH = 300;
const PREVIEW_IMAGE_HEIGHT = 280;

type MilestoneNode = LifeEvent & {
  x: number;
  y: number;
  side: "left" | "right";
};

function buildRoadPoints(
  count: number,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number }
) {
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const points: { x: number; y: number; side: "left" | "right" }[] = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const y = margin.top + t * innerH;
    const wave = Math.sin(t * Math.PI * 2.6 + 0.4) * (innerW * 0.3);
    const x = margin.left + innerW * 0.5 + wave;
    points.push({ x, y, side: wave < 0 ? "left" : "right" });
  }

  return points;
}

export default function LifeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const panelPreviewRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<LifeEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState<LifeCategory | null>(null);
  const [size, setSize] = useState({ width: 720, height: 680 });

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const width = Math.min(containerRef.current!.clientWidth, 720);
      const filtered = activeCategory
        ? lifeEvents.filter((e) => e.category === activeCategory)
        : lifeEvents;
      const height = Math.max(560, filtered.length * 100 + 120);
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
    const roadPoints = buildRoadPoints(sorted.length, width, height, margin);

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

    function showPanelPreview(d: LifeEvent) {
      const preview = panelPreviewRef.current;
      if (!preview) return;
      preview.style.opacity = "1";

      const meta = `
        <div style="padding:10px 6px 4px">
          <strong style="display:block;font-size:14px;line-height:1.3;color:#1a2332;font-family:var(--font-serif),serif">${d.title}</strong>
          <span style="display:block;margin-top:4px;font-size:12px;color:#5c6574">${d.subtitle} · ${d.startYear}–${d.endYear}</span>
        </div>
      `;

      if (d.ongoing) {
        preview.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:${PREVIEW_IMAGE_HEIGHT}px;border-radius:6px;background:linear-gradient(180deg,#e8f4fa 0%,#d4e8f2 100%);border:2px dashed #7eb8d4;color:#3d5a6e;text-align:center;padding:24px">
            <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" style="margin-bottom:12px;opacity:0.9">
              <path d="M32 6 C18 16, 8 30, 12 46 C16 58, 28 60, 40 52 C50 46, 54 34, 48 22" fill="none" stroke="#7eb8d4" stroke-width="2" stroke-dasharray="4 3"/>
              <circle cx="48" cy="22" r="4" fill="#c47d3a"/>
            </svg>
            <span style="font-size:15px;font-weight:600;font-family:var(--font-serif),serif">Ongoing exploration</span>
            <span style="margin-top:6px;font-size:12px;color:#5c7a8e;font-style:italic">The path ahead is still unfolding</span>
          </div>
          ${meta}
        `;
        return;
      }

      const src = journeyPanelImages[d.id];
      if (!src) return;
      preview.innerHTML = `
        <img src="${src}" alt="${d.title}" width="${PREVIEW_WIDTH}" style="display:block;width:100%;height:${PREVIEW_IMAGE_HEIGHT}px;object-fit:cover;border-radius:6px" />
        ${meta}
      `;
    }

    function hidePanelPreview() {
      if (panelPreviewRef.current) panelPreviewRef.current.style.opacity = "0";
    }

    function highlightMilestone(d: MilestoneNode, event: MouseEvent) {
      nodeG.selectAll(".milestone").attr("opacity", (n) =>
        (n as MilestoneNode).id === d.id ? 1 : 0.4
      );
      nodeG.selectAll(".milestone-ring").attr("opacity", (n) =>
        (n as MilestoneNode).id === d.id ? 1 : 0.35
      );
      panelsG
        .selectAll<SVGGElement, LifeEvent>(".journey-panel")
        .attr("opacity", (n) => (n.id === d.id ? 1 : 0.3));
      showPanelPreview(d);
      showTooltip(event, d);
    }

    function resetHighlight() {
      nodeG.selectAll(".milestone").attr("opacity", 1);
      nodeG.selectAll(".milestone-ring").attr("opacity", 1);
      panelsG.selectAll(".journey-panel").attr("opacity", 1);
      hidePanelPreview();
      hideTooltip();
    }

    panelsG
      .selectAll<SVGGElement, LifeEvent>(".journey-panel")
      .on("mouseenter", function (event, d) {
        highlightMilestone(nodeById.get(d.id)!, event);
      })
      .on("mousemove", (event, d) => showTooltip(event, d))
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
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("r", (d.highlight ? 11 : 8) + 3);
        highlightMilestone(d, event);
      })
      .on("mousemove", (event, d) => showTooltip(event, d))
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
      .attr("y", (d) => d.y + (d.side === "left" ? 32 : -24))
      .attr("text-anchor", "middle")
      .attr("fill", INK)
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .text((d) => d.startYear);

    nodeG
      .selectAll(".place-label")
      .data(nodes.filter((d) => d.highlight))
      .join("text")
      .attr("class", "place-label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + (d.side === "left" ? 44 : -12))
      .attr("text-anchor", "middle")
      .attr("fill", "#8a7f72")
      .attr("font-size", 8)
      .text((d) => d.location.split(",")[0]);

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

    function showTooltip(event: MouseEvent, d: LifeEvent) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      if (!tooltip || !container) return;
      tooltip.style.opacity = "1";
      tooltip.innerHTML = `
        <h4>${d.title}</h4>
        <p style="font-size:12px;margin-bottom:4px">${d.subtitle} · ${d.location}</p>
        <p>${d.startYear}–${d.endYear}</p>
      `;
      const rect = container.getBoundingClientRect();
      tooltip.style.left = `${Math.min(event.clientX - rect.left + 12, rect.width - 290)}px`;
      tooltip.style.top = `${Math.max(event.clientY - rect.top - 12, 8)}px`;
    }

    function hideTooltip() {
      if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    }
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
        <div
          ref={panelPreviewRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-[min(300px,90%)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-2 shadow-2xl transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        <div ref={tooltipRef} className="life-timeline-tooltip z-20" style={{ opacity: 0 }} />
        <p className="border-t border-border/60 px-4 py-3 text-center text-xs text-muted">
          A winding road from Lahore (1999) to Vancouver — each milestone has an illustrated panel from that chapter
        </p>
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
