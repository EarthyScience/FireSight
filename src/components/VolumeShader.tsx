import * as THREE from 'three';
THREE.Cache.enabled = true;
import { useEffect, useRef, useState } from 'react';
import { Mesh, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../utils/shaders/vertex.glsl';
import fragmentShader from '../utils/shaders/fragment.glsl';
import flatFragment from '../utils/shaders/fragmentFlat.glsl'
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { genRand } from '../utils/colormap';
import { newVarData,new2DTexture } from '../utils/volTexture';
import { updateMetadataDescription } from '../utils/metadata';
import { updateColorbar, getColors, rgbToHex } from '../utils/updateColorbar';
import { useControlPane } from './PaneControls';
// import TimeSeries from './TimeSeries.jsx'
import { Analyzer } from './AnalysisFunctions.js'
// import {Zarr1D} from './ZarrLoaderLRU'
import { FrameBoxed } from './FrameBoxed';

type CustomMesh = Mesh & {
  material: ShaderMaterial;
};

export function VolumeShader() {
  const [meta, setMeta] = useState({});
  const [volumeData, setVolumeData] = useState(() => genRand(30));
  const [volumeText, setVolumeText] = useState<THREE.Data3DTexture | null>(null);
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(2, 2, 2));

  const [isFlatTexture, setIsFlatTexture] = useState(false);
  const [flatText, setFlatText] = useState<THREE.DataTexture | null>(null);
  const [flatShape, setFlatShape] = useState([1,1])

  const [minmax, setMinMax] = useState<[number, number]>([0.0, 1.0]);

  const meshRef = useRef<CustomMesh>(null);
  
  const containerId = 'myPanePlugin';
  const {
    threshold,
    thresholdMode,
    cmap_texture_name,
    cmap_texture,
    drei_var,
    timeSlice,
    lonmax,
    lonmin,
    latmax,
    latmin,
    tmax,
    tmin,
    analysisMethod,
    analysis1,
    analysis2,
    do_compute,
    color_axes,
    alpha_intensity,
  } = useControlPane(containerId);

  useEffect(() => {
    updateColorbar({
      colorbarId: 'colorbar',
      ticksId: 'ticks',
      minmax,
      cmapTextureName: cmap_texture_name,
      getColors,
      rgbToHex,
    });
  }, [minmax, cmap_texture_name]);

  useEffect(() => {
    return updateMetadataDescription(meta, 'myDescription', 'name-label', 'units-label');
  }, [meta]);

  //Create volumeTexture if 3D data
  useEffect(() => {
    if (!volumeData) {
      const randomArray = genRand(30);
      setVolumeData(randomArray);
      return;
    }
    if (volumeData.shape.length !== 3){
      setIsFlatTexture(true)
      return
    }
    setIsFlatTexture(false)

    const [newText, newShape, newMinmax] = newVarData(volumeData);
    setMinMax(newMinmax);
    setVolumeText(newText);

    if (volumeData.shape.length === 3) {
      setVolumeShape(new THREE.Vector3(2, newShape[1] / newShape[2] * 2, 2)); //Dims are Z,Y,X
    } else if (volumeData.shape.length === 2) {
      setVolumeShape(new THREE.Vector3(2, newShape[1] / newShape[2] * 2, 0.05)); //Dims are Z,Y,X
    } else if (volumeData.shape.length === 1) {
      setVolumeShape(new THREE.Vector3(2, newShape[1] / newShape[2] * 2, 0.05)); //Dims are Z,Y,X, something is off here
    } else {
      console.error('Unsupported shape length:', volumeData.shape.length);
    }
  }, [volumeData]);

  //Create 2D texture if 2D data
  useEffect(()=>{
    if (!isFlatTexture){return}
    const [newText, newShape, newMinmax] = new2DTexture(volumeData);
    setFlatShape(newShape)
    setMinMax(newMinmax);
    setFlatText(newText)
  },[isFlatTexture,volumeData])

  useFrame(({ camera }) => {
    if (meshRef.current) {
      const material = meshRef.current.material;
      // Update volume texture
      if (volumeText) {
        material.uniforms.map.value = volumeText;
        meshRef.current.visible = true;
      } else {
        meshRef.current.visible = false;
      }
      // Update dynamic uniforms
      material.uniforms.threshold.value = threshold;
      material.uniforms.flip.value = thresholdMode;
      material.uniforms.cmap.value = cmap_texture;
      material.uniforms.flatBounds.value.set(lonmin, lonmax, tmin, tmax);
      material.uniforms.vertBounds.value.set(latmin, latmax);
      material.uniforms.intensity.value = alpha_intensity;
      // Update scale and camera position
      material.uniforms.scale.value.copy(volumeShape);
      material.uniforms.cameraPos.value.copy(camera.position);
      // Mark material for update
      material.needsUpdate = true;
    }
  });
  
  return (
    <>
    {do_compute && (
      <Analyzer 
        variable1={analysis1} 
        variable2={analysis2}
        slice={timeSlice}
        setData={setVolumeData} 
      />
    )}
    <ZarrLoaderLRU
          variable={drei_var}
          setData={setVolumeData}
          slice={timeSlice}
          setMeta={setMeta}
    />
    {!isFlatTexture && 
      <group position={[0, 1.01, 0]}>
          <mesh ref={meshRef} rotation-y={Math.PI/2}>
            <boxGeometry args={[2, 2, 2]} />
            <shaderMaterial
              attach="material"
              args={[
                ({
                  glslVersion: THREE.GLSL3,
                  uniforms: {
                    map: { value: new THREE.Data3DTexture() },
                    cameraPos: { value: new THREE.Vector3() },
                    threshold: { value: 0.0 },
                    steps: { value: 150 },
                    scale: { value: new THREE.Vector3(1, 1, 1) },
                    flip: { value: true },
                    cmap: { value: new THREE.DataTexture() },
                    flatBounds: { value: new THREE.Vector4() },
                    vertBounds: { value: new THREE.Vector2() },
                    intensity: { value: 1.0 },
                  },
                  vertexShader: vertexShader,
                  fragmentShader: fragmentShader,
                  transparent: true,
                  blending: THREE.NormalBlending,
                  depthWrite: false,
                  side: THREE.BackSide,
                })
              ]}
            />
          </mesh>
      
          <mesh castShadow>
              <boxGeometry args={[volumeShape.x, volumeShape.y, volumeShape.z]} />
              <meshStandardMaterial transparent color={''} visible={false} />
          </mesh>

        <FrameBoxed
            width={volumeShape.x + 0.05} 
            height={volumeShape.y + 0.05} 
            depth={volumeShape.z + 0.05}
            color={color_axes}
          />
      </group>}

      {isFlatTexture && 
      <group position={[0, 1.01, 0]}>
        <mesh rotation-y={Math.PI/2}>
          <planeGeometry args={[flatShape[1]/flatShape[0],1]}/>
          <shaderMaterial attach='material'
            args={[{
              glslVersion:THREE.GLSL3,
              uniforms:{
                map: {value: flatText},
                cmap: { value: cmap_texture },
                threshold: { value: threshold }
              },
              vertexShader,
              fragmentShader:flatFragment,
              side:2
            }
            ]} />
          <meshStandardMaterial map={flatText} side={2}/>
        </mesh>
      </group>}
      
    </>
  );
}
