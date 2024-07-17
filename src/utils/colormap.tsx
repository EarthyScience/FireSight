// import * as THREE from 'three';
import { Lut } from 'three/examples/jsm/math/Lut.js';
import * as THREE from 'three';
// https://github.com/vasturiano/three-globe/blob/master/src/utils/color-utils.js
import { evaluate_cmap } from 'js-colormaps-es';

// console.log(evaluate_cmap(0.5, 'viridis', false))
// console.log(data)


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

  export function createTexture2(palette: string) {
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

//   console.log(createTexture2('viridis'))
  
  export function getColors(palette: string) {
    const unitInterval = Array.from({ length: 32 }, (_, index) => index / 31);
    const cmap = setPalette({ palette, mn: 0, mx: 1 });
    return unitInterval.map(value => cmap.getColor(value));
  }

  export function getColors2(palette: string) {
    const unitInterval = Array.from({ length: 32 }, (_, index) => index / 31);
    return unitInterval.map(value => evaluate_cmap(value, palette, false));
  }
//   console.log(getColors2('viridis'))