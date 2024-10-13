import * as THREE from 'three'
THREE.Cache.enabled = true;
import { Canvas } from '@react-three/fiber';
import { VolumeShader } from './VolumeShader'
// import { Perf } from 'r3f-perf'

import {
  AccumulativeShadows,
  RandomizedLight,
  // Environment,
  OrbitControls } from '@react-three/drei'

import './CanvasGeometry.css'

export function CanvasGeometry() {
  return (
    <div className='canvas'>
      <Canvas shadows camera={{ position: [-4.5, 3, 4.5], fov: 50 }}>
        {/* <Perf position="bottom-left" style={{ bottom: '3.25rem' }} /> */}
          <VolumeShader />          
          <OrbitControls 
            enableDamping={true} 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI}
            target={new THREE.Vector3(0,1,0)}
          />
          <ambientLight intensity={0.5} />
          <AccumulativeShadows temporal frames={200} color="black" colorBlend={0.5} opacity={0.5} scale={10} alphaTest={0.85}>
            <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
          </AccumulativeShadows>
      </Canvas>
    </div>
  )
}

export default CanvasGeometry