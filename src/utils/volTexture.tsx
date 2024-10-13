import * as THREE from 'three';
import { NestedArray, TypedArray } from 'zarr';

export function newVarData(varValues: NestedArray<TypedArray>): [THREE.Data3DTexture, number[], [number, number]] {
    if (!varValues.shape) {
        throw new Error("varValues does not have a shape property.");
    }

    let [lz, ly, lx] = [1, 1, 1]; // Default to 1 for each dimension

    // Determine the dimensions based on the shape
    if (varValues.shape.length === 3) {
        [lz, ly, lx] = varValues.shape;
    } else if (varValues.shape.length === 2) {
        [ly, lx] = varValues.shape;
        lz = 1; // Set depth to 1 for 2D data
    } else if (varValues.shape.length === 1) {
        [lx] = varValues.shape;
        ly = 1; // Set height to 1 for 1D data
        lz = 1; // Set depth to 1 for 1D data
    } else {
        throw new Error('Unsupported shape: ' + JSON.stringify(varValues.shape));
    }

    const volData = new Uint8Array(lx * ly * lz);
    
    // Convert the flattened array to a regular number array
    const flat = Array.from(varValues.flatten().reverse()); // Convert to number[] 

    // Calculate max and min values
    const maxVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return Math.max(a, b);
    }, -Infinity);

    const minVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return Math.min(a, b);
    }, Infinity);

    for (let i = 0; i < flat.length; i++) {
        const normalizedValue = isNaN(flat[i]) ? 255 : Math.round((flat[i] - minVal) / (maxVal - minVal) * 255);

        if (varValues.shape.length === 1) {
            // For 1D data, duplicate along y and z
            for (let y = 0; y < ly; y++) {
                for (let z = 0; z < lz; z++) {
                    volData[i + y * lx + z * lx * ly] = normalizedValue;
                }
            }
        } else if (varValues.shape.length === 2) {
            // For 2D data, duplicate along z
            for (let z = 0; z < lz; z++) {
                volData[i + z * lx * ly] = normalizedValue;
            }
        } else {
            // For 3D data, no duplication needed
            volData[i] = normalizedValue;
        }
    }

    const volTexture = new THREE.Data3DTexture(volData, lx, ly, lz);
    volTexture.format = THREE.RedFormat;
    volTexture.minFilter = THREE.NearestFilter;
    volTexture.magFilter = THREE.NearestFilter;
    volTexture.unpackAlignment = 1;
    volTexture.needsUpdate = true;

    // Return the texture and the computed values
    return [volTexture, [lz, ly, lx], [minVal, maxVal]];
}

export function new2DTexture(varValues: NestedArray<TypedArray>): [THREE.DataTexture, number[], [number, number]] {
    if (!varValues.shape) {
        throw new Error("varValues does not have a shape property.");
    }

    let [ly, lx] = [1, 1];
    [ly, lx] = varValues.shape;

    const outData = new Uint8Array(lx * ly);
    
    // Convert the flattened array to a regular number array
    const flat = Array.from(varValues.flatten().reverse()); // Convert to number[]

    // Calculate max and min values
    const maxVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return Math.max(a, b);
    }, -Infinity);

    const minVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return Math.min(a, b);
    }, Infinity);

    for (let i = 0; i < flat.length; i++) {
        const normalizedValue = Math.round((flat[i] - minVal) / (maxVal - minVal) * 255);
        outData[i] = normalizedValue;
    }

    const newTexture = new THREE.DataTexture(outData, lx, ly);
    newTexture.format = THREE.RedFormat;
    newTexture.minFilter = THREE.NearestFilter;
    newTexture.magFilter = THREE.NearestFilter;
    newTexture.unpackAlignment = 1;
    newTexture.needsUpdate = true;

    // Return the texture and the computed values
    return [newTexture, [ly, lx], [minVal, maxVal]];
}