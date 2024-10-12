import * as React from 'react';
import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../utils/shaders/vertex.glsl';
import fragmentShader from '../utils/shaders/fragment.glsl';

interface VolumeMeshProps {
  volumeShape: THREE.Vector3;
  volumeTexture: THREE.Data3DTexture | null;
  threshold: number;
  steps: number;
  mode: boolean;
  cmap_texture: THREE.DataTexture;
  lo_tbounds: THREE.Vector4;
  latbounds: THREE.Vector2;
  intensity: number;
}

function VolumeMesh({
  volumeShape,
  volumeTexture,
  threshold,
  steps,
  mode,
  cmap_texture,
  lo_tbounds,
  latbounds,
  intensity
}: VolumeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Create the shader material only once
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        map: { value: volumeTexture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: threshold },
        steps: { value: steps },
        scale: { value: volumeShape },
        flip: { value: mode },
        cmap: { value: cmap_texture },
        flatBounds: { value: lo_tbounds },
        vertBounds: { value: latbounds },
        intensity: { value: intensity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    materialRef.current = material;
    return material;
  }, []);  // Empty array means this material is created only once

  // Use geometry once, avoid recreating
  const geometry = useMemo(() => new THREE.BoxGeometry(volumeShape.x, volumeShape.y, volumeShape.z), [volumeShape]);

  // Update shader material's uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.map.value = volumeTexture;
      materialRef.current.uniforms.threshold.value = threshold;
      materialRef.current.uniforms.steps.value = steps;
      materialRef.current.uniforms.scale.value = volumeShape;
      materialRef.current.uniforms.flip.value = mode;
      materialRef.current.uniforms.cmap.value = cmap_texture;
      materialRef.current.uniforms.flatBounds.value = lo_tbounds;
      materialRef.current.uniforms.vertBounds.value = latbounds;
      materialRef.current.uniforms.intensity.value = intensity;

      // Trigger material update
      materialRef.current.needsUpdate = true;
    }
  }, [volumeTexture, threshold, steps, volumeShape, mode, cmap_texture, lo_tbounds, latbounds, intensity]);

  // Update camera position in the shader on each frame
  useFrame(({ camera }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.cameraPos.value = camera.position;
      materialRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation-y={Math.PI / 2} geometry={geometry}>
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  );
}

export default React.memo(VolumeMesh);
