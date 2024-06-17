import { Canvas } from '@react-three/fiber';
import Sphere from './Sphere';
// import Cube from './Cubes';
// import Boxes from './BoxInstances';
import BoxedParticles from './ParticleInstances';
import BoxInstances from './BoxInstances';
import {VolumeShader} from './VolumeShader'
import * as THREE from 'three'

import { Perf } from 'r3f-perf'

import {
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  OrbitControls } from '@react-three/drei'

import './CanvasGeometry.css'


export function CanvasGeometry() {

  return (
    <div className='canvas'>
      <Canvas shadows camera={{ position: [-4, 5, 4.5], fov: 50 }}>
        <Perf position="bottom-left" />
          <VolumeShader />
          {/* <BoxInstances /> */}
          {/* <BoxedParticles /> */}
          {/* <Cube /> */}
          {/* <Sphere /> */}
          <OrbitControls 
            enableDamping={true} 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2}
            target={new THREE.Vector3(0,1,0)}
            />
          <AccumulativeShadows temporal frames={200} color="black" colorBlend={0.5} opacity={0.5} scale={10} alphaTest={0.85}>
            <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
          </AccumulativeShadows>
        <Environment preset='dawn' background backgroundBlurriness={0.5} />
        <axesHelper scale={4}/>
      </Canvas>
    </div>
  )
}

export default CanvasGeometry