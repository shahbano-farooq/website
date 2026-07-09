import { lifeEvents, type LifeCategory, type LifeEvent } from "./data";

export const JOURNEY_TIMELINE_START = 1999;
export const JOURNEY_TIMELINE_END = 2026;

export type JourneyGap = { startYear: number; endYear: number };

/** Years with no professional chapter — path continues but stays uncolored. */
export const journeyGaps: JourneyGap[] = [{ startYear: 2006, endYear: 2012 }];

const MAIN_JOURNEY_IDS = new Set([
  "bsc",
  "esp-gits",
  "emircom",
  "etisalat",
  "msc",
  "zayed",
  "phd",
]);

/** Shown in news/data but not as a separate journey chapter. */
const JOURNEY_HIDDEN_IDS = new Set(["taip"]);

export function eventEndYear(event: LifeEvent): number {
  if (event.ongoing) return JOURNEY_TIMELINE_END;
  return event.endYear;
}

export function yearToT(year: number): number {
  const span = JOURNEY_TIMELINE_END - JOURNEY_TIMELINE_START;
  return Math.max(0, Math.min(1, (year - JOURNEY_TIMELINE_START) / span));
}

export function eventSegment(event: LifeEvent): { t0: number; t1: number } {
  return {
    t0: yearToT(event.startYear),
    t1: yearToT(eventEndYear(event)),
  };
}

export function segmentMidpoint(event: LifeEvent): number {
  const { t0, t1 } = eventSegment(event);
  return (t0 + t1) / 2;
}

export function filterJourneyEvents(category: LifeCategory | null): LifeEvent[] {
  const visible = (events: LifeEvent[]) =>
    events.filter((e) => !JOURNEY_HIDDEN_IDS.has(e.id));

  if (!category) {
    return visible(lifeEvents.filter((e) => MAIN_JOURNEY_IDS.has(e.id)));
  }
  return visible(
    lifeEvents.filter(
      (e) =>
        e.category === category ||
        (e.journeyGroups?.includes(category) ?? false)
    )
  );
}

export function yearRangeLabel(event: LifeEvent): string {
  const end = event.ongoing ? "Present" : String(event.endYear);
  return `${event.startYear}–${end}`;
}
