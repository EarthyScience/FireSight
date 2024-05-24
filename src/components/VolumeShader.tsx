import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
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
texture.needsUpdate = true;
// console.log(dataColor.length)


const volData = new Uint8Array( 100 * 100 * 100 );
for ( let x = 0; x < 1000000; x ++ ) {
  volData[ x ] = Math.random()*255;
}

const volTexture = new THREE.Data3DTexture(volData, 100, 100, 100)
volTexture.format = THREE.RedFormat;
volTexture.minFilter = THREE.NearestFilter;
volTexture.magFilter = THREE.NearestFilter;
volTexture.unpackAlignment = 1;
volTexture.needsUpdate = true;

// console.log(volTexture)
export function VolumeShader() {
  const meshRef = useRef()
  useFrame(({ camera }) => {
    meshRef.current.material.uniforms.cameraPos.value.copy(camera.position)
  })
  return (
  <group position={[0,1.01,0]}>
  <mesh ref={meshRef}>
    <boxGeometry args={[2, 2, 2]} />
    <shaderMaterial
      attach="material"
      args={[{
        glslVersion: THREE.GLSL3,
        uniforms: {
          map: { value: volTexture },
          cameraPos: { value: new THREE.Vector3() },
          threshold: { value: 0.0 },
          steps: { value: 200 },
          scale: {value: 2},
          flip: {value: false},
          cmap: {value: texture}
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
      }]}
    />
  </mesh>
  <mesh castShadow>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial transparent color={'red'} visible={false} />
  </mesh>
  </group>
  )
}