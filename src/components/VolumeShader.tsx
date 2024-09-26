import * as THREE from 'three';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Mesh, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../utils/shaders/vertex.glsl';
import fragmentShader from '../utils/shaders/fragment.glsl';
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { genRand } from '../utils/colormap';
import { newVarData } from '../utils/volTexture';
import { updateMetadataDescription } from '../utils/metadata';
import { updateColorbar, getColors, rgbToHex } from '../utils/updateColorbar';
import { useControlPane } from './PaneControls';

type CustomMesh = Mesh & {
  material: ShaderMaterial;
};

export function VolumeShader() {
  const [meta, setMeta] = useState({});
  const [volumeData, setVolumeData] = useState(() => genRand(30));
  const [volumeText, setVolumeText] = useState<THREE.Data3DTexture | null>(null);
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(2, 2, 2));
  const [minmax, setMinMax] = useState<[number, number]>([0.0, 1.0]);
  const meshRef = useRef<CustomMesh>(null);

  const containerId = 'myPanePlugin';
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
    tmin,
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
    return updateMetadataDescription(meta, 'myDescription');
  }, [meta]);

  useEffect(() => {
    if (!volumeData) {
      // this is one is not getting set
      const randomArray = genRand(30);
      setVolumeData(randomArray);
      return;
    }

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
  
  

  useFrame(({ camera }) => {
    if (meshRef.current) {
      const material = meshRef.current.material;
      // First, handle volumeText readiness and other updates
      if (volumeText) {
        material.uniforms.map.value = volumeText;
        material.needsUpdate = true;
        meshRef.current.visible = true;
      } else {
        meshRef.current.visible = false;
      }
      // Finally, update the camera position uniform
      material.uniforms.cameraPos.value.copy(camera.position);
    }
  });
  // TODO: Why the mesh dimensions are not correct?
  

  const shaderMaterial = useMemo(() => ({
    glslVersion: THREE.GLSL3,
    uniforms: {
      map: { value: volumeText },
      cameraPos: { value: new THREE.Vector3() },
      threshold: { value: threshold },
      steps: { value: 400 },
      scale: { value: volumeShape },
      flip: { value: false },
      cmap: { value: cmap_texture },
      flatBounds: { value: new THREE.Vector4(lonmin, lonmax, tmin, tmax) },
      vertBounds: { value: new THREE.Vector2(latmin, latmax) },
    },
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
  }), [volumeText, threshold, volumeShape, cmap_texture, lonmin, lonmax, latmin, latmax, tmin, tmax]);

  return (
    <>
      <group position={[0, 1.01, 0]}>
        <ZarrLoaderLRU
          variable={drei_var}
          setData={setVolumeData}
          slice={tInterval}
          setMeta={setMeta}
        />
          <mesh ref={meshRef} rotation-y={Math.PI}>
            <boxGeometry args={[2, 2, 2]} />
            <shaderMaterial
              attach="material"
              args={[shaderMaterial]}
            />
          </mesh>
      
        <mesh castShadow>
          <boxGeometry args={[volumeShape.x, volumeShape.y, volumeShape.z]} />
          <meshStandardMaterial transparent color={''} visible={false} />
        </mesh>
      </group>
    </>
  );
}
