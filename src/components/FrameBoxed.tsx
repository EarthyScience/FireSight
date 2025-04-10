import * as React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useMemo } from 'react';

function FrameBoxed({ 
  width = 2.2,
  height = 2.2,
  depth = 2.2,
  origin = [0, 0, 0],
  fontsize = 0.065,
  color = "#c8cdd2",
  sepFactor = 1.9,
}) {

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);
  const edges = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]); // Extract only the edges (no diagonals)


  return (
  <group position={new THREE.Vector3(...origin)}>
    <mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} />
      </lineSegments>
    </mesh>
    <Text
      position={[0, -height / 2, depth / sepFactor]}
      fontSize={fontsize}
      color={color}
      // rotation={[-Math.PI / 2, 0, 0]}
    >
      depth / time
    </Text>
    <Text
      position={[-width / 1.8, -height / 2, 0]}
      fontSize={fontsize}
      color={color}
      rotation={[0, -Math.PI / 2, 0]}
    >
      x / lon / longitude
    </Text>

    <Text
      position={[-width / 2, -height / 2, depth / sepFactor]}
      fontSize={fontsize}
      color={color}
      // rotation={[-Math.PI / 2, 0, 0]}
    >
      start
    </Text>

    <Text
      position={[width / 2, -height / 2, depth / sepFactor]}
      fontSize={fontsize}
      color={color}
      // rotation={[-Math.PI / 2, 0, 0]}
    >
      end
    </Text>

    <Text
      position={[-width / sepFactor, 0, -depth / 2]}
      fontSize={fontsize}
      color={color}
      rotation={[0, 0, Math.PI / 2]}
    >
      y / lat / latitude
    </Text>
</group>
);
}
export default React.memo(FrameBoxed);