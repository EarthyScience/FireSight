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
    </>
  )
}

export default App