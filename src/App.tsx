import { Navbar, Footer, CanvasGeometry, } from './components';
import Overlays from "./components/Overlays";
import { motion } from 'framer-motion';
import { useState } from 'react';

import './App.css'
export function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (event, info) => {
    setPosition({ x: info.point.x, y: info.point.y });
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
        style={{ x: position.x, y: position.y }}
      >
        {/* Top left handle */}
        <motion.div
          className='drag-handle top-left'
          drag='both' // 'both' is not allowed? but it does work???
          onDrag={handleDrag}
        />
    </motion.div>
    </>
  )
}

export default App