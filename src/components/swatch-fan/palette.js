// A fan deck's colours: hues around the OKLCH wheel, each in shades from
// light to dark, with the hex a designer would copy.

export const HUES = [
  ['Red', 25],
  ['Orange', 55],
  ['Amber', 75],
  ['Yellow', 100],
  ['Lime', 125],
  ['Green', 150],
  ['Teal', 180],
  ['Cyan', 210],
  ['Blue', 255],
  ['Indigo', 275],
  ['Violet', 300],
  ['Pink', 350],
];

// Light to dark, with the colour strongest in the middle shades.
export const SHADES = [
  [100, 0.96, 0.03],
  [300, 0.86, 0.09],
  [500, 0.72, 0.15],
  [600, 0.63, 0.17],
  [700, 0.53, 0.15],
  [900, 0.36, 0.09],
];

const toByte = (linear) => {
  const value = linear <= 0.003_130_8 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(Math.max(value, 0), 1) * 255);
};

/** OKLCH to "#rrggbb", clipped into sRGB. */
export const oklchToHex = (l, c, h) => {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l1 = (l + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
  const m1 = (l - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
  const s1 = (l - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
  const rgb = [
    4.076_741_662_1 * l1 - 3.307_711_591_3 * m1 + 0.230_969_929_2 * s1,
    -1.268_438_004_6 * l1 + 2.609_757_401_1 * m1 - 0.341_319_396_5 * s1,
    -0.004_196_086_3 * l1 - 0.703_418_614_7 * m1 + 1.707_614_701 * s1,
  ];
  return `#${rgb.map((channel) => toByte(channel).toString(16).padStart(2, '0')).join('')}`;
};

/** Every blade: `{ name, hue, shades: [{ step, hex }] }`. */
export const PALETTE = HUES.map(([name, hue]) => ({
  name,
  hue,
  shades: SHADES.map(([step, l, c]) => ({ step, hex: oklchToHex(l, c, hue) })),
}));

/** Black or white, whichever reads on `hex`. */
export const inkOn = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.6 ? '#18181b' : '#ffffff';
};
