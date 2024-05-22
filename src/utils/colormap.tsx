// import * as THREE from 'three';
import { Lut } from 'three/examples/jsm/math/Lut.js';
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
    const min = validValues.length > 0 ? Math.min(...validValues) : undefined;
    const max = validValues.length > 0 ? Math.max(...validValues) : undefined;
    return { min, max };
}
export function genRand(count: number): number[] {
    return Array.from({ length: count }, () => Math.random());
}
