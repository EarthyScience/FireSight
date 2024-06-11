import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'

import { createTexture, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';

import { Vars_1D, Vars_2D, Vars_3D } from '../utils/variables.json'
// console.log(Vars_1D)
import { meta } from './Zarr';

const options1D = Vars_1D.map((element) => {
  return {
      text: element,
      value: element
  };
});

const options2D = Vars_2D.map((element) => {
  return {
      text: element,
      value: element
  };
});

const options3D = Vars_3D.map((element) => {
  return {
      text: element,
      value: element
  };
});


import {
  useListBlade,
  usePaneFolder,
  // usePaneInput,
  useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

const varValues = genRand(1_000_000); // synthetic data, from 0 to 1.
const volTexture = newVarData(varValues);

// console.log(volTexture)
export function VolumeShader() {
  const containerElement = document.getElementById('myPane');
  const pane = useTweakpane(
    {
      threshold: 0.0,
    },
    {
      title: 'Geometry Settings',
      container: containerElement,
    }
  )
  const [threshold] = useSliderBlade(pane, {
    label: 'threshold',
    value: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })
  // List blade
// const cmap_texture = createTexture('blackbody')
const [cmap_texture_name] = useListBlade(pane, {
  label: 'colormap',
  options: [
    {
      text: 'blackbody',
      value: 'blackbody'
    },
    {
      text: 'rainbow',
      value: 'rainbow'
    },
    {
      text: 'cooltowarm',
      value: 'cooltowarm'
    },
    {
      text: 'grayscale',
      value: 'grayscale'
    },
  ],
  value: 'blackbody'
})

// const folder = usePaneFolder(pane, {
//   title: 'Variables',
// })
const cmap_texture =  createTexture(cmap_texture_name)

const [drei_var] = useListBlade(pane, {
  label: '3D',
  options: options3D,
  value: 'test1'
})

const [twod_var] = useListBlade(pane, {
  label: '2D',
  options: options2D,
  value: 'test1'
})

const [one_var] = useListBlade(pane, {
  label: '1D',
  options: options1D,
  value: 'test1'
})

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
          threshold: { value: threshold },
          steps: { value: 200 },
          scale: {value: 2},
          flip: {value: false},
          cmap: {value: cmap_texture}
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