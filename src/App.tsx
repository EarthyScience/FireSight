import { Navbar, Footer, CanvasGeometry, } from './components';
import Overlays from "./components/Overlays";
import { motion } from 'framer-motion';
import { useState } from 'react';
import './App.css'
export function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (event, info) => {
    setPosition({ x: position.x + info.delta.x, y: position.y + info.delta.y });
  };
  return (
    <>
    <Overlays />
    <Navbar />
    <Footer />
    <CanvasGeometry />
    <motion.div
      id="myPane"
      className='pane'
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <motion.div
          className='drag-handle'
          drag
          onDrag={handleDrag}
        />
    </motion.div>
    </>
  )
}

export default App