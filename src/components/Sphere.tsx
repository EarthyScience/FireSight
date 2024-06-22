import { Center } from '@react-three/drei'

import { useRef } from 'react'
import { Color, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import {
  // useListBlade,
  // usePaneFolder,
  usePaneInput,
  // useSliderBlade,
  // useTextBlade,
  useTweakpane,
} from '../../pane'

function Sphere() {

  const meshRef = useRef<Mesh>(null!)

  const panePlugin = useTweakpane(
    {
      color: '#daa520',
      interval: {min: 16, max: 48},
    },
    {
      title: 'Geometry Settings',
      container:document.getElementById('myPanePlugin'),
    }
  )
  const [threshold] = usePaneInput(panePlugin, 'color', {
    label: 'hex',
  })
  const [tInterval] = usePaneInput(panePlugin, 'interval', {
    label: 'interval',
    min: 1,
    max: 100,
    step: 1,
  })
  console.log(tInterval)

  const pane = useTweakpane(
    {
      color: '#daa520',
    },
    {
      title: 'Geometry Settings',
      container: document.getElementById('myPane'),
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
          <sphereGeometry args={[0.75, 64, 64]} />
          <meshStandardMaterial color="goldenrod" />
        </mesh>
      </Center>
    )
  }

  export default Sphere