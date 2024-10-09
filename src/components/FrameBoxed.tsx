import * as THREE from 'three';
export function FrameBoxed({ width = 2.2, height = 2.2, depth = 2.2, origin = [0, 1, 0] }) {
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const edges = new THREE.EdgesGeometry(boxGeometry); // Extract only the edges (no diagonals)

  return (
    <mesh position={new THREE.Vector3(...origin)}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#c8cdd2" />
      </lineSegments>
    </mesh>
  );
}
