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
      Description :
      <div className='hiddenMeta'>
        Relevant information should be displayed here.
      </div>
    </div>
    <div id="colorbar-container">
      <div id="name-label" className="left-label">name</div>
      <div id="colorbar"></div>
      <div id="ticks"></div>
      <div id="units-label" className="right-label">units</div>
    </div>
    </>
  )
}

export default App