import * as THREE from 'three';

export function newVarData(varValues) {
    if (!varValues.shape) {
        console.log("here !")
        console.log(varValues.shape)
        return;
    }
   
    let [lz, ly, lx] = [1, 1, 1]; // Default to 1 for each dimension
    
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
        console.error('Unsupported shape:', varValues.shape);
        return;
    }

    const volData = new Uint8Array(lx * ly * lz);
    const flat = varValues.flatten().reverse();
    const maxVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return a > b ? a : b;
    });
    const minVal = flat.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return a > b ? b : a;
    });

    for (let i = 0; i < flat.length; i++) {
        const normalizedValue = (flat[i] - minVal) / (maxVal - minVal) * 255;
        
        if (varValues.shape.length === 1) {
            // For 1D data, duplicate along y and z!
            for (let y = 0; y < ly; y++) {
                for (let z = 0; z < lz; z++) {
                    volData[i + y * lx + z * lx * ly] = normalizedValue;
                }
            }
        } else if (varValues.shape.length === 2) {
            // For 2D data, duplicate along z, also here!
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

    return [volTexture, [lz, ly, lx], [minVal, maxVal]]; // Return the new shape
}