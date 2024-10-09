import * as THREE from 'three';
import { Text } from '@react-three/drei';
export function FrameBoxed({ 
  width = 2.2,
  height = 2.2,
  depth = 2.2,
  origin = [0, 1, 0]
}) {
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const edges = new THREE.EdgesGeometry(boxGeometry); // Extract only the edges (no diagonals)

  return (
  <group position={new THREE.Vector3(...origin)}>
    <mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#c8cdd2" />
      </lineSegments>
    </mesh>

    <Text
      position={[0, -height / 2, depth / 1.8]} // Right-Front of the box
      fontSize={0.1}
      color="#c8cdd2"
      // rotation={[-Math.PI / 2, 0, 0]}
    >
      depth / time
    </Text>

    <Text
      position={[-width / 1.8, -height / 2, 0]} // Front edge of the box
      fontSize={0.1}
      color="#c8cdd2"
      rotation={[0, -Math.PI / 2, 0]}
    >
      x / lon / longitude
    </Text>

    <Text
      position={[-width / 1.8, 0, -depth / 2]} // Vertical-left-front edge
      fontSize={0.1}
      color="#c8cdd2"
      rotation={[0, 0, Math.PI / 2]}
    >
      y / lat / latitude
    </Text>
</group>
);
}
