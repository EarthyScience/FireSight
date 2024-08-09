import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { createTexture2, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';
import { updateMetadataDescription } from '../utils/metadata';
import { updateColorbar, getColors, rgbToHex } from '../utils/updateColorbar';

import {
  usePaneFolder,
  usePaneInput,
  useTweakpane,
} from '../../pane'

import { All_vars } from '../utils/variables.json'
import { ZarrArray } from 'zarr';

const optionsVars = All_vars.map((element) => {
  return {
      text: element,
      value: element
  };
});

const random3DArray = genRand(1000);
console.log(random3DArray);

export function VolumeShader() {

  const [meta, setMeta] = useState({})
  const [volumeText, setVolumeText] = useState()
  const [volumeData, setVolumeData] = useState(null)
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(1,1,1))
  const [minmax, setMinMax] =  useState<[number, number]>([0.0, 1.0]);
  const meshRef = useRef()

  const container = document.getElementById('myPanePlugin');
  const pane = useTweakpane(
    {
      backgroundcolor: "#2d4967",
      threshold: 0.0,
      cmap: 'viridis',
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
  const colormaps = ['viridis', 'plasma', 'inferno', 'Accent', 'Blues',
    'CMRmap', 'twilight', 'tab10',  'gist_earth', 'cividis']

  const colormaps_array = colormaps.map(colormap => ({
    text: colormap,
    value: colormap
  }));

  const [cmap_texture_name] = usePaneInput(folderGeo, 'cmap', {
    label: 'Colormap',
    options: colormaps_array,
    value: 'viridis'
  })

  const cmap_texture =  createTexture2(cmap_texture_name)

  const folderVars = usePaneFolder(pane, {
    title: 'Variables',
  })

  const [drei_var] = usePaneInput(folderVars, 'vName', {
    label: 'Name',
    options: optionsVars,
    value: 'ndvi'
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

  // do updates!
  useEffect(() => {
    updateColorbar({
      colorbarId: 'colorbar',
      ticksId: 'ticks',
      minmax,
      cmapTextureName: cmap_texture_name,
      getColors,
      rgbToHex
    });
  }, [minmax, cmap_texture_name, getColors, rgbToHex]);
  
  // This effect runs whenever meta changes
  useEffect(() => {
    return updateMetadataDescription(meta, 'myDescription');
  }, [meta]);

  useFrame(({ camera }) => {
    meshRef.current.material.uniforms.cameraPos.value.copy(camera.position)
  })

  useEffect(() => {
    if (!volumeData) {
      const randomArray = genRand(1000);
      console.log(randomArray)
      setVolumeData(x=>randomArray);
      console.warn('No data, using default');
    }
    console.log(volumeData)
    
    const [newText, newShape, minmax] = newVarData(volumeData)
    setMinMax(minmax)
    setVolumeText(newText)

    // console.log('shape length:', volumeData.shape);

    if (volumeData.shape.length === 3) {
      setVolumeShape(new THREE.Vector3(2, newShape[1]/newShape[2]*2, 2)) //Dims are Z,Y,X
    } else if (volumeData.shape.length === 2) {
      setVolumeShape(new THREE.Vector3(2, newShape[1]/newShape[2]*2, 0.05)) //Dims are Z,Y,X
    } else if (volumeData.shape.length === 1) {
      setVolumeShape(new THREE.Vector3(2, newShape[1]/newShape[2]*2, 0.05)) //Dims are Z,Y,X, something is off here
    } else {
      console.error('Unsupported shape length:', volumeData.shape.length);
    }
  }, [volumeData])

  return (
  <>
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
  </>
  )
}