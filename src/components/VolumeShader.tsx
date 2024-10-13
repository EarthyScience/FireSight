import * as THREE from 'three';
THREE.Cache.enabled = true;
import { useEffect, useState } from 'react';
import vertexShader from '../utils/shaders/vertex.glsl';
import flatFragment from '../utils/shaders/fragmentFlat.glsl';
import ZarrLoaderLRU from './ZarrLoaderLRU';
import { genRand } from '../utils/colormap';
import { newVarData, new2DTexture } from '../utils/volTexture';
import { updateMetadataDescription } from '../utils/metadata';
import { updateColorbar, getColors, rgbToHex } from '../utils/updateColorbar';
import { useControlPane } from './PaneControls';
import { Analyzer } from './AnalysisFunctions';
import FrameBoxed from './FrameBoxed';
import VolumeMesh from './VolumeMesh';
import { updateTexture } from '../utils/colormap'

export function VolumeShader() {
  const [meta, setMeta] = useState({});
  const [volumeData, setVolumeData] = useState(() => genRand(50));
  const [volumeText, setVolumeText] = useState<THREE.Data3DTexture | null>(null);
  const [volumeShape, setVolumeShape] = useState(new THREE.Vector3(2, 2, 2));
  const [isFlatTexture, setIsFlatTexture] = useState(false);
  const [flatText, setFlatText] = useState<THREE.DataTexture | null>(null);
  const [flatShape, setFlatShape] = useState([1, 1]);
  const [minmax, setMinMax] = useState<[number, number]>([0.0, 1.0]);
  const [cmapTexture, setCmapTexture] = useState<THREE.DataTexture | null>(null);

  const containerId = 'myPanePlugin';
  // Get control pane values
  const {
    thresholdMode,
    threshold,
    cmap_texture_name,
    drei_var,
    timeSlice,
    lonmax,
    lonmin,
    latmax,
    latmin,
    tmax,
    tmin,
    var1,
    var2,
    compute,
    color_axes,
    alpha_intensity,
    alpha,
    nan_color,
    nan_alpha
  } = useControlPane(containerId);

  useEffect(() => {
    // Update colorbar whenever minmax or colormap name changes
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
    // Update metadata description on meta change
    updateMetadataDescription(meta, 'myDescription', 'name-label', 'units-label');
  }, [meta]);

  useEffect(() => {
    // Create volumeTexture if 3D data
    if (!volumeData) {
      setVolumeData(genRand(50));
      return;
    }
    if (volumeData.shape.length !== 3) {
      setIsFlatTexture(true);
      return;
    }
    setIsFlatTexture(false);

    const [newText, newShape, newMinmax] = newVarData(volumeData);
    setMinMax(newMinmax);
    setVolumeText(newText);

    // Set volume shape based on data dimensions
    const shapeRatio = newShape[1] / newShape[2] * 2;
    setVolumeShape(new THREE.Vector3(2, shapeRatio, 2));
  }, [volumeData]);

  useEffect(() => {
    // Create 2D texture if 2D data
    if (!isFlatTexture) return;
    const [newText, newShape, newMinmax] = new2DTexture(volumeData);
    setFlatShape(newShape);
    setMinMax(newMinmax);
    setFlatText(newText);
  }, [isFlatTexture, volumeData]);

  useEffect(() => {
    const updatedTexture = updateTexture(
      cmapTexture,      // Pass the current texture
      cmap_texture_name, 
      alpha, 
      nan_color, 
      nan_alpha
    );
    setCmapTexture(updatedTexture);
  }, [cmap_texture_name, cmapTexture, alpha, nan_color, nan_alpha]);

  return (
    <>
      {compute && (
        <Analyzer 
          variable1={var1} 
          variable2={var2}
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
      <group position={[0, 1.01, 0]}>
        {!isFlatTexture ? (
          <>
            <VolumeMesh
              volumeShape={volumeShape}
              volumeTexture={volumeText}
              threshold={threshold}
              steps={150}
              mode={thresholdMode}
              cmap_texture={cmapTexture!}
              lo_tbounds={new THREE.Vector4(lonmin, lonmax, tmin, tmax)}
              latbounds={new THREE.Vector2(latmin, latmax)}
              intensity={alpha_intensity}
            />
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
          </>
        ) : (
          <mesh rotation-y={Math.PI / 2}>
            <planeGeometry args={[flatShape[1] / flatShape[0], 1]} />
            <shaderMaterial attach='material'
              args={[{
                glslVersion: THREE.GLSL3,
                uniforms: {
                  map: { value: flatText },
                  cmap: { value: cmapTexture!},
                  threshold: { value: threshold },
                },
                vertexShader,
                fragmentShader: flatFragment,
                side: 2,
              }]}
            />
            <meshStandardMaterial map={flatText} side={2} />
          </mesh>
        )}
      </group>
    </>
  );
}
