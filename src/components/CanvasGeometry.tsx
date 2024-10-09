import { Canvas } from '@react-three/fiber';
import {VolumeShader} from './VolumeShader'
// import { AxesBox } from './CustomAxes';
import WireframeBox from './WireframeBox';

import * as THREE from 'three'
// import { Perf } from 'r3f-perf'
// import { ParticleInstances } from './ParticleInstances'

import {
  AccumulativeShadows,
  RandomizedLight,
  // Environment,
  OrbitControls } from '@react-three/drei'

import './CanvasGeometry.css'

export function CanvasGeometry() {
  return (
    <div className='canvas'>
      <Canvas shadows camera={{ position: [-4, 5, 4.5], fov: 50 }}>
        {/* <Perf position="bottom-left" /> */}
          {/* <AxesBox width={1.2} height={2.2} depth={1.2} ticks={4} origin={[-1.2, 0, -1.2]} /> */}
          <WireframeBox 
            width={2.2} 
            height={2.2} 
            depth={2.2} 
            ticks={5} 
            origin={[0,1,0]} // Specify the origin for the box
          />
          <VolumeShader />
          {/* <ParticleInstances /> */}
          <OrbitControls 
            enableDamping={true} 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2}
            target={new THREE.Vector3(0,1,0)}
            />
          <ambientLight intensity={0.5} />
          <AccumulativeShadows temporal frames={200} color="black" colorBlend={0.5} opacity={0.5} scale={10} alphaTest={0.85}>
            <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
          </AccumulativeShadows>
        {/* <Environment preset='dawn'/> */}

        {/* <axesHelper scale={4}/> */}
      </Canvas>
    </div>
  )
}

export default CanvasGeometry