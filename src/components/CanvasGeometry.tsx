import * as THREE from 'three'
THREE.Cache.enabled = true;
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, Environment } from '@react-three/drei'
import * as zarr from 'zarrita'
import { arr, variables } from './ZarrLoaderLRU'
import { useEffect, useState } from 'react';
import './placeholder.css'


arr.then(event=>console.log(typeof(event)))
export function CanvasGeometry() {
  const [useVariable,setUseVariable] = useState(null)

  return (
    <>
    <div className='canvas'>
      <Canvas shadows camera={{ position: [-4.5, 3, 4.5], fov: 50 }}
      frameloop="demand"
      >
        <Center top position={[-1, 0, 1]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="indianred" />
          </mesh>
        </Center>
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <Environment preset="city" />
      </Canvas>
    </div>
    {/* This drop down is temp just to show the consolidating of variables */}
    <select 
      className='varDropdown' 
      onChange={(event)=>setUseVariable(event.target.value)}
      
    >
      <option value="" disabled>Select an option</option>
      {variables.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
        ))}

    </select>
    </>
  )
}

export default CanvasGeometry