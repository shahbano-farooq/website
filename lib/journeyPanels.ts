import { withBasePath } from "./paths";

const JOURNEY_SCALE = 1.2;

export const JOURNEY_PANEL_W = Math.round(76 * JOURNEY_SCALE);
export const JOURNEY_PANEL_H = Math.round(100 * JOURNEY_SCALE);

export const journeyPanelImages: Record<string, string> = {
  bsc: withBasePath("/journey/bsc.png"),
  "esp-gits": withBasePath("/journey/esp-gits.png"),
  emircom: withBasePath("/journey/emircom.png"),
  etisalat: withBasePath("/journey/etisalat.png"),
  msc: withBasePath("/journey/msc.png"),
  "ucalgary-ta": withBasePath("/journey/ucalgary-ta.png"),
  zayed: withBasePath("/journey/zayed.png"),
  "research-zayed": withBasePath("/journey/research-zayed.png"),
  phd: withBasePath("/journey/phd.png"),
};
