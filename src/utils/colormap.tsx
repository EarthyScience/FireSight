// import * as THREE from 'three';
import { Lut } from 'three/examples/jsm/math/Lut.js';
import * as THREE from 'three';
// https://github.com/vasturiano/three-globe/blob/master/src/utils/color-utils.js
type PaletteOptions = {
    palette?: string;
    mn: number;
    mx: number;
    n?: number;
};
export function setPalette({palette='blackbody', mn, mx, n=512}: PaletteOptions){
    const lut = new Lut(palette, n);
    Object.assign(lut, { minV: mn, maxV: mx });
    return lut;
}
export function valuetoCmap({cmap, value}){
    // TODO
    // isNaN(value) ? d3Color(str).opacity : alpha;
    // const color = isNaN(value) ? 'black' : cmap.getColor(value);
    // lo=null, hi=null, alpha=0, nan_color='black'
    return ({
        color: cmap.getColor(value)
    })
}

export function minMax(values: number[]): { min: number | undefined, max: number | undefined } {
    // Filter out NaN values
    const validValues = values.filter(value => !isNaN(value));
    // Calculate min and max
    const min = validValues.length > 0 ? validValues.reduce((a,b) => Math.min(a,b)) : undefined;
    const max = validValues.length > 0 ? validValues.reduce((a,b) => Math.max(a,b)) : undefined;
    return { min, max };
}
export function genRand(count: number): number[] {
    return Array.from({ length: count }, () => Math.random());
}

export function createTexture(palette: string) {
    const unitInterval = Array.from({ length: 255 }, (_, index) => index / 254);
    const cmap = setPalette({ palette, mn: 0, mx: 1 });
    const dataColor = unitInterval.map(value => valuetoCmap({ cmap, value }));
  
    const colData = new Uint8Array(dataColor.length * 4);
    for (let i = 0; i < dataColor.length; i++) {
      const { r, g, b } = dataColor[i].color;
      colData[i * 4] = r * 255;
      colData[i * 4 + 1] = g * 255;
      colData[i * 4 + 2] = b * 255;
      colData[i * 4 + 3] = 255; // 255
    }
  
    const texture = new THREE.DataTexture(colData, dataColor.length, 1, THREE.RGBAFormat);
    texture.needsUpdate = true;
  
    return texture;
  }
  