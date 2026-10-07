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
  journeyOriginImage,
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
const PREVIEW_IMAGE_WIDTH = 220;
const PREVIEW_IMAGE_HEIGHT = 300;

const s = (value: number) => Math.round(value * JOURNEY_SCALE);
/** Ribbon tapers like a seashell: thin at the centre, widest on the outer coil. */
const BAND_MIN_W = s(8);
const BAND_MAX_W = s(44);

type PlaceKey = "lahore" | "uae" | "calgary" | "vancouver";
type TextileKey = PlaceKey | "family";

const THREAD = "#fff6e0";
const DYE_DARK = "#1b1f2a";
const DYE_RED = "#b5332e";
const FAMILY_COLOR = "#c47a8f";

/** One layer of a fabric tile: a printed/woven fill or an embroidered stroke. */
type TextileMark = {
  d: string;
  fill?: string;
  stroke?: string;
  opacity?: number;
  width?: number;
  dash?: string;
};

type TextileSpec = {
  label: string;
  width: number;
  height: number;
  marks: TextileMark[];
};

const dot = (x: number, y: number, r: number) =>
  `M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

const CHUNRI_K = 1.4;
const CHUNRI_W = 24 * CHUNRI_K;
const CHUNRI_H = 18 * CHUNRI_K;
const chunriWave = (x: number, baseY: number, amp: number, phase = 0) =>
  (baseY + amp * Math.sin(((x + phase) / 24) * Math.PI * 2)) * CHUNRI_K;
/** Tied dots following waves: a double row, then a looser row of larger dots. */
const CHUNRI_DOTS = [
  ...Array.from({ length: 12 }, (_, i) => {
    const x = 1 + i * 2;
    return { x: x * CHUNRI_K, y: chunriWave(x, 4, 2.2), r: 0.95 + (i % 3) * 0.08 };
  }),
  ...Array.from({ length: 12 }, (_, i) => {
    const x = 2 + i * 2;
    return { x: x * CHUNRI_K, y: chunriWave(x, 6.6, 2.2), r: 0.95 + ((i + 1) % 3) * 0.08 };
  }),
  ...Array.from({ length: 8 }, (_, i) => {
    const x = 1.5 + i * 3;
    return { x: x * CHUNRI_K, y: chunriWave(x, 13, 1.8, 6), r: 1.25 + (i % 2) * 0.12 };
  }),
];
const CHUNRI_GREEN = "#3e7a3c";
const CHUNRI_DOT = "#fffaf0";
/** Darker dye that crept along the folds while the cloth was bound. */
const CHUNRI_STREAKS = [
  [2, 3, 1, 2.5],
  [8.5, 7.5, 10, 8.5],
  [14.5, 16, 13.5, 15],
  [20.5, 19.5, 21.5, 20.5],
]
  .map(([a, b, c, d]) => {
    const k = CHUNRI_K;
    return `M${a * k} 0 C${b * k} ${4 * k} ${c * k} ${9 * k} ${d * k} ${18 * k}`;
  })
  .join(" ");
const LEAF_GREEN = "#5f8f4e";
const DOGWOOD_VEIN = "#cbbd8f";
const DOGWOOD_CENTRE = "#b9a334";
const rotate = (x: number, y: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};
const shapeAt = (cx: number, cy: number, deg: number, pts: [number, number][]) =>
  pts.map(([x, y]) => {
    const [rx, ry] = rotate(x, y, deg);
    return `${(cx + rx).toFixed(2)} ${(cy + ry).toFixed(2)}`;
  });
/** Four broad dogwood bracts, each with the notched tip the flower is known for. */
const dogwood = (cx: number, cy: number, deg: number) =>
  [0, 90, 180, 270]
    .map((a) => {
      const [o, c1, c2, t1, n, t2, c3, c4] = shapeAt(cx, cy, deg + a, [
        [0, 0], [-2.6, -1.2], [-2.6, -4.2], [-0.8, -4.6],
        [0, -4.0], [0.8, -4.6], [2.6, -4.2], [2.6, -1.2],
      ]);
      return `M${o} C${c1} ${c2} ${t1} L${n} L${t2} C${c3} ${c4} ${o} Z`;
    })
    .join(" ");
const leaf = (cx: number, cy: number, deg: number) => {
  const [a, c1, c2, b, c3, c4] = shapeAt(cx, cy, deg, [
    [-4, 0], [-2, -2.4], [2, -2.4], [4, 0], [2, 2.4], [-2, 2.4],
  ]);
  return `M${a} C${c1} ${c2} ${b} C${c3} ${c4} ${a} Z`;
};
const heart = (x: number, bottomY: number) =>
  `M${x} ${bottomY} c-2.5 -2 -4 -3.2 -4 -4.8 a2 2 0 0 1 4 -0.8 a2 2 0 0 1 4 0.8 c0 1.6 -1.5 2.8 -4 4.8 z`;

/** Regional textiles laid over each chapter's felt colour. */
const TEXTILE_PATTERNS: Record<TextileKey, TextileSpec> = {
  // Punjabi chunri (bandhani) tie-dye: rows of small hollow resist dots following waves.
  lahore: {
    label: "Murree & Lahore · Chunri tie-dye",
    width: CHUNRI_W,
    height: CHUNRI_H,
    marks: [
      { d: `M0 0 H${CHUNRI_W} V${CHUNRI_H} H0 Z`, fill: CHUNRI_GREEN },
      { d: CHUNRI_STREAKS, stroke: DYE_DARK, width: 0.5, opacity: 0.22 },
      { d: CHUNRI_DOTS.map((p) => dot(p.x, p.y, p.r)).join(" "), fill: CHUNRI_DOT, opacity: 0.95 },
      { d: CHUNRI_DOTS.map((p) => dot(p.x, p.y, p.r * 0.4)).join(" "), fill: CHUNRI_GREEN },
    ],
  },
  // Emirati Al Sadu weaving: banded stripes framing a row of diamonds and teeth.
  uae: {
    label: "UAE · Al Sadu weave",
    width: 16,
    height: 14,
    marks: [
      { d: "M0 0 H16 V1.2 H0 Z M0 12.8 H16 V14 H0 Z", fill: DYE_DARK, opacity: 0.5 },
      { d: "M0 1.9 H16 V2.7 H0 Z M0 11.3 H16 V12.1 H0 Z", fill: THREAD, opacity: 0.8 },
      { d: "M0 3.4 H16 V10.6 H0 Z", fill: DYE_RED, opacity: 0.55 },
      { d: "M8 3.6 L11.4 7 L8 10.4 L4.6 7 Z", fill: THREAD, opacity: 0.9 },
      { d: "M8 5.4 L9.6 7 L8 8.6 L6.4 7 Z", fill: DYE_DARK, opacity: 0.75 },
      { d: "M0 3.6 L3.4 7 L0 10.4 Z M16 3.6 L12.6 7 L16 10.4 Z", fill: DYE_DARK, opacity: 0.6 },
      {
        d: "M0 3.4 L1 4.4 L2 3.4 L3 4.4 L4 3.4 M12 10.6 L13 9.6 L14 10.6 L15 9.6 L16 10.6",
        stroke: THREAD,
        width: 0.5,
        opacity: 0.7,
      },
    ],
  },
  // Western flannel plaid, as worn at the Calgary Stampede.
  calgary: {
    label: "Calgary · Western plaid",
    width: 16,
    height: 16,
    marks: [
      { d: "M0 0 H6 V16 H0 Z", fill: DYE_DARK, opacity: 0.28 },
      { d: "M0 0 H16 V6 H0 Z", fill: DYE_DARK, opacity: 0.28 },
      { d: "M3 0 V16 M0 3 H16", stroke: DYE_RED, width: 0.9, opacity: 0.85 },
      { d: "M10.5 0 V16 M0 10.5 H16", stroke: THREAD, width: 0.7, opacity: 0.6 },
      {
        d: "M0 4 L4 0 M0 8 L8 0 M0 12 L12 0 M0 16 L16 0 M4 16 L16 4 M8 16 L16 8 M12 16 L16 12",
        stroke: DYE_DARK,
        width: 0.3,
        opacity: 0.18,
      },
    ],
  },
  // Crewel embroidery of the Pacific dogwood, British Columbia's floral emblem.
  vancouver: {
    label: "Vancouver · Dogwood embroidery",
    width: 24,
    height: 24,
    marks: [
      { d: "M0 0 H24 V24 H0 Z", fill: DYE_DARK, opacity: 0.12 },
      { d: `${leaf(19, 6, -30)} ${leaf(5, 18, 150)}`, fill: LEAF_GREEN, opacity: 0.55 },
      {
        d: `${leaf(19, 6, -30)} ${leaf(5, 18, 150)}`,
        stroke: THREAD,
        width: 0.55,
        opacity: 0.85,
        dash: "1.1 0.9",
      },
      { d: `${dogwood(7, 7, 20)} ${dogwood(19, 19, 65)}`, fill: THREAD, opacity: 0.95 },
      {
        d: [20, 110, 200, 290, 65, 155, 245, 335]
          .map((a, i) => {
            const [cx, cy] = i < 4 ? [7, 7] : [19, 19];
            const [x, y] = rotate(0, -3.4, a);
            return `M${cx} ${cy} L${(cx + x).toFixed(2)} ${(cy + y).toFixed(2)}`;
          })
          .join(" "),
        stroke: DOGWOOD_VEIN,
        width: 0.35,
        opacity: 0.9,
      },
      { d: `${dot(7, 7, 1.3)} ${dot(19, 19, 1.3)}`, fill: DOGWOOD_CENTRE, opacity: 0.95 },
      {
        d: [dot(13, 2, 0.45), dot(2, 12.5, 0.45), dot(22, 12, 0.45), dot(12, 22, 0.45)].join(" "),
        fill: THREAD,
        opacity: 0.8,
      },
    ],
  },
  // Patchwork baby quilt with appliqué hearts and quilting stitches.
  family: {
    label: "Mom · patchwork quilt",
    width: 24,
    height: 24,
    marks: [
      { d: "M0 0 H12 V12 H0 Z M12 12 H24 V24 H12 Z", fill: THREAD, opacity: 0.22 },
      {
        d: [dot(16, 4, 0.8), dot(20, 8, 0.8), dot(16, 8, 0.8), dot(20, 4, 0.8), dot(4, 16, 0.8), dot(8, 20, 0.8), dot(4, 20, 0.8), dot(8, 16, 0.8)].join(" "),
        fill: THREAD,
        opacity: 0.6,
      },
      { d: `${heart(6, 9.2)} ${heart(18, 21.2)}`, fill: DYE_RED, opacity: 0.6 },
      { d: `${heart(6, 9.2)} ${heart(18, 21.2)}`, stroke: THREAD, width: 0.6, opacity: 0.95, dash: "1 0.8" },
      { d: "M0 0.3 H24 M0.3 0 V24 M0 12 H24 M12 0 V24", stroke: THREAD, width: 0.6, opacity: 0.75, dash: "1.4 1.2" },
    ],
  },
};

const PLACE_KEYS: PlaceKey[] = ["lahore", "uae", "calgary", "vancouver"];

function textilePatternId(key: TextileKey, scope = "journey") {
  return `${scope}-pattern-${key}`;
}

function appendTextilePattern(
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  key: TextileKey,
  scale: number,
  scope = "journey"
) {
  const spec = TEXTILE_PATTERNS[key];
  const pattern = defs
    .append("pattern")
    .attr("id", textilePatternId(key, scope))
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", spec.width)
    .attr("height", spec.height)
    .attr("patternTransform", `scale(${scale})`);
  for (const mark of spec.marks) {
    pattern
      .append("path")
      .attr("d", mark.d)
      .attr("fill", mark.fill ?? "none")
      .attr("fill-opacity", mark.fill ? (mark.opacity ?? 1) : null)
      .attr("stroke", mark.stroke ?? null)
      .attr("stroke-opacity", mark.stroke ? (mark.opacity ?? 1) : null)
      .attr("stroke-width", mark.width ?? null)
      .attr("stroke-dasharray", mark.dash ?? null)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");
  }
}

const FELT_FILTER_ID = "journey-felt";

/** Fuzzy fibre grain and slightly irregular edges, like wet-felted wool. */
function appendFeltFilter(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>) {
  const filter = defs
    .append("filter")
    .attr("id", FELT_FILTER_ID)
    .attr("x", "-5%")
    .attr("y", "-5%")
    .attr("width", "110%")
    .attr("height", "110%");
  filter
    .append("feTurbulence")
    .attr("type", "fractalNoise")
    .attr("baseFrequency", 0.06)
    .attr("numOctaves", 2)
    .attr("seed", 3)
    .attr("result", "wobble");
  filter
    .append("feDisplacementMap")
    .attr("in", "SourceGraphic")
    .attr("in2", "wobble")
    .attr("scale", 2.5)
    .attr("xChannelSelector", "R")
    .attr("yChannelSelector", "G")
    .attr("result", "fuzzyEdge");
  filter
    .append("feTurbulence")
    .attr("type", "fractalNoise")
    .attr("baseFrequency", 0.85)
    .attr("numOctaves", 3)
    .attr("seed", 11)
    .attr("result", "fibres");
  filter
    .append("feColorMatrix")
    .attr("in", "fibres")
    .attr("type", "saturate")
    .attr("values", 0)
    .attr("result", "greyFibres");
  const grain = filter
    .append("feComponentTransfer")
    .attr("in", "greyFibres")
    .attr("result", "grain");
  for (const channel of ["feFuncR", "feFuncG", "feFuncB"]) {
    grain.append(channel).attr("type", "linear").attr("slope", 0.45).attr("intercept", 0.68);
  }
  filter
    .append("feBlend")
    .attr("in", "fuzzyEdge")
    .attr("in2", "grain")
    .attr("mode", "multiply")
    .attr("result", "felted");
  filter
    .append("feComposite")
    .attr("in", "felted")
    .attr("in2", "fuzzyEdge")
    .attr("operator", "in");
}

function TextileSwatch({ textile, fill }: { textile: TextileKey; fill: string }) {
  const spec = TEXTILE_PATTERNS[textile];
  const id = textilePatternId(textile, "legend");
  return (
    <svg width="36" height="18" aria-hidden>
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={spec.width}
          height={spec.height}
          patternTransform={`scale(${spec.width > 20 ? 0.75 : 1.1})`}
        >
          {spec.marks.map((mark, i) => (
            <path
              key={i}
              d={mark.d}
              fill={mark.fill ?? "none"}
              fillOpacity={mark.fill ? (mark.opacity ?? 1) : undefined}
              stroke={mark.stroke}
              strokeOpacity={mark.stroke ? (mark.opacity ?? 1) : undefined}
              strokeWidth={mark.width}
              strokeDasharray={mark.dash}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </pattern>
      </defs>
      <rect width="36" height="18" rx="3" fill={fill} />
      <rect width="36" height="18" rx="3" fill={`url(#${id})`} />
    </svg>
  );
}

function PlaceLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border/60 px-4 py-2 text-xs text-muted">
      <span>Fabrics show where I lived:</span>
      {PLACE_KEYS.map((key) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          <TextileSwatch textile={key} fill="#6b7787" />
          {TEXTILE_PATTERNS[key].label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <TextileSwatch textile="family" fill={FAMILY_COLOR} />
        {TEXTILE_PATTERNS.family.label} (2006–2012)
      </span>
    </div>
  );
}

/** The same fabric as an HTML background, for patches drawn outside the SVG. */
function textileBackground(textile: TextileKey | null, color: string, scale: number) {
  if (!textile) return { backgroundColor: color };
  const spec = TEXTILE_PATTERNS[textile];
  const paths = spec.marks
    .map((m) => {
      const attrs = [
        `d="${m.d}"`,
        `fill="${m.fill ?? "none"}"`,
        m.fill ? `fill-opacity="${m.opacity ?? 1}"` : "",
        m.stroke ? `stroke="${m.stroke}" stroke-opacity="${m.opacity ?? 1}"` : "",
        m.width ? `stroke-width="${m.width}"` : "",
        m.dash ? `stroke-dasharray="${m.dash}"` : "",
        `stroke-linecap="round" stroke-linejoin="round"`,
      ];
      return `<path ${attrs.filter(Boolean).join(" ")}/>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" overflow="hidden">${paths}</svg>`;
  return {
    backgroundColor: color,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${spec.width * scale}px ${spec.height * scale}px`,
  };
}

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
      <h4 className="mt-2 font-serif text-sm font-semibold leading-snug text-foreground sm:text-lg">
        {event.title}
      </h4>
      <p className="mt-1 text-xs text-muted sm:text-sm">
        {event.subtitle} · {event.location}
      </p>
      <p className="text-xs text-muted">{yearRangeLabel(event)}</p>
      <p className="mt-2.5 text-xs leading-relaxed text-muted sm:text-sm">{event.description}</p>
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

  const panel =
    event.ongoing && !src ? (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#7eb8d4] bg-gradient-to-b from-[#e8f4fa] to-[#d4e8f2] text-center text-[#3d5a6e]"
      style={{ width: "100%", aspectRatio: `${PREVIEW_IMAGE_WIDTH} / ${PREVIEW_IMAGE_HEIGHT}` }}
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
    <div
      className="relative rounded-lg p-3 sm:p-4"
      style={textileBackground(
        placeKeyFor(event.location),
        categoryColors[event.category],
        JOURNEY_SCALE * 1.4
      )}
    >
      <div
        className="pointer-events-none absolute inset-1.5 rounded-md border-2 border-dashed sm:inset-2"
        style={{ borderColor: THREAD }}
      />
      <img
        src={src}
        alt={event.title}
        className="relative block w-full object-contain"
        style={{ aspectRatio: `${PREVIEW_IMAGE_WIDTH} / ${PREVIEW_IMAGE_HEIGHT}` }}
      />
    </div>
  ) : null;

  return (
    <div
      className={`rounded-xl border bg-surface/95 p-2 shadow-lg backdrop-blur-sm sm:p-3 ${
        active ? "border-accent ring-2 ring-accent/30" : "border-border"
      }`}
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-lg">{panel}</div>
      <div className="mt-3">
        <JourneyCallout event={event} />
      </div>
    </div>
  );
}

type PathPoint = { x: number; y: number; t: number; w: number };

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
  /** Baseline (relative to the centre) of the first caption line under the origin. */
  originCaptionY: number;
  pointAt: (t: number) => {
    x: number;
    y: number;
    w: number;
    angle: number;
    placement: PanelPlacement;
  };
};

const NODE_MARKER_R = s(4);
const PANEL_GAP = s(1);
const JOURNEY_MAX_HEIGHT_RATIO = 0.58 * JOURNEY_SCALE;
const JOURNEY_MAX_WIDTH_PX = s(768);
const JOURNEY_MAX_HEIGHT_PX = s(560);
/** Below this the spiral is laid out at this size and scaled down whole, so cards never pile up. */
const JOURNEY_MIN_LAYOUT_W = 900;

/** Pull inner-spiral chapter panels closer to their nodes. */
const TIGHTER_PANEL_PULL: Partial<Record<LifeEvent["id"], number>> = {
  bsc: s(8),
  "esp-gits": s(7),
  etisalat: s(6),
  msc: s(5),
};

function panelDistance(t: number, bandWidth: number, eventId?: string) {
  const stripClearance = Math.max(0, bandWidth / 2 - s(7));
  const base =
    NODE_MARKER_R + PANEL_GAP + stripClearance + JOURNEY_PANEL_H / 2 + t * s(1);
  const pull = eventId ? (TIGHTER_PANEL_PULL[eventId] ?? 0) : 0;
  return Math.max(NODE_MARKER_R + s(2), base - pull);
}

const ORIGIN_IMAGE_R = s(30);
const ORIGIN_CLIP_ID = "journey-origin-clip";

function drawOriginImage(
  parent: d3.Selection<SVGGElement, unknown, null, undefined>,
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  cx: number,
  cy: number,
  captionY: number
) {
  const size = ORIGIN_IMAGE_R * 2;

  defs
    .append("clipPath")
    .attr("id", ORIGIN_CLIP_ID)
    .append("circle")
    .attr("r", ORIGIN_IMAGE_R);

  const origin = parent
    .append("g")
    .attr("class", "journey-origin")
    .attr("transform", `translate(${cx},${cy})`);

  origin
    .append("circle")
    .attr("r", ORIGIN_IMAGE_R + s(1))
    .attr("fill", PAINTERLY_BG);

  origin
    .append("image")
    .attr("href", journeyOriginImage)
    .attr("x", -ORIGIN_IMAGE_R)
    .attr("y", -ORIGIN_IMAGE_R)
    .attr("width", size)
    .attr("height", size)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("clip-path", `url(#${ORIGIN_CLIP_ID})`);

  origin
    .append("text")
    .attr("x", 0)
    .attr("y", captionY - s(18))
    .attr("text-anchor", "middle")
    .attr("fill", INK)
    .attr("font-size", s(8))
    .attr("font-weight", 800)
    .attr("paint-order", "stroke")
    .attr("stroke", PAINTERLY_BG)
    .attr("stroke-width", s(3))
    .text("1990–1998 · School");

  origin
    .append("text")
    .attr("x", 0)
    .attr("y", captionY - s(9))
    .attr("text-anchor", "middle")
    .attr("fill", "#4a5568")
    .attr("font-family", "Georgia, 'Times New Roman', serif")
    .attr("font-size", s(6.5))
    .attr("font-style", "italic")
    .attr("font-weight", 600)
    .attr("paint-order", "stroke")
    .attr("stroke", PAINTERLY_BG)
    .attr("stroke-width", s(3))
    .text("Convent of Jesus & Mary");

  origin
    .append("text")
    .attr("x", 0)
    .attr("y", captionY)
    .attr("text-anchor", "middle")
    .attr("fill", INK)
    .attr("font-size", s(7))
    .attr("font-weight", 700)
    .attr("paint-order", "stroke")
    .attr("stroke", PAINTERLY_BG)
    .attr("stroke-width", s(3))
    .text("Murree, Pakistan");
}

/** Archimedean spiral mapped to calendar years (1999 → present). */
function buildSpiralLayout(layoutWidth: number, includeLeadIn: boolean): SpiralLayout {
  const cx = layoutWidth / 2;
  const cy = layoutWidth / 2;
  const panelPad = JOURNEY_PANEL_W / 2 + s(14);
  const labelPad = s(20);
  const maxR = layoutWidth / 2 - panelPad;
  const minR = Math.max(s(48), maxR * 0.3);
  const turns = 1.95;
  const totalAngle = turns * Math.PI * 2;
  const startAngle = -Math.PI;
  const shellGrowth = 1.1;

  const bandWidthAt = (r: number) => {
    const u = Math.max(0, Math.min(1, (r - ORIGIN_IMAGE_R) / (maxR - ORIGIN_IMAGE_R)));
    return BAND_MIN_W + (BAND_MAX_W - BAND_MIN_W) * u;
  };

  const pointAt = (t: number) => {
    const angle = startAngle + t * totalAngle;
    const exponential =
      (Math.pow(shellGrowth, t) - 1) / (shellGrowth - 1);
    const shellT = 0.55 * t + 0.45 * exponential;
    const r = minR + shellT * (maxR - minR);
    const w = bandWidthAt(r);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      w,
      angle,
      placement: {
        type: "radial" as const,
        angle,
        distance: panelDistance(t, w),
      } satisfies PanelPlacement,
    };
  };

  const pathSamples = 480;
  const pathPoints: PathPoint[] = Array.from({ length: pathSamples + 1 }, (_, i) => {
    const t = i / pathSamples;
    const { x, y, w } = pointAt(t);
    return { x, y, t, w };
  });

  if (includeLeadIn) {
    // One tight logarithmic turn around the origin image, starting hidden
    // beneath it, so the shell curls inward the way a real whorl does.
    const leadAngle = Math.PI * 2;
    const leadStartR = ORIGIN_IMAGE_R * 0.8;
    const leadSamples = 90;
    const leadPoints: PathPoint[] = [];
    for (let i = 0; i < leadSamples; i++) {
      const u = i / leadSamples;
      const angle = startAngle - leadAngle * (1 - u);
      const r = leadStartR * Math.pow(minR / leadStartR, u);
      leadPoints.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        t: -(1 - u) * (leadAngle / totalAngle),
        w: bandWidthAt(r),
      });
    }
    pathPoints.unshift(...leadPoints);
  }

  let originCaptionY = -(ORIGIN_IMAGE_R + s(6));
  if (includeLeadIn) {
    // The curl passes above the image a quarter of the way round;
    // sit the caption just outside it.
    const curlTopR = ORIGIN_IMAGE_R * 0.8 * Math.pow(minR / (ORIGIN_IMAGE_R * 0.8), 0.25);
    originCaptionY = -(curlTopR + bandWidthAt(curlTopR) / 2 + s(6));
  }

  return { cx, cy, pathPoints, labelPad, originCaptionY, pointAt };
}

function slicePathByT(pathPoints: PathPoint[], t0: number, t1: number): PathPoint[] {
  return pathPoints.filter((p) => p.t >= t0 - 0.0001 && p.t <= t1 + 0.0001);
}

const ribbonEdge = d3
  .line<[number, number]>()
  .curve(d3.curveCatmullRom.alpha(0.5));

/** Closed outline of a variable-width band following the spiral centreline. */
function ribbonPath(points: PathPoint[], extra = 0): string {
  if (points.length < 2) return "";
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  points.forEach((p, i) => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const half = (p.w + extra) / 2;
    const nx = (-dy / len) * half;
    const ny = (dx / len) * half;
    left.push([p.x + nx, p.y + ny]);
    right.push([p.x - nx, p.y - ny]);
  });
  const outer = ribbonEdge(left)!;
  const inner = ribbonEdge(right.reverse())!.replace(/^M/, "L");
  return `${outer}${inner}Z`;
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
    include(p.x, p.y, p.w / 2 + s(4));
  }

  if (showOrigin) {
    include(spiral.cx, spiral.cy, ORIGIN_IMAGE_R + s(24));
  }

  for (const node of nodes) {
    include(node.x, node.y, NODE_MARKER_R + s(6));
    const { cx, cy } = panelCenterFrom(node.x, node.y, node.placement);
    include(cx, cy, JOURNEY_PANEL_W / 2 + 4);
    include(cx, cy, JOURNEY_PANEL_H / 2 + 4);
    const labels = labelsAbovePanel(node);
    const labelHalfW = s(42);
    const labelX =
      labelAnchor(node) === "end"
        ? labels.year.x - labelHalfW
        : labelAnchor(node) === "start"
          ? labels.year.x + labelHalfW
          : labels.year.x;
    include(labelX - labelHalfW, labels.year.y - 8);
    include(labelX + labelHalfW, labels.place.y + 8);
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
    include(cx - s(50), cy + JOURNEY_PANEL_H / 2 + s(20));
    include(cx + s(50), cy + JOURNEY_PANEL_H / 2 + s(20));
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

/** Neighbouring chapters whose panels sit too close for centred labels. */
const LABEL_ANCHOR: Partial<Record<string, "start" | "end">> = {
  "esp-gits": "end",
  emircom: "start",
};

function labelAnchor(node: MilestoneNode): "start" | "middle" | "end" {
  return LABEL_ANCHOR[node.id] ?? "middle";
}

function labelsAbovePanel(node: MilestoneNode, showPlace = true) {
  const { cx, cy } = panelCenterFrom(node.x, node.y, node.placement);
  const panelTop = cy - JOURNEY_PANEL_H / 2;
  const anchor = labelAnchor(node);
  const x =
    anchor === "end"
      ? cx + JOURNEY_PANEL_W / 2
      : anchor === "start"
        ? cx - JOURNEY_PANEL_W / 2
        : cx;
  const lineY = (fromBottom: number) => panelTop - s(4) - fromBottom * s(9);
  const roleRow = showPlace ? 1 : 0;
  return {
    year: { x, y: lineY(roleRow + 1) },
    role: { x, y: lineY(roleRow) },
    place: { x, y: lineY(0) },
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

function placeKeyFor(location: string): PlaceKey | null {
  if (location.toLowerCase().includes("lahore")) return "lahore";
  const key = locationKey(location);
  return (PLACE_KEYS as string[]).includes(key) ? (key as PlaceKey) : null;
}

function placeLabel(location: string): string {
  const key = locationKey(location);
  if (key === "pakistan") return "Pakistan";
  if (key === "uae") return "UAE";
  if (key === "calgary") return "Calgary";
  if (key === "vancouver") return "Vancouver";
  return location.split(",")[0];
}

function placeLabelForNode(node: MilestoneNode): string {
  if (node.id === "esp-gits") return "Pakistan";
  if (node.id === "etisalat") return "UAE";
  return placeLabel(node.location);
}

function shouldShowPlaceLabel(node: MilestoneNode, index: number, nodes: MilestoneNode[]) {
  if (node.id === "esp-gits" || node.id === "etisalat") return true;
  return (
    index === 0 ||
    locationKey(node.location) !== locationKey(nodes[index - 1].location)
  );
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
    const showOrigin = !activeCategory || activeCategory === "education";
    const showGaps = !activeCategory;
    const spiral = buildSpiralLayout(Math.max(width, JOURNEY_MIN_LAYOUT_W), showOrigin);

    const nodes: MilestoneNode[] = sorted.map((event) => {
      const { t0, t1 } = eventSegment(event);
      const tMid = segmentMidpoint(event);
      const pt = spiral.pointAt(tMid);
      return {
        ...event,
        x: pt.x,
        y: pt.y,
        angle: pt.angle,
        placement: {
          ...pt.placement,
          distance: panelDistance(tMid, pt.w, event.id),
        },
        tMid,
        t0,
        t1,
      };
    });

    const bounds = computeJourneyBounds(nodes, spiral, showOrigin, showGaps);
    const vbW = bounds.maxX - bounds.minX;
    const vbH = bounds.maxY - bounds.minY;
    const naturalHeight = width * (vbH / vbW);
    const minHeight = width < JOURNEY_MIN_LAYOUT_W ? 0 : s(280);
    const svgHeight = Math.min(maxHeight, Math.max(minHeight, naturalHeight));

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
      .curve(d3.curveCatmullRom.alpha(0.62))
      .x((d) => d.x)
      .y((d) => d.y);

    const pathData = spiral.pathPoints;

    if (pathData.length > 1) {
      g.append("path")
        .attr("d", ribbonPath(pathData, s(4)))
        .attr("fill", ROAD_EDGE)
        .attr("opacity", 0.45);

      g.append("path")
        .attr("d", ribbonPath(pathData))
        .attr("fill", ROAD_FILL);

      g.append("path")
        .attr("d", spiralLine(pathData))
        .attr("fill", "none")
        .attr("stroke", "#e8d48a")
        .attr("stroke-width", s(2))
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "6,10")
        .attr("opacity", 0.85);
    }

    const defs = svg.append("defs");
    for (const key of Object.keys(TEXTILE_PATTERNS) as TextileKey[]) {
      appendTextilePattern(defs, key, JOURNEY_SCALE);
    }
    appendFeltFilter(defs);

    const stripsG = g.append("g").attr("class", "strips");
    const feltG = stripsG.append("g").attr("filter", `url(#${FELT_FILTER_ID})`);
    const stitchG = stripsG.append("g").style("pointer-events", "none");

    const drawPatternedStrip = (
      points: PathPoint[],
      color: string,
      textile: TextileKey | null
    ) => {
      const d = ribbonPath(points);
      const strip = feltG.append("path").attr("d", d).attr("fill", color);
      if (textile) {
        feltG
          .append("path")
          .attr("class", "journey-strip-pattern")
          .attr("d", d)
          .attr("fill", `url(#${textilePatternId(textile)})`)
          .style("pointer-events", "none");
      }
      stitchG
        .append("path")
        .attr("d", ribbonPath(points, -s(5)))
        .attr("fill", "none")
        .attr("stroke", THREAD)
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", s(0.8))
        .attr("stroke-dasharray", `${s(3)} ${s(2.5)}`)
        .attr("stroke-linecap", "round");
      return strip;
    };

    if (showGaps) {
      for (const gap of journeyGaps) {
        const gapPoints = slicePathByT(
          pathData,
          yearToT(gap.startYear),
          yearToT(gap.endYear)
        );
        if (gapPoints.length > 1) {
          drawPatternedStrip(gapPoints, FAMILY_COLOR, "family").attr(
            "class",
            "journey-family-strip"
          );
        }
      }
    }

    if (showOrigin) {
      // Overlap slightly into the first chapter so the butt caps don't leave a seam.
      const schoolPoints = pathData.filter((p) => p.t <= 0.012);
      if (schoolPoints.length > 1) {
        drawPatternedStrip(schoolPoints, categoryColors.education, "lahore").attr(
          "class",
          "journey-school-strip"
        );
      }
    }

    sorted.forEach((event) => {
      const { t0, t1 } = eventSegment(event);
      const segmentPoints = slicePathByT(pathData, t0, t1);
      if (segmentPoints.length < 2) return;

      drawPatternedStrip(
        segmentPoints,
        categoryColors[event.category],
        placeKeyFor(event.location)
      )
        .datum(event)
        .attr("class", "journey-strip")
        .attr("data-event-id", event.id);
    });

    sorted.forEach((event) => {
      const { t0, t1 } = eventSegment(event);
      const segmentPoints = slicePathByT(pathData, t0, t1);
      if (segmentPoints.length < 2) return;

      stripsG
        .append("path")
        .datum(event)
        .attr("class", "journey-strip-hit")
        .attr("d", ribbonPath(segmentPoints, s(6)))
        .attr("fill", "transparent")
        .style("cursor", "pointer");
    });

    if (showOrigin) {
      drawOriginImage(g, defs, spiral.cx, spiral.cy, spiral.originCaptionY);
    }

    if (showGaps) {
      for (const gap of journeyGaps) {
        const tMid = (yearToT(gap.startYear) + yearToT(gap.endYear)) / 2;
        const pt = spiral.pointAt(tMid);
        g.append("text")
          .attr("x", pt.x)
          .attr("y", pt.y - s(5))
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", INK)
          .attr("font-size", s(8))
          .attr("font-weight", 800)
          .attr("paint-order", "stroke")
          .attr("stroke", PAINTERLY_BG)
          .attr("stroke-width", s(3))
          .text(`${gap.startYear}–${gap.endYear}`);
        g.append("text")
          .attr("x", pt.x)
          .attr("y", pt.y + s(6))
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#4a5568")
          .attr("font-size", s(7))
          .attr("font-weight", 600)
          .attr("font-style", "italic")
          .attr("paint-order", "stroke")
          .attr("stroke", PAINTERLY_BG)
          .attr("stroke-width", s(3))
          .text("Mom");
      }
    }

    const panelsG = g.append("g").attr("class", "panels");
    nodes.forEach((node) => {
      const place = placeKeyFor(node.location);
      drawJourneyPanel(panelsG, defs, node, node.x, node.y, node.placement, {
        color: categoryColors[node.category],
        fabricFill: place ? `url(#${textilePatternId(place)})` : undefined,
        feltFilter: `url(#${FELT_FILTER_ID})`,
        thread: THREAD,
      });
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

    const showsPlace = new Set(
      nodes.filter((d, i) => shouldShowPlaceLabel(d, i, nodes)).map((d) => d.id)
    );
    const labelsFor = (d: MilestoneNode) => labelsAbovePanel(d, showsPlace.has(d.id));

    nodeG
      .selectAll(".year-label")
      .data(nodes)
      .join("text")
      .attr("class", "year-label")
      .attr("x", (d) => labelsFor(d).year.x)
      .attr("y", (d) => labelsFor(d).year.y)
      .attr("text-anchor", (d) => labelAnchor(d))
      .attr("dominant-baseline", "auto")
      .attr("fill", INK)
      .attr("font-size", s(7.5))
      .attr("font-weight", 800)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", s(3))
      .text((d) => yearRangeLabel(d));

    nodeG
      .selectAll(".role-label")
      .data(nodes)
      .join("text")
      .attr("class", "role-label")
      .attr("x", (d) => labelsFor(d).role.x)
      .attr("y", (d) => labelsFor(d).role.y)
      .attr("text-anchor", (d) => labelAnchor(d))
      .attr("dominant-baseline", "auto")
      .attr("fill", "#4a5568")
      .attr("font-size", s(6.5))
      .attr("font-style", "italic")
      .attr("font-weight", 600)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", s(3))
      .text((d) => d.shortTitle);

    const placeNodes = nodes.filter((d) => showsPlace.has(d.id));

    nodeG
      .selectAll(".place-label")
      .data(placeNodes)
      .join("text")
      .attr("class", "place-label")
      .attr("x", (d) => labelsAbovePanel(d).place.x)
      .attr("y", (d) => labelsAbovePanel(d).place.y)
      .attr("text-anchor", (d) => labelAnchor(d))
      .attr("dominant-baseline", "auto")
      .attr("fill", INK)
      .attr("font-size", s(7.5))
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", s(3))
      .text((d) => placeLabelForNode(d));

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
        .attr("font-size", s(8.5))
        .attr("font-weight", 600)
        .text("Ongoing exploration");
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

      <div className="flex flex-row items-start gap-2 sm:gap-4 xl:gap-6">
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
            Colored strips along the spiral mark each chapter — from Murree Convent, Pakistan at the center outward to Vancouver today
          </p>
          <PlaceLegend />
        </div>

        {hovered && (
          <aside className="sticky top-24 w-[36%] max-w-72 shrink-0 sm:w-56 lg:w-64 xl:w-72">
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
