import { Navbar, Footer, CanvasGeometry, } from './components';
import Overlays from "./components/Overlays";
import './App.css'
export function App() {
  return (
    <>
    <Overlays />
    <Navbar />
    <Footer />
    <CanvasGeometry />
    <div id="myPane" className='pane'></div>
    <div id="myPanePlugin" className='panePlugin'></div>
    <div id="myDescription" className='description'>
      Description
    </div>
    <div id="colorbar-container">
      <div id="colorbar"></div>
      <div id="ticks"></div>
    </div>
    </>
  )
}

export default App