import { Navbar, Footer, CanvasGeometry, TestData } from './components';
import Overlays from "./components/Overlays";

import './App.css'
export function App() {
  return (
    <>
    <Overlays />
    <Navbar />
    <TestData />
    <Footer />
    <CanvasGeometry />
    <div id="myPane" className='pane'></div>
    </>
  )
}

export default App