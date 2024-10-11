import * as THREE from 'three';
// https://github.com/vasturiano/three-globe/blob/master/src/utils/color-utils.js
import { evaluate_cmap } from 'js-colormaps-es';
import { NestedArray } from 'zarr';
import { rgbToHex } from './updateColorbar';

export function minMax(values: number[]): { min: number | undefined, max: number | undefined } {
    // Filter out NaN values
    const validValues = values.filter(value => !isNaN(value));
    // Calculate min and max
    const min = validValues.length > 0 ? validValues.reduce((a,b) => Math.min(a,b)) : undefined;
    const max = validValues.length > 0 ? validValues.reduce((a,b) => Math.max(a,b)) : undefined;
    return { min, max };
}

export function createTexture(palette: string, alpha: number, nan_color: string, nan_alpha: number) {
  const unitInterval = Array.from({ length: 255 }, (_, index) => index / 254);
  const rgbv = unitInterval.map(value => evaluate_cmap(value, palette, false));
  const colData = new Uint8Array((rgbv.length + 1) * 4);

  for (let i = 0; i < rgbv.length; i++) {
    const [r, g, b] = rgbv[i];
    colData[i * 4] = r;
    colData[i * 4 + 1] = g;
    colData[i * 4 + 2] = b;
    colData[i * 4 + 3] = alpha;  // Alpha channel
  }

  // Add the last color as the nan, this should be done better!
  const to_nan = hexToRgb(nan_color)
  const lastIndex = rgbv.length * 4;
  colData[lastIndex] = to_nan[0];
  colData[lastIndex + 1] = to_nan[1];
  colData[lastIndex + 2] = to_nan[2];
  colData[lastIndex + 3] = nan_alpha;

  const texture = new THREE.DataTexture(colData, rgbv.length + 1, 1, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}


export function genRand(count: number) {
  const data = Array.from({ length: count }, () =>
      Array.from({ length: count }, () =>
          Array.from({ length: count }, () => {
              // Randomly insert NaN values (e.g., 10% chance)
              if (Math.random() < 0.6) {
                  return NaN;
              }
              return Math.random();
          })
      )
  );
  const nested = new NestedArray(data, [count, count, count], '<f4');
  return nested;
}

export function hexToRgb(hex: string) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');
  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}
