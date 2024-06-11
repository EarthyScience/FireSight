import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'

import { createTexture, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';

import { Vars_1D, Vars_2D, Vars_3D } from '../utils/variables.json'
console.log(Vars_1D)
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
  // useListBlade,
  usePaneFolder,
  usePaneInput,
  // useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

const varValues = genRand(1_000_000); // synthetic data, from 0 to 1.
const volTexture = newVarData(varValues);

// console.log(volTexture)
export function VolumeShader() {
  // const containerElement = document.getElementById('myPane');
  const pane = useTweakpane(
    {
      threshold: 0.0,
      cmap: 'blackbody',
      vName: 'cams_co2fire',
    },
    {
      container: document.getElementById('myPane')
    }
  )
  useEffect(() => {
    const container = document.getElementById('myPane');

    if (container) {
      container.style.position = 'absolute'; // Set position to absolute for dragging
      container.style.cursor = 'move'; // Change cursor to move
      container.style.transition = 'left 0.3s ease, top 0.3s ease'; // Add CSS transitions for smooth movement

      let offsetX = 0;
      let offsetY = 0;

      container.setAttribute('draggable', 'true');

      container.addEventListener('dragstart', function(event) {
        offsetX = event.clientX - container.getBoundingClientRect().left;
        offsetY = event.clientY - container.getBoundingClientRect().top;
        event.dataTransfer.setData('text/plain', ''); // Required for Firefox
      });

      document.body.addEventListener('dragover', function(event) {
        event.preventDefault();
      });

      document.body.addEventListener('drop', function(event) {
        event.preventDefault();
        const dropX = event.clientX - offsetX;
        const dropY = event.clientY - offsetY;
        container.style.left = `${dropX}px`;
        container.style.top = `${dropY}px`;
      });
    }
  }, []);


  const folderGeo = usePaneFolder(pane, {
    title: 'Geometry Settings',
  })

  const [threshold] = usePaneInput(folderGeo, 'threshold', {
    label: 'threshold',
    value: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })
  // List blade
// const cmap_texture = createTexture('blackbody')
const [cmap_texture_name] = usePaneInput(folderGeo, 'cmap', {
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

const cmap_texture =  createTexture(cmap_texture_name)

const folderVars = usePaneFolder(pane, {
  title: 'Variables',
})

const [drei_var] = usePaneInput(folderVars, 'vName', {
  label: '3D',
  options: options3D,
  value: 't2m'
})

const [twod_var] = usePaneInput(folderVars, 'vName', {
  label: '2D',
  options: options2D,
  value: null
})

const [one_var] = usePaneInput(folderVars, 'vName', {
  label: '1D',
  options: options1D,
  value: null
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