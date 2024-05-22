import * as THREE from 'three';
import { Color, Mesh, MeshStandardMaterial } from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
// import niceColors from 'nice-color-palettes';
import { Center } from '@react-three/drei';
import {
    usePaneInput,
    useTweakpane,
} from '../../pane';
import { setPalette, valuetoCmap, minMax, genRand} from '../utils/colormap'

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
// http://potree.org/potree/examples/load_project.html
// lon, lat, time
// 1440, 720, 100
const lon = 360/2/2;
const lat = 180/2/2;
const tSteps = 40;
// Generate 1000 random numbers
const raw_data = genRand(lon*lat*tSteps);

const { min, max } = minMax(raw_data);
const cmap = setPalette({ mn: min, mx: max });
const data = raw_data.map(value => valuetoCmap({ cmap, value }));

function BoxedParticles({ lx = 360/2/2, ly=180/2/2, lz=40, size = [0.016, 0.016] }) {
    const length = lx * ly * lz
    const containerElement = document.getElementById('myPane');
    const pane = useTweakpane(
        {
            color: '#daa520',
        },
        {
            title: 'Geometry Settings',
            container: containerElement,
        }
    );

    const [hovered, set] = useState<number | null>(null);
    const colorArray = useMemo(() => {
        return Float32Array.from(data.flatMap(item => tempColor.set(item.color).toArray()));
    }, [data]);

    const meshRef = useRef<Mesh>(null);
    const prevRef = useRef<number | null>(null);
    useEffect(() => void (prevRef.current = hovered), [hovered])

    usePaneInput(pane, 'color', { label: 'Color' }, (event) => {
        const mesh = meshRef.current;
        const material = mesh.material as MeshStandardMaterial;
        material.color.set(new Color(event.value));
    });

    useFrame(() => {
        let i = 0;
        const root = Math.round(Math.pow(length, 1 / 3));
        const halfRoot_x = lx / 2;
        const halfRoot_y = ly / 2;
        const halfRoot_z = lz / 2;

        for (let x = 0; x < lx; x++)
          for (let y = 0; y < ly; y++)
            for (let z = 0; z < lz; z++) {
              const id = i++
              tempObject.position.set((halfRoot_x - x)/root, (halfRoot_y - y)/root, (halfRoot_z - z)/root)
              
              if (hovered !== prevRef.Current) {
                ;(id === hovered ? tempColor.setRGB(10, 10, 10) : tempColor.set(data[id].color)).toArray(colorArray, id * 3)
                meshRef.current.geometry.attributes.color.needsUpdate = true
              }
              tempObject.updateMatrix()
              meshRef.current.setMatrixAt(id, tempObject.matrix)
            }
        meshRef.current.instanceMatrix.needsUpdate = true
    });

    return (
        <Center top>
            <instancedMesh
                ref={meshRef}
                args={[null, null, length]}
                onPointerMove={(e) => (e.stopPropagation(), set(e.instanceId))}
                onPointerOut={(e) => set(null)}>
                <planeGeometry args={size}>
                    <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
                </planeGeometry>
                <meshStandardMaterial
                    metalness={1}
                    roughness={0.1}
                    toneMapped={false}
                    vertexColors
                />
            </instancedMesh>

        </Center>
    );
}

export default BoxedParticles;
