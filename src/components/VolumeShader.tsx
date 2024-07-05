import * as THREE from 'three';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'
// import ZarrLoader from './ZarrLoader';
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { createTexture, genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';
// import { NestedArray } from "zarr";
import { PlotLine } from './PlotLine';
import {
  // useListBlade,
  usePaneFolder,
  usePaneInput,
  // useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

// import { useControls } from 'leva';
const generateSinePlotData = (xMax, yAspectRatio, numPoints = 100) => {
  const points = [];
  
  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * xMax;
    const y = Math.sin((x / xMax) * 2 * Math.PI) * yAspectRatio;
    points.push([x, y, 0]);
  }
  
  return points;
};

const createTextSprite = (text, color = 'white') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '100px Arial';
  context.fillStyle = color;
  context.fillText(text, 120, 120);
  
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  
  sprite.scale.set(0.15, 0.08, 1);
  
  return sprite;
};

const createAxisGeometries = (xMax, yAspectRatio) => {
  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(xMax, 0, 0)
  ]);

  const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -yAspectRatio, 0),
    new THREE.Vector3(0, yAspectRatio, 0)
  ]);

  return { xAxisGeometry, yAxisGeometry };
};

const createTicksAndLabels = (xMax, yAspectRatio, xTicks = 4, yTicks = 4) => {
  const xTickGeometries = [];
  const yTickGeometries = [];
  const xLabels = [];
  const yLabels = [];
  const tickSize = 0.05;

  for (let i = 0; i <= xTicks; i++) {
    const x = (i / xTicks) * xMax;
    xTickGeometries.push(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -tickSize * yAspectRatio, 0),
      new THREE.Vector3(x, tickSize * yAspectRatio, 0)
    ]));
    
    const label = createTextSprite(x.toFixed(1), 'white');
    label.position.set(x -0.02, -0.11 * yAspectRatio, 0);
    xLabels.push(label);
  }

  for (let i = 0; i <= yTicks; i++) {
    const y = ((i / yTicks) * 2 - 1) * yAspectRatio;
    yTickGeometries.push(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-tickSize * xMax / 6, y, 0),
      new THREE.Vector3(tickSize * xMax / 6, y, 0)
    ]));
    
    const labelValue = (y / yAspectRatio).toFixed(1);
    const label = createTextSprite(labelValue, 'white');
    label.position.set(-0.1, y, 0);
    yLabels.push(label);
  }

  return { xTickGeometries, yTickGeometries, xLabels, yLabels };
};

import { All_vars } from '../utils/variables.json'

const optionsVars = All_vars.map((element) => {
  return {
      text: element,
      value: element
  };
});



const varValues = genRand(1_000_000); // synthetic data, from 0 to 1.
const volTexture = newVarData(varValues);

export function VolumeShader({data, xMax = 2, yAspectRatio = 0.25}) {

  const [meta, setMeta] = useState({})
  const [volumeText, setVolumeText] = useState(volTexture)
  const [volumeData, setVolumeData] = useState(null)
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(1,1,1))
  const meshRef = useRef()
  const plotLineRef = useRef();

  const sinePlotData = useMemo(() => generateSinePlotData(xMax, yAspectRatio), [xMax, yAspectRatio]);
  const { xAxisGeometry, yAxisGeometry } = useMemo(() => createAxisGeometries(xMax, yAspectRatio), [xMax, yAspectRatio]);
  const { xTickGeometries, yTickGeometries, xLabels, yLabels } = useMemo(() => 
    createTicksAndLabels(xMax, yAspectRatio), [xMax, yAspectRatio]);

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


  useFrame(({ camera }) => {
    meshRef.current.material.uniforms.cameraPos.value.copy(camera.position)
  })

  useEffect(()=>{
    if (!volumeData){return;}
    // console.log(volumeData)
    const [newText, newShape] = newVarData(volumeData)
    setVolumeText(newText)

    if (volumeData.shape.length === 3) {
      setVolumeShape(new THREE.Vector3(2,newShape[1]/newShape[2]*2, 2)) //Dims are Z,Y,X
    } else if (volumeData.shape.length === 2) {
      setVolumeShape(new THREE.Vector3(2,newShape[1]/newShape[2]*2, 0.05)) //Dims are Z,Y,X
    } else if (volumeData.shape.length === 1) {
      setVolumeShape(new THREE.Vector3(2,newShape[1]/newShape[2]*2, 0.05)) //Dims are Z,Y,X, something is off here
    } else {
      console.error('Unsupported shape length:', volumeData.shape.length);
    }

  },[volumeData])

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
  {/* <group position={[-1, 0.25, 1.01]}> 
  <PlotLine ref={plotLineRef} data={sinePlotData} color="yellow" lineWidth={2} />
      
      <line>
        <bufferGeometry attach="geometry" {...xAxisGeometry} />
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...yAxisGeometry} />
        <lineBasicMaterial attach="material" color="green" />
      </line>
      
      {xTickGeometries.map((geometry, index) => (
        <line key={`xTick${index}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color="red" />
        </line>
      ))}
      {yTickGeometries.map((geometry, index) => (
        <line key={`yTick${index}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color="green" />
        </line>
      ))}
      
      {xLabels.map((label, index) => (
        <primitive key={`xLabel${index}`} object={label} />
      ))}
      {yLabels.map((label, index) => (
        <primitive key={`yLabel${index}`} object={label} />
      ))}
  </group> */}
  </>
  )
}