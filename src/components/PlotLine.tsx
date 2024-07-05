import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PlotLine = ({ data, color = 'white', lineWidth = 1 }) => {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const points = data.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
  }, [data]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, linewidth: lineWidth });
  }, [color, lineWidth]);

  useFrame((state, delta) => {
    // You can animate or update the mesh here if needed
    // For example, rotate the line:
    // meshRef.current.rotation.y += delta * 0.5;
  });

  return <line ref={meshRef} geometry={geometry} material={material} />;
};