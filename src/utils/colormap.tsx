import * as THREE from 'three';
// https://github.com/vasturiano/three-globe/blob/master/src/utils/color-utils.js
import { evaluate_cmap } from 'js-colormaps-es';
import { NestedArray } from 'zarr';

export function minMax(values: number[]): { min: number | undefined, max: number | undefined } {
    // Filter out NaN values
    const validValues = values.filter(value => !isNaN(value));
    // Calculate min and max
    const min = validValues.length > 0 ? validValues.reduce((a,b) => Math.min(a,b)) : undefined;
    const max = validValues.length > 0 ? validValues.reduce((a,b) => Math.max(a,b)) : undefined;
    return { min, max };
}

export function createTexture(palette: string) {
  const unitInterval = Array.from({ length: 255 }, (_, index) => index / 254);
  const rgbv = unitInterval.map(value => evaluate_cmap(value, palette, false));
  const colData = new Uint8Array(rgbv.length * 4);

  for (let i = 0; i < rgbv.length; i++) {
    const [r, g, b] = rgbv[i];  // Destructure the RGB values
    colData[i * 4] = r;
    colData[i * 4 + 1] = g;
    colData[i * 4 + 2] = b;
    colData[i * 4 + 3] = 255;  // Alpha channel
  }
  // console.log(colData);
  const texture = new THREE.DataTexture(colData, rgbv.length, 1, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

export function genRand(count: number) {
  const data = Array.from({ length: count }, () => 
    Array.from({ length: count }, () => 
      Array.from({ length: count }, () => Math.random())
    )
  );  
  const nested = new NestedArray(data,[count,count,count],'<f4')
  return nested
}

// TODO
// isNaN(value) ? d3Color(str).opacity : alpha;
// const color = isNaN(value) ? 'black' : cmap.getColor(value);
// lo=null, hi=null, alpha=0, nan_color='black'