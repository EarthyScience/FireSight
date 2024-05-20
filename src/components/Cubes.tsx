import { Center } from '@react-three/drei'

import { useRef } from 'react'
import { Color, Mesh, MeshStandardMaterial } from 'three'
import {
  // useListBlade,
  // usePaneFolder,
  usePaneInput,
  // useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

function Cube() {
  const meshRef = useRef<Mesh>(null!)
  const containerElement = document.getElementById('myPane');
  const pane = useTweakpane(
    {
      color: '#daa520',
    },
    {
      title: 'Geometry Settings',
      container: containerElement,
    }
  )
  usePaneInput(pane, 'color', { label: 'Color' }, (event) => {
    const mesh = meshRef.current!
    const material = mesh.material as MeshStandardMaterial

    material.color.set(new Color(event.value))
  })

    return (
      <Center top>
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="goldenrod" />
        </mesh>
      </Center>
    )
  }

  export default Cube