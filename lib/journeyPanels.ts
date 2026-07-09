import { withBasePath } from "./paths";

export const JOURNEY_SCALE = 1.5;
const PANEL_SCALE = 0.78;

export const JOURNEY_PANEL_W = Math.round(76 * PANEL_SCALE);
export const JOURNEY_PANEL_H = Math.round(100 * PANEL_SCALE);

export const journeyOriginImage = withBasePath("/journey/murree-convent.png");

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
