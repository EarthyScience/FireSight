import * as THREE from 'three';

export function newVarData(varValues) {
    if (!varValues.shape){return}
    const [lz,ly,lx] = varValues.shape
    const volData = new Uint8Array(lx*ly*lz);
    const flat = varValues.flatten().reverse()
    const maxVal = flat.reduce((a,b)=>{return a> b ? a : b})
    const minVal = flat.reduce((a,b)=>{return a> b ? b : a})
    for ( let i = 0; i < flat.length; i ++ ) {
      volData[ i ] = (flat[i]-minVal)/(maxVal-minVal) *255; // Normalized data from 0 to 1
    }    

    const volTexture = new THREE.Data3DTexture(volData, lx, ly, lz)
    
    volTexture.format = THREE.RedFormat;
    volTexture.minFilter = THREE.NearestFilter;
    volTexture.magFilter = THREE.NearestFilter;
    volTexture.unpackAlignment = 1;
    volTexture.needsUpdate = true;
    return [volTexture,varValues.shape]
  }