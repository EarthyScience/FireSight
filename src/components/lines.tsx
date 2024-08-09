import { useRef, useMemo } from 'react';
import { PlotLine } from './PlotLine';

const generateSinePlotData = (xMax, yAspectRatio, numPoints = 100) => {
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * xMax;
      const y = Math.sin((x / xMax) * 2 * Math.PI) * yAspectRatio;
      points.push([x, y, 0]);
    }
    
    return points;
  };
  
  const createTextSprite = (text, color = 'white') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '100px Arial';
    context.fillStyle = color;
    context.fillText(text, 120, 120);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    sprite.scale.set(0.15, 0.08, 1);
    
    return sprite;
  };
  
  const createAxisGeometries = (xMax, yAspectRatio) => {
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(xMax, 0, 0)
    ]);
  
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -yAspectRatio, 0),
      new THREE.Vector3(0, yAspectRatio, 0)
    ]);
  
    return { xAxisGeometry, yAxisGeometry };
  };
  
  const createTicksAndLabels = (xMax, yAspectRatio, xTicks = 4, yTicks = 4) => {
    const xTickGeometries = [];
    const yTickGeometries = [];
    const xLabels = [];
    const yLabels = [];
    const tickSize = 0.05;
  
    for (let i = 0; i <= xTicks; i++) {
      const x = (i / xTicks) * xMax;
      xTickGeometries.push(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -tickSize * yAspectRatio, 0),
        new THREE.Vector3(x, tickSize * yAspectRatio, 0)
      ]));
      
      const label = createTextSprite(x.toFixed(1), 'white');
      label.position.set(x -0.02, -0.11 * yAspectRatio, 0);
      xLabels.push(label);
    }
  
    for (let i = 0; i <= yTicks; i++) {
      const y = ((i / yTicks) * 2 - 1) * yAspectRatio;
      yTickGeometries.push(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-tickSize * xMax / 6, y, 0),
        new THREE.Vector3(tickSize * xMax / 6, y, 0)
      ]));
      
      const labelValue = (y / yAspectRatio).toFixed(1);
      const label = createTextSprite(labelValue, 'white');
      label.position.set(-0.1, y, 0);
      yLabels.push(label);
    }
  
    return { xTickGeometries, yTickGeometries, xLabels, yLabels };
  };

//   to component (into)

const plotLineRef = useRef();

const sinePlotData = useMemo(() => generateSinePlotData(xMax, yAspectRatio), [xMax, yAspectRatio]);
const { xAxisGeometry, yAxisGeometry } = useMemo(() => createAxisGeometries(xMax, yAspectRatio), [xMax, yAspectRatio]);
const { xTickGeometries, yTickGeometries, xLabels, yLabels } = useMemo(() => 
  createTicksAndLabels(xMax, yAspectRatio), [xMax, yAspectRatio]);

  {/* <group position={[-1, 0.25, 1.01]}> 
  <PlotLine ref={plotLineRef} data={sinePlotData} color="yellow" lineWidth={2} />
      
      <line>
        <bufferGeometry attach="geometry" {...xAxisGeometry} />
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...yAxisGeometry} />
        <lineBasicMaterial attach="material" color="green" />
      </line>
      
      {xTickGeometries.map((geometry, index) => (
        <line key={`xTick${index}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color="red" />
        </line>
      ))}
      {yTickGeometries.map((geometry, index) => (
        <line key={`yTick${index}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color="green" />
        </line>
      ))}
      
      {xLabels.map((label, index) => (
        <primitive key={`xLabel${index}`} object={label} />
      ))}
      {yLabels.map((label, index) => (
        <primitive key={`yLabel${index}`} object={label} />
      ))}
  </group> */}


//   function rgbToHex(color: { r: number; g: number; b: number }): string {
//     const toHex = (c: number): string => {
//       const hex = Math.round(c * 255).toString(16);
//       return hex.length === 1 ? '0' + hex : hex;
//     };
  
//     const r = toHex(color.r);
//     const g = toHex(color.g);
//     const b = toHex(color.b);
  
//     return `#${r}${g}${b}`;
//   }