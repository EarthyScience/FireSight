import * as THREE from 'three';

export function newVarData(varValues, lx=100, ly=100, lz=100) {
    const varLength= varValues.length
    const volData = new Uint8Array(varLength);
    for ( let i = 0; i < varLength; i ++ ) {
      volData[ i ] = varValues[i] *255; // Normalized data from 0 to 1
    }
    
    const volTexture = new THREE.Data3DTexture(volData, lx, ly, lz)
    
    volTexture.format = THREE.RedFormat;
    volTexture.minFilter = THREE.NearestFilter;
    volTexture.magFilter = THREE.NearestFilter;
    volTexture.unpackAlignment = 1;
    volTexture.needsUpdate = true;
    return volTexture
  }