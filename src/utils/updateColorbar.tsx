import { evaluate_cmap } from 'js-colormaps-es';

export function updateColorbar(params) {
  const {
    colorbarId,
    ticksId,
    minmax,
    cmapTextureName,
    numTicks = 5,
    getColors,
    rgbToHex
  } = params;

  const colorbarElement = document.getElementById(colorbarId);
  const ticksElement = document.getElementById(ticksId);
  const maxValue = minmax[1];
  const minValue = minmax[0];
  const cbColors = getColors(cmapTextureName);

  // Create gradient
  const gradientColors = cbColors.map((color, index) => {
    const hexColor = rgbToHex(color);
    const position = (index / (cbColors.length - 1)) * 100;
    return `${hexColor} ${position}%`;
  });
  const gradient = `linear-gradient(to right, ${gradientColors.join(', ')})`;
  colorbarElement.style.background = gradient;

  // Clear existing ticks
  ticksElement.innerHTML = '';

  // Create ticks
  const range = maxValue - minValue;
  const tickStep = range / (numTicks - 1);
  for (let i = 0; i < numTicks; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    tick.style.left = `${(i / (numTicks - 1)) * 100}%`;
    ticksElement.appendChild(tick);

    const label = document.createElement('div');
    label.className = 'tick-label';
    label.style.left = `${(i / (numTicks - 1)) * 100}%`;
    label.style.top = '1px';
    label.textContent = (minValue + i * tickStep).toFixed(1);
    ticksElement.appendChild(label);
  }
}

export function getColors(palette: string) {
  const unitInterval = Array.from({ length: 32 }, (_, index) => index / 31);
  return unitInterval.map(value => evaluate_cmap(value, palette, false));
}
//   console.log(getColors2('viridis'))

export function rgbToHex(color: [number, number, number]): string {
const toHex = (c: number): string => {
  const hex = Math.round(c).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};
const [r, g, b] = color;
return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}