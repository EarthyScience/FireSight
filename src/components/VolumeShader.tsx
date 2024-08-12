import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../utils/shaders/vertex.glsl'
import fragmentShader from '../utils/shaders/fragment.glsl'
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { genRand} from '../utils/colormap'
import { newVarData } from '../utils/volTexture';
import { updateMetadataDescription } from '../utils/metadata';
import { updateColorbar, getColors, rgbToHex } from '../utils/updateColorbar';
import { useControlPane } from './PaneControls';

export function VolumeShader() {

  const [meta, setMeta] = useState({})
  const [volumeText, setVolumeText] = useState()
  const [volumeData, setVolumeData] = useState(null)
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(1,1,1))
  const [minmax, setMinMax] =  useState<[number, number]>([0.0, 1.0]);
  const meshRef = useRef()

  const containerId = 'myPanePlugin'
  const {
    threshold,
    cmap_texture_name,
    cmap_texture,
    drei_var,
    tInterval,
    lonmax,
    lonmin,
    latmax,
    latmin,
    tmax,
    tmin
  } = useControlPane(containerId);

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
  }, [minmax, cmap_texture_name]);
  
  // This effect runs whenever meta changes
  useEffect(() => {
    return updateMetadataDescription(meta, 'myDescription');
  }, [meta]);

  useFrame(({ camera }) => {
    meshRef.current.material.uniforms.cameraPos.value.copy(camera.position)
  })

  useEffect(() => {
    if (!volumeData) {
      const randomArray = genRand(50);
      setVolumeData(randomArray);
      return ;
    }
    
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