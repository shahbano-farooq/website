"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as d3 from "d3";
import { teachingRecords, teachingTopicColors, type TeachingRecord, type TeachingTopic } from "@/lib/data";
import { getStudentsForCourse } from "@/lib/teachingStudents";
import { withBasePath } from "@/lib/paths";

const TOPICS: TeachingTopic[] = [
  "Programming",
  "Algorithms",
  "Machine Learning",
  "IT & Data",
];

const PAINTERLY_BG = "#f7f4ef";
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SEMESTER_ORDER: Record<TeachingRecord["semester"], number> = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

type TopicHub = {
  id: string;
  isTopic: true;
  topic: TeachingTopic;
  label: string;
};

type CourseGraphNode = TeachingRecord &
  d3.SimulationNodeDatum & {
    isTopic?: false;
    r: number;
    students: number;
    spiralX: number;
    spiralY: number;
    lineageIndex: number;
  };

type GraphNode = (CourseGraphNode | (TopicHub & d3.SimulationNodeDatum)) &
  d3.SimulationNodeDatum;

type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  kind: "term" | "topic" | "course-lineage";
};

function isTopicNode(d: GraphNode): d is TopicHub & d3.SimulationNodeDatum {
  return "isTopic" in d && d.isTopic === true;
}

export default function TeachingDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const streamRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [selected, setSelected] = useState<TeachingRecord | null>(null);
  const [width, setWidth] = useState(900);

  useEffect(() => {
    return () => {
      simulationRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(containerRef.current);
    setWidth(containerRef.current.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !streamRef.current) return;
    renderForceGraph(svgRef.current, width, setSelected, tooltipRef, containerRef);
    renderTeachingStream(streamRef.current, width);
  }, [width]);

  return (
    <div ref={containerRef} className="space-y-8">
      <div
        className="overflow-hidden rounded-xl border border-border"
        style={{ background: PAINTERLY_BG }}
      >
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Teaching Network
          </h3>
          <p className="mt-1 text-sm text-muted">
            Recurring courses arranged by phyllotaxis — oldest at the center of each
            topic, spiraling outward through later offerings.
          </p>
        </div>
        <svg ref={svgRef} className="mx-auto block w-full" role="img" aria-label="Force-directed teaching network" />
        <div ref={tooltipRef} className="life-timeline-tooltip" style={{ opacity: 0, position: "absolute" }} />
      </div>

      <div
        className="overflow-hidden rounded-xl border border-border"
        style={{ background: PAINTERLY_BG }}
      >
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Teaching River
          </h3>
          <p className="mt-1 text-sm text-muted">
            Stream thickness reflects total students taught per theme each year.
          </p>
        </div>
        <svg ref={streamRef} className="mx-auto block w-full" role="img" aria-label="Teaching stream over time" />
      </div>

      {selected && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: teachingTopicColors[selected.topic] }}
          >
            {selected.topic}
          </span>
          <h4 className="mt-2 font-medium text-foreground">
            {selected.code}: {selected.title}
          </h4>
          <p className="text-sm text-muted">
            {selected.term} · {selected.role} · {selected.institution}
            {getStudentsForCourse(selected.code, selected.term) > 0 && (
              <> · {getStudentsForCourse(selected.code, selected.term)} students</>
            )}
          </p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Power BI Teaching Dashboard
        </h3>
        <p className="mt-2 text-sm text-muted">
          Original dashboard: <em>Journey of an Instructor</em> — student enrollment,
          course evaluations, and teaching activities across your career at Zayed University.
        </p>
        <a
          href={withBasePath("/teaching/Journey-of-an-Instructor.pbix")}
          download
          className="mt-3 inline-flex text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          Download Power BI dashboard (.pbix)
        </a>
      </section>
    </div>
  );

  function renderForceGraph(
    svgEl: SVGSVGElement,
    w: number,
    onSelect: (course: TeachingRecord) => void,
    tooltipRef: RefObject<HTMLDivElement | null>,
    containerRef: RefObject<HTMLDivElement | null>
  ) {
    simulationRef.current?.stop();

    const height = Math.min(560, w * 0.9);
    const cx = w / 2;
    const cy = height / 2;

    const topicHubs: (TopicHub & d3.SimulationNodeDatum)[] = TOPICS.map((topic, i) => {
      const angle = (i / TOPICS.length) * Math.PI * 2 - Math.PI / 2;
      const r = Math.min(w, height) * 0.32;
      return {
        id: `topic-${topic}`,
        isTopic: true as const,
        topic,
        label: topic,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        fx: cx + Math.cos(angle) * r,
        fy: cy + Math.sin(angle) * r,
      };
    });

    const courseNodes: CourseGraphNode[] = teachingRecords.map((course) => {
      const students = getStudentsForCourse(course.code, course.term);
      return {
        ...course,
        students,
        spiralX: cx,
        spiralY: cy,
        lineageIndex: 0,
        r: course.role === "Instructor" ? 6 : 4,
      };
    });

    d3.group(courseNodes, (d) => d.code).forEach((group) => {
      const sorted = group.slice().sort((a, b) => {
        const yearDiff = a.year - b.year;
        if (yearDiff !== 0) return yearDiff;
        return SEMESTER_ORDER[a.semester] - SEMESTER_ORDER[b.semester];
      });

      const hub = topicHubs.find((h) => h.topic === sorted[0].topic);
      const anchorX = hub?.x ?? cx;
      const anchorY = hub?.y ?? cy;
      const phyllotaxisScale = 7.5;

      sorted.forEach((course, i) => {
        const radius = phyllotaxisScale * Math.sqrt(i);
        const angle = i * GOLDEN_ANGLE;
        course.spiralX = anchorX + Math.cos(angle) * radius;
        course.spiralY = anchorY + Math.sin(angle) * radius;
        course.lineageIndex = i;
        const sizeFromStudents =
          course.students > 0 ? Math.sqrt(course.students) * 0.35 : 0;
        course.r = 5 + i * 1.5 + sizeFromStudents;
      });
    });

    const nodes: GraphNode[] = [...topicHubs, ...courseNodes];
    const nodeById = new Map(nodes.map((n) => [isTopicNode(n) ? n.id : n.id, n]));

    const links: GraphLink[] = [];
    const linkKey = new Set<string>();

    const addLink = (source: string, target: string, kind: GraphLink["kind"]) => {
      const key = [source, target].sort().join("|");
      if (linkKey.has(key)) return;
      linkKey.add(key);
      links.push({
        source: nodeById.get(source)!,
        target: nodeById.get(target)!,
        kind,
      });
    };

    courseNodes.forEach((course) => {
      addLink(course.id, `topic-${course.topic}`, "topic");
    });

    d3.group(courseNodes, (d) => d.term).forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          addLink(group[i].id, group[j].id, "term");
        }
      }
    });

    d3.group(courseNodes, (d) => d.code).forEach((group) => {
      const sorted = group.slice().sort((a, b) => {
        const yearDiff = a.year - b.year;
        if (yearDiff !== 0) return yearDiff;
        return SEMESTER_ORDER[a.semester] - SEMESTER_ORDER[b.semester];
      });
      for (let i = 1; i < sorted.length; i++) {
        addLink(sorted[i - 1].id, sorted[i].id, "course-lineage");
      }
    });

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("width", w).attr("height", height);

    const g = svg.append("g");

    d3.group(courseNodes, (d) => d.code).forEach((group) => {
      const sorted = group
        .slice()
        .sort((a, b) => {
          const yearDiff = a.year - b.year;
          if (yearDiff !== 0) return yearDiff;
          return SEMESTER_ORDER[a.semester] - SEMESTER_ORDER[b.semester];
        });
      if (sorted.length < 2) return;

      const spiralLine = d3
        .line<CourseGraphNode>()
        .x((d) => d.spiralX)
        .y((d) => d.spiralY)
        .curve(d3.curveCatmullRom.alpha(0.6));

      g.append("path")
        .attr("d", spiralLine(sorted))
        .attr("fill", "none")
        .attr("stroke", teachingTopicColors[sorted[0].topic])
        .attr("stroke-width", 1.2)
        .attr("opacity", 0.35)
        .attr("stroke-dasharray", "3,5");
    });

    const linkColor: Record<GraphLink["kind"], string> = {
      term: "#7a9cb5",
      topic: "#d4cdc4",
      "course-lineage": "#c9bfb0",
    };

    const linkWidth: Record<GraphLink["kind"], number> = {
      term: 1.8,
      topic: 1,
      "course-lineage": 1.2,
    };

    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => linkColor[d.kind])
      .attr("stroke-width", (d) => linkWidth[d.kind])
      .attr("stroke-opacity", (d) => (d.kind === "term" ? 0.55 : 0.35))
      .attr("stroke-dasharray", (d) => (d.kind === "course-lineage" ? "4,4" : null));

    const hub = g
      .append("g")
      .attr("class", "hubs")
      .selectAll("g")
      .data(topicHubs)
      .join("g");

    hub
      .append("circle")
      .attr("r", 26)
      .attr("fill", (d) => teachingTopicColors[d.topic])
      .attr("opacity", 0.14)
      .attr("stroke", (d) => teachingTopicColors[d.topic])
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.55);

    hub.each(function (d) {
      const words = d.label.split(" ");
      const text = d3
        .select(this)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", teachingTopicColors[d.topic])
        .attr("font-size", words.length > 1 ? 8.5 : 10)
        .attr("font-weight", 700);

      if (words.length === 1) {
        text.attr("dy", 4).text(d.label);
      } else {
        words.forEach((word, i) => {
          text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? -2 : 11)
            .text(word);
        });
      }
    });

    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(courseNodes)
      .join("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => teachingTopicColors[d.topic])
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.9)
      .style("cursor", "grab")
      .on("click", (_, d) => onSelect(d))
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("r", d.r + 2);
        showTooltip(event, d);
      })
      .on("mousemove", (event, d) => showTooltip(event, d))
      .on("mouseleave", function (_, d) {
        d3.select(this).attr("r", d.r);
        hideTooltip();
      });

    // Label first offering of each ML course so titles like Neural Networks stay readable
    const courseLabels = g
      .append("g")
      .attr("class", "course-labels")
      .selectAll("text")
      .data(
        courseNodes.filter(
          (d) => d.topic === "Machine Learning" && d.lineageIndex === 0
        )
      )
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.r + 12)
      .attr("fill", teachingTopicColors["Machine Learning"])
      .attr("font-size", 9)
      .attr("font-weight", 700)
      .attr("paint-order", "stroke")
      .attr("stroke", PAINTERLY_BG)
      .attr("stroke-width", 3)
      .style("pointer-events", "none")
      .text((d) => d.title);

    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => (isTopicNode(d) ? d.id : d.id))
          .distance((l) => {
            if (l.kind === "topic") return 72;
            if (l.kind === "term") return 42;
            return 56;
          })
          .strength((l) => {
            if (l.kind === "topic") return 0.45;
            if (l.kind === "term") return 0.35;
            return 0.2;
          })
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(cx, cy))
      .force(
        "collide",
        d3.forceCollide<GraphNode>().radius((d) =>
          isTopicNode(d) ? 28 : (d as CourseGraphNode).r + 6
        )
      )
      .force("spiral", () => {
        for (const d of courseNodes) {
          const dx = d.spiralX - (d.x ?? 0);
          const dy = d.spiralY - (d.y ?? 0);
          d.vx = (d.vx ?? 0) + dx * 0.22;
          d.vy = (d.vy ?? 0) + dy * 0.22;
        }
      });

    const dragBehavior = d3
      .drag<SVGCircleElement, CourseGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior as never);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      hub.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      courseLabels
        .attr("x", (d) => d.x ?? 0)
        .attr("y", (d) => d.y ?? 0);
    });

    simulationRef.current = simulation;

    function showTooltip(event: MouseEvent, d: CourseGraphNode) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      if (!tooltip || !container) return;
      tooltip.style.opacity = "1";
      tooltip.innerHTML = `
        <h4>${d.code}</h4>
        <p style="font-size:12px;margin-bottom:4px">${d.title}</p>
        <p>${d.term} · ${d.role}${d.students > 0 ? ` · ${d.students} students` : ""}</p>
        ${d.lineageIndex > 0 ? `<p style="font-size:11px;margin-top:4px">Offering #${d.lineageIndex + 1} of this course</p>` : `<p style="font-size:11px;margin-top:4px">First offering</p>`}
      `;
      const rect = container.getBoundingClientRect();
      tooltip.style.left = `${Math.min(event.clientX - rect.left + 12, rect.width - 260)}px`;
      tooltip.style.top = `${Math.max(event.clientY - rect.top - 12, 8)}px`;
    }

    function hideTooltip() {
      if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    }
  }

  function renderTeachingStream(svgEl: SVGSVGElement, w: number) {
    const height = 220;
    const margin = { top: 32, right: 24, bottom: 36, left: 24 };
    const innerW = w - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const years = d3.range(2012, 2027);
    const stackKeys = TOPICS;

    const yearTopicCounts = years.map((year) => {
      const row: Record<string, number | string> = { year };
      stackKeys.forEach((topic) => {
        const offerings = teachingRecords.filter(
          (r) => r.year === year && r.topic === topic
        );
        // Use enrollment when known; otherwise count each offering so thin topics stay visible
        const students = offerings.reduce((sum, r) => {
          const enrolled = getStudentsForCourse(r.code, r.term);
          return sum + (enrolled > 0 ? enrolled : 24);
        }, 0);
        row[topic] = students;
      });
      return row;
    });

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("width", w).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([2012, 2026])
      .range([0, innerW]);

    const stack = d3
      .stack<Record<string, number | string>>()
      .keys(stackKeys)
      .offset(d3.stackOffsetSilhouette);
    const series = stack(yearTopicCounts);

    const extent = d3.extent(
      series.flatMap((s) => s.flatMap((d) => [d[0], d[1]]))
    ) as [number, number];
    const maxAbs = Math.max(Math.abs(extent[0]), Math.abs(extent[1]), 1);

    const y = d3
      .scaleLinear()
      .domain([-maxAbs, maxAbs])
      .range([innerH, 0]);

    const area = d3
      .area<d3.SeriesPoint<Record<string, number | string>>>()
      .x((d) => x(Number(d.data.year)))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.6));

    g.selectAll(".stream-layer")
      .data(series)
      .join("path")
      .attr("class", "stream-layer")
      .attr("d", area)
      .attr("fill", (d) => teachingTopicColors[d.key as TeachingTopic])
      .attr("opacity", (d) =>
        d.key === "Machine Learning" ? 0.95 : 0.72
      )
      .attr("stroke", (d) => teachingTopicColors[d.key as TeachingTopic])
      .attr("stroke-width", (d) =>
        d.key === "Machine Learning" ? 1.5 : 0.5
      )
      .attr("stroke-opacity", (d) =>
        d.key === "Machine Learning" ? 0.85 : 0.4
      );

    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#8a7f72")
      .attr("stroke-width", 1)
      .attr("opacity", 0.6);

    g.append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(years.filter((yr) => yr % 2 === 0))
          .tickFormat(d3.format("d"))
          .tickSize(0)
      )
      .call((sel) => sel.select(".domain").remove())
      .selectAll("text")
      .attr("fill", "#8a7f72")
      .attr("font-size", 10);

    const legend = svg.append("g").attr("transform", `translate(${margin.left}, 8)`);
    stackKeys.forEach((topic, i) => {
      const lg = legend.append("g").attr("transform", `translate(${i * 108},0)`);
      lg.append("circle").attr("r", 4).attr("fill", teachingTopicColors[topic]);
      lg
        .append("text")
        .attr("x", 10)
        .attr("y", 4)
        .attr("fill", "#5c6574")
        .attr("font-size", 9)
        .text(topic);
    });
  }
}
