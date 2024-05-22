import * as THREE from 'three';
import { useRef } from 'react';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'

import { setPalette, valuetoCmap} from '../utils/colormap'

const unitInterval = Array.from({ length: 255 }, (_, index) => index / 254);
const cmap = setPalette({ mn: 0, mx: 1 });
const dataColor = unitInterval.map(value => valuetoCmap({ cmap, value }));

const colData = new Uint8Array(dataColor.length * 4);
for (var i = 0; i < dataColor.length; i++) {
  const {r, g, b} = dataColor[i].color
  colData[i * 4] = r*255;
  colData[i * 4 + 1] = g*255;
  colData[i * 4 + 2] = b*255;
  colData[i * 4 + 3] = 255; // 255
}
const texture = new THREE.DataTexture(colData, dataColor.length, 1, THREE.RGBAFormat);
// console.log(texture)

const volData = new Uint8Array( 10 * 10 * 10 );
for ( let x = 0; x < 1000; x ++ ) {
  volData[ x ] = Math.random()*255;
}

const volTexture = new THREE.Data3DTexture(volData, 10, 10, 10)
volTexture.format = THREE.RedFormat;
volTexture.minFilter = THREE.LinearFilter;
volTexture.magFilter = THREE.LinearFilter;
volTexture.unpackAlignment = 1;
volTexture.needsUpdate = true;

// console.log(volTexture)
console.log(texture)
export function VolumeShader() {

  const meshRef = useRef()

  return (
  <mesh ref={meshRef}>
    <boxGeometry args={[1, 1, 1]} />
    <shaderMaterial
      attach="material"
      args={[{
        glslVersion: THREE.GLSL3,
        uniforms: {
          map: { value: volTexture },
          cameraPos: { value: new THREE.Vector3() },
          // threshold: { value: threshold },
          // steps: { value: steps },
          // scale: {value: scale},
          // flip: {value: flip},
          cmap: {value: texture}
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
      }]}
    />
  </mesh>
  )
}