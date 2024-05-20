import { logoSeasFire } from "../assets/index";
import AboutButton from "./AboutButton";
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logoSeasFire} alt="SeasFire"/>
      <AboutButton />
    </nav>
  );
};

export default Navbar;