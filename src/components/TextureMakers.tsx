//This File will have functions converting the array information into 2D or 3D textures that we will pass to the corresponding 2D or 3D object
import * as THREE from 'three'


function ArrayTo2D(array: object){
    //We assume there is no slicing here. That will occur in the ZarrLoader stage. This is just pure data transfer
    const shape = array.shape;
    const data = array.data;

    const width = shape[0];
    const height = shape[1];

    const textureData = new Uint8Array(width * height * 4);

    const maxVal = data.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return a > b ? a : b;
    });

    const minVal = data.reduce((a, b) => {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return a > b ? b : a;
    });

    const normed = data.map((i)=>(i-minVal)/(maxVal-minVal))

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcIdx = y * width + x;
            const dstIdx = srcIdx * 4;
            // Assuming data is normalized 0-1 or 0-255
            const value = normed[srcIdx];
            textureData[dstIdx] = value;     // Just Need R value cause we will color with shaders
            textureData[dstIdx + 1] = 0; 
            textureData[dstIdx + 2] = 0; 
            textureData[dstIdx + 3] = 255;   // A (fully opaque)
        }
    }

    const texture = new THREE.DataTexture(
        textureData,
        width,
        height,
        THREE.RedFormat,
        THREE.UnsignedByteType
    );

    // Update texture
    texture.needsUpdate = true;
    return texture
}