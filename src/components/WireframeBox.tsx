import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface WireframeBoxProps {
  width?: number;
  height?: number;
  depth?: number;
  ticks?: number;
  origin?: [number, number, number]; // Origin for the box
}

const WireframeBox: React.FC<WireframeBoxProps> = ({
  width = 10,
  height = 10,
  depth = 10,
  ticks = 5,
  origin = [0, 0, 0], // Default origin
}) => {
  // Create box geometry
  const geometry = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);

  // Create the wireframe
  const wireframe = useMemo(() => new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ), [geometry]);

  useEffect(() => {
    // Set the position of the wireframe box to the origin
    wireframe.position.set(origin[0], origin[1], origin[2]);

    // Add ticks to the scene
    const tickMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const tickSize = 0.2;

    // Clear previous ticks if any
    while (wireframe.children.length > 0) {
      wireframe.remove(wireframe.children[0]);
    }

    // for (let i = 1; i <= ticks; i++) {
    //   // X-axis ticks
    //   const xTickPos = new THREE.Vector3((i * width) / ticks + origin[0], origin[1], origin[2]);
    //   const xTickStart = xTickPos.clone().add(new THREE.Vector3(0, -tickSize / 2, 0));
    //   const xTickEnd = xTickPos.clone().add(new THREE.Vector3(0, tickSize / 2, 0));
    //   const xTickGeometry = new THREE.BufferGeometry().setFromPoints([xTickStart, xTickEnd]);
    //   const xTickLine = new THREE.Line(xTickGeometry, tickMaterial);
    //   wireframe.add(xTickLine);

    //   // Y-axis ticks
    //   const yTickPos = new THREE.Vector3(origin[0], (i * height) / ticks + origin[1], origin[2]);
    //   const yTickStart = yTickPos.clone().add(new THREE.Vector3(-tickSize / 2, 0, 0));
    //   const yTickEnd = yTickPos.clone().add(new THREE.Vector3(tickSize / 2, 0, 0));
    //   const yTickGeometry = new THREE.BufferGeometry().setFromPoints([yTickStart, yTickEnd]);
    //   const yTickLine = new THREE.Line(yTickGeometry, tickMaterial);
    //   wireframe.add(yTickLine);

    //   // Z-axis ticks
    //   const zTickPos = new THREE.Vector3(origin[0], origin[1], (i * depth) / ticks + origin[2]);
    //   const zTickStart = zTickPos.clone().add(new THREE.Vector3(0, 0, -tickSize / 2));
    //   const zTickEnd = zTickPos.clone().add(new THREE.Vector3(0, 0, tickSize / 2));
    //   const zTickGeometry = new THREE.BufferGeometry().setFromPoints([zTickStart, zTickEnd]);
    //   const zTickLine = new THREE.Line(zTickGeometry, tickMaterial);
    //   wireframe.add(zTickLine);
    // }

    return () => {
      // Cleanup: remove ticks when component unmounts
      while (wireframe.children.length > 0) {
        wireframe.remove(wireframe.children[0]);
      }
    };
  }, [width, height, depth, ticks, origin, wireframe]);

  return (
    <>
      <primitive object={wireframe} />
      {/* Optional: Add text labels at ticks */}

      {/* {Array.from({ length: ticks }, (_, i) => (
        <React.Fragment key={i}>
          <Text
            position={[(i + 1) * (width / (ticks + 1)) + origin[0], origin[1] - 0.5, origin[2]]}
            fontSize={0.2}
            color="#ff0000"
          >
            {((i + 1) * width / ticks).toFixed(1)}
          </Text>
          <Text
            position={[origin[0] - 0.5, (i + 1) * (height / (ticks + 1)) + origin[1], origin[2]]}
            fontSize={0.2}
            color="#00ff00"
          >
            {((i + 1) * height / ticks).toFixed(1)}
          </Text>
          <Text
            position={[origin[0], origin[1], (i + 1) * (depth / (ticks + 1)) + origin[2]]}
            fontSize={0.2}
            color="#0000ff"
          >
            {((i + 1) * depth / ticks).toFixed(1)}
          </Text>
        </React.Fragment>
      ))} */}
    </>
  );
};

export default WireframeBox;
