import * as THREE from 'three';

export function newVarData(varValues, lx=100, ly=100, lz=100) {
    const volData = new Uint8Array(lx*ly*lz);
    const maxVal = varValues.reduce((a,b)=>{return a> b ? a : b})
    const minVal = varValues.reduce((a,b)=>{return a> b ? b : a})
    for ( let i = 0; i < varValues.length; i ++ ) {
      volData[ i ] = (varValues[i]-minVal)/(maxVal-minVal) *255; // Normalized data from 0 to 1
    }    

    const volTexture = new THREE.Data3DTexture(volData, lx, ly, lz)
    
    volTexture.format = THREE.RedFormat;
    volTexture.minFilter = THREE.NearestFilter;
    volTexture.magFilter = THREE.NearestFilter;
    volTexture.unpackAlignment = 1;
    volTexture.needsUpdate = true;
    return volTexture
  }