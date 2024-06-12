import * as THREE from 'three';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'
import ZarrLoader from './ZarrLoader';
import { createTexture, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';
// import { useControls } from 'leva';


import { Vars_1D, Vars_2D, Vars_3D } from '../utils/variables.json'
// console.log(Vars_1D)
// import { meta } from './Zarr';

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
export function VolumeShader({data}) {

  const [volumeText, setVolumeText] = useState(volTexture)
  const [volumeData, setVolumeData] = useState(null)

  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(1,1,1))

  const container = document.getElementById('myPane');
  const pane = useTweakpane(
    {
      threshold: 0.0,
      cmap: 'blackbody',
      vName: 'vpd',
    },
    {
      title: 'Controls',
      container: container,
    }
  )
  useEffect(() => {
    const container = document.getElementById('myPane');
  
    if (container) {
      container.style.position = 'absolute'; // Set position to absolute for dragging
      container.style.cursor = 'move'; // Change cursor to move
  
      let offsetX = 0;
      let offsetY = 0;
      let isDragging = false;
      // TODO: Only drag from titles
      container.addEventListener('mousedown', function(event) {
        offsetX = event.clientX - container.getBoundingClientRect().left;
        offsetY = event.clientY - container.getBoundingClientRect().top;
        isDragging = true;
      });
  
      document.body.addEventListener('mousemove', function(event) {
        if (isDragging) {
          event.preventDefault();
          const moveX = event.clientX - offsetX;
          const moveY = event.clientY - offsetY;
          container.style.left = `${moveX}px`;
          container.style.top = `${moveY}px`;
        }
      });
  
      document.body.addEventListener('mouseup', function(event) {
        isDragging = false;
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

  useEffect(()=>{
    if (!volumeData){return;}
    const [newText,newShape] = newVarData(volumeData) 
    setVolumeText(newText)
    setVolumeShape(new THREE.Vector3(2,newShape[1]/newShape[2]*2,2)) //Dims are Z,Y,X
  },[volumeData])

  return (
  <group position={[0,1.01,0]}>
  <mesh ref={meshRef} rotation-y={Math.PI}>
    <boxGeometry args={[2, 2, 2]} />
    <shaderMaterial
      attach="material"
      args={[{
        glslVersion: THREE.GLSL3,
        uniforms: {
          map: { value: volumeText },
          cameraPos: { value: new THREE.Vector3() },
          threshold: { value: threshold },
          steps: { value: 200 },
          scale: {value: volumeShape},
          flip: {value: false},
          cmap: {value: cmap_texture}
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
      }]}
    />
  </mesh>
  <Suspense>
  <ZarrLoader variable={drei_var} setData={setVolumeData}/>
  </Suspense>
  <mesh castShadow>
    <boxGeometry args={[volumeShape.x, volumeShape.y, volumeShape.z]} />
    <meshStandardMaterial transparent color={'red'} visible={false} />
  </mesh>
  </group>
  )
}