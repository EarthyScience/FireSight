import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'
// import ZarrLoader from './ZarrLoader';
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { createTexture, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';
// import { useControls } from 'leva';

import {
  // useListBlade,
  usePaneFolder,
  usePaneInput,
  // useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

import { Vars_1D, Vars_2D, Vars_3D } from '../utils/variables.json'
// console.log(Vars_1D)


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


const varValues = genRand(1_000_000); // synthetic data, from 0 to 1.
const volTexture = newVarData(varValues);

export function VolumeShader({data}) {

  const [meta, setMeta] = useState({})
  const [volumeText, setVolumeText] = useState(volTexture)
  const [volumeData, setVolumeData] = useState(null)
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(1,1,1))

  useEffect(() => {
    const cDescription = document.getElementById('myDescription');
    if (cDescription && Object.keys(meta).length > 0) {
      // Create header
      let content = '<strong class="metadata-header">Metadata</strong>';
      // Create a container for the metadata content
      content += '<div class="metadata-content">';
      // Convert the meta object to a formatted string with bold keys
      const metaString = Object.entries(meta)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `<strong>${key}</strong>: [${value.join(', ')}]`;
          }
          return `<strong>${key}</strong>: ${value}`;
        })
        .join('<br>');

      // Add metadata to the container
      content += metaString;
      content += '</div>';

      // Update the content
      cDescription.innerHTML = content;

      // Add event listeners for hover
      const header = cDescription.querySelector('.metadata-header');
      const metadataContent = cDescription.querySelector('.metadata-content');

      const showContent = () => {
        metadataContent.style.display = 'block';
      };

      const hideContent = () => {
        metadataContent.style.display = 'none';
      };

      header.addEventListener('mouseenter', showContent);
      cDescription.addEventListener('mouseleave', hideContent);

      // Cleanup function to remove event listeners
      return () => {
        header.removeEventListener('mouseenter', showContent);
        cDescription.removeEventListener('mouseleave', hideContent);
      };
    }
  }, [meta]); // This effect runs whenever meta changes


  const container = document.getElementById('myPanePlugin');
  const pane = useTweakpane(
    {
      backgroundcolor: "#2d4967",
      threshold: 0.0,
      cmap: 'blackbody',
      vName: 'ndvi',
      description: 'hello world',
      timeSlice: {min: 0, max: 24},
      lonmax: 1.0,
      lonmin:-1,
      latmax: 1.0,
      latmin:-1,
      tmin: -1.0,
      tmax: 1.0
    },
    {
      title: 'Controls',
      container: container,
    }
  )

  const [bgcolor] = usePaneInput(pane, 'backgroundcolor', {
    label: 'Background Color',
    view: 'color',
    value: "#2d4967",
  })
  //  update backgroundcolor
  document.body.style.backgroundColor = bgcolor;

  const folderGeo = usePaneFolder(pane, {
    title: 'Geometry Settings',
  })

  const [threshold] = usePaneInput(folderGeo, 'threshold', {
    label: 'Threshold',
    value: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })
  // List blade
// const cmap_texture = createTexture('blackbody')
  const [cmap_texture_name] = usePaneInput(folderGeo, 'cmap', {
    label: 'Colormap',
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
    value: 'ndvi'
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

  const folderSlices = usePaneFolder(pane, {
    title: 'Slice Dimensions',
  })

  const [tInterval] = usePaneInput(folderSlices, 'timeSlice', {
    label: 'Time window',
    min: 0,
    max: 966,
    step: 1,
  })

  const [lonmax] = usePaneInput(folderSlices, 'lonmax', {
    label: 'Lon max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 180).toFixed(0)}°`,
  })
  const [lonmin] = usePaneInput(folderSlices, 'lonmin', {
    label: 'Lon min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 180).toFixed(0)}°`,
  })

  const [latmax] = usePaneInput(folderSlices, 'latmax', {
    label: 'Lat max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 90).toFixed(0)}°`,
  })
  const [latmin] = usePaneInput(folderSlices, 'latmin', {
    label: 'Lat min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 90).toFixed(0)}°`,
  })

  const [tmax] = usePaneInput(folderSlices, 'tmax', {
    label: 'Time max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${((value + 1)* 12/2).toFixed(0)} day`,
  })
  const [tmin] = usePaneInput(folderSlices, 'tmin', {
    label: 'Time min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${((value + 1) * 12/2).toFixed(0)} day`,
  })


  const meshRef = useRef()


  useFrame(({ camera }) => {
    meshRef.current.material.uniforms.cameraPos.value.copy(camera.position)
  })

  useEffect(()=>{
    if (!volumeData){return;}
    const [newText, newShape] = newVarData(volumeData) 
    setVolumeText(newText)
    setVolumeShape(new THREE.Vector3(2,newShape[1]/newShape[2]*2,2)) //Dims are Z,Y,X
  },[volumeData])

  // console.log(tCut)

  return (
  <group position={[0,1.01,0]}>
  <ZarrLoaderLRU variable={drei_var} setData={setVolumeData} slice={tInterval} setMeta={setMeta}/>
  
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
          cmap: {value: cmap_texture},
          flatBounds: {value: new THREE.Vector4(lonmin, lonmax, tmin, tmax)},
          vertBounds: {value: new THREE.Vector2(latmin, latmax)}
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
      }]}
    />
  </mesh>
  <mesh castShadow>
    <boxGeometry args={[volumeShape.x, volumeShape.y, volumeShape.z]} />
    <meshStandardMaterial transparent color={'red'} visible={false} />
  </mesh>
  </group>
  )
}