import { Navbar, Footer, CanvasGeometry } from './components';
import Overlays from "./components/Overlays";
import { useSetAtom } from "jotai";
import { uiAtom } from "./state";

import './App.css'
export function App() {
  const setUi = useSetAtom(uiAtom);
  return (
    <>
    <Overlays />
    <Navbar />
    <Footer />
    <CanvasGeometry />
    <div id="myPane" className='pane'></div>
    <button className="button-about"
        onClick={() =>
          setUi((prev) => ({
            ...prev,
            modal: true,
          }))
        }
      >
      <a>About</a>
      </button>
    </>
  )
}

export default App