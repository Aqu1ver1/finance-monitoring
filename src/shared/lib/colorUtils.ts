/**
 * Color utility functions for generating and manipulating colors
 */

export const hslToHex = (h: number, s: number, l: number): string => {
  s = s / 100;
  l = l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  const toHex = (v: number) => Math.round((v + m) * 255)
    .toString(16)
    .padStart(2, '0');
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
};

export const colorDistance = (c1: string, c2: string): number => {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

/**
 * Generates a bright, high-contrast color suitable for both dark and light themes
 */
export const generateBrightColor = (): string => {
  const h = Math.floor(Math.random() * 360);
  const s = 95;  // very saturated
  const l = 55;  // mid-lightness for good contrast
  return hslToHex(h, s, l);
};
