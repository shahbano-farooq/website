import type { Selection } from "d3";
import type { LifeEvent } from "./data";
import { JOURNEY_PANEL_H, JOURNEY_PANEL_W, journeyPanelImages } from "./journeyPanels";

export { JOURNEY_PANEL_H, JOURNEY_PANEL_W, journeyPanelImages };

type PanelParent = Selection<SVGGElement, unknown, null, undefined>;
type DefsSelection = Selection<SVGDefsElement, unknown, null, undefined>;

export function panelTransformFor(
  x: number,
  y: number,
  side: "left" | "right",
  scale = 1
) {
  const offsetX = side === "left" ? -JOURNEY_PANEL_W - 22 : 22;
  const px = x + offsetX;
  const py = y - JOURNEY_PANEL_H / 2;
  if (scale === 1) return `translate(${px}, ${py})`;
  const cx = px + JOURNEY_PANEL_W / 2;
  const cy = py + JOURNEY_PANEL_H / 2;
  return `translate(${cx},${cy}) scale(${scale}) translate(${-JOURNEY_PANEL_W / 2},${-JOURNEY_PANEL_H / 2})`;
}

export function drawOngoingExplorationPanel(
  parent: PanelParent,
  event: LifeEvent,
  x: number,
  y: number,
  side: "left" | "right"
) {
  const offsetX = side === "left" ? -JOURNEY_PANEL_W - 22 : 22;
  const px = x + offsetX;
  const py = y - JOURNEY_PANEL_H / 2;

  const panelG = parent
    .append("g")
    .datum(event)
    .attr("class", "journey-panel journey-panel-ongoing")
    .attr("data-event-id", event.id)
    .attr("transform", `translate(${px}, ${py})`)
    .style("pointer-events", "all")
    .style("cursor", "pointer");

  panelG
    .append("rect")
    .attr("width", JOURNEY_PANEL_W)
    .attr("height", JOURNEY_PANEL_H)
    .attr("rx", 5)
    .attr("fill", "#eef6fa")
    .attr("stroke", "#2a3344")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5 3");

  const inner = panelG.append("g").attr("transform", "translate(8, 10)");

  inner
    .append("path")
    .attr(
      "d",
      "M38 8 C22 18, 10 34, 14 52 C18 68, 34 72, 48 64 C58 58, 62 44, 56 30"
    )
    .attr("fill", "none")
    .attr("stroke", "#7eb8d4")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3 2")
    .attr("opacity", 0.85);

  inner
    .append("circle")
    .attr("cx", 56)
    .attr("cy", 28)
    .attr("r", 3)
    .attr("fill", "#c47d3a");

  inner
    .append("text")
    .attr("x", 38)
    .attr("y", 88)
    .attr("text-anchor", "middle")
    .attr("fill", "#3d5a6e")
    .attr("font-size", 7)
    .attr("font-weight", 600)
    .text("Ongoing");

  inner
    .append("text")
    .attr("x", 38)
    .attr("y", 98)
    .attr("text-anchor", "middle")
    .attr("fill", "#5c7a8e")
    .attr("font-size", 6.5)
    .text("exploration");

  inner
    .append("text")
    .attr("x", 38)
    .attr("y", 108)
    .attr("text-anchor", "middle")
    .attr("fill", "#8aa8b8")
    .attr("font-size", 5.5)
    .attr("font-style", "italic")
    .text("path not yet drawn");
}

export function drawJourneyPanel(
  parent: PanelParent,
  defs: DefsSelection,
  event: LifeEvent,
  x: number,
  y: number,
  side: "left" | "right"
) {
  if (event.ongoing) {
    drawOngoingExplorationPanel(parent, event, x, y, side);
    return;
  }

  const imageSrc = journeyPanelImages[event.id];
  if (!imageSrc) return;

  const offsetX = side === "left" ? -JOURNEY_PANEL_W - 22 : 22;
  const px = x + offsetX;
  const py = y - JOURNEY_PANEL_H / 2;
  const clipId = `journey-clip-${event.id}`;
  const innerW = JOURNEY_PANEL_W - 4;
  const innerH = JOURNEY_PANEL_H - 4;

  defs
    .append("clipPath")
    .attr("id", clipId)
    .append("rect")
    .attr("width", innerW)
    .attr("height", innerH)
    .attr("rx", 4)
    .attr("ry", 4);

  const panelG = parent
    .append("g")
    .datum(event)
    .attr("class", "journey-panel")
    .attr("data-event-id", event.id)
    .attr("transform", `translate(${px}, ${py})`)
    .style("pointer-events", "all")
    .style("cursor", "pointer");

  panelG
    .append("rect")
    .attr("width", JOURNEY_PANEL_W)
    .attr("height", JOURNEY_PANEL_H)
    .attr("rx", 5)
    .attr("fill", "#fffef5")
    .attr("stroke", "#2a3344")
    .attr("stroke-width", 2);

  panelG
    .append("image")
    .attr("href", imageSrc)
    .attr("x", 2)
    .attr("y", 2)
    .attr("width", innerW)
    .attr("height", innerH)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("clip-path", `url(#${clipId})`);
}
