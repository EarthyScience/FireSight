import * as THREE from 'three';
import { Color, Mesh, MeshStandardMaterial } from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import niceColors from 'nice-color-palettes';
import { Center } from '@react-three/drei';
import {
    usePaneInput,
    useTweakpane,
} from '../../pane';
import { Lut } from 'three/examples/jsm/math/Lut.js';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const lut = new Lut('blackbody', 512);
lut.minV = 1;
lut.maxV = 300;

type DataType = { color: THREE.Color };
const data: DataType[] = [];
for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
        for (let z = 1; z <= 10; z++) {
            const result = lut.getColor(x ** 2 + y ** 2 + z ** 2);
            console.log(result);
            data.push({ color: result });
        }
    }
}

console.log(data);

function Boxes({ length = 1000, size = [0.05, 0.05, 0.05] }) {
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
        const halfRoot = root / 2;
        for (let x = 0; x < root; x++)
          for (let y = 0; y < root; y++)
            for (let z = 0; z < root; z++) {
              const id = i++
              tempObject.position.set((halfRoot - x)/root, (halfRoot - y)/root, (halfRoot - z)/root)
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
                <boxGeometry args={size}>
                    <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
                </boxGeometry>
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

export default Boxes;
