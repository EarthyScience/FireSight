import { logoSeasFire } from "../assets/index";
import AboutButton from "./AboutButton";
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="https://github.com/EarthyScience/ViZarrDev" target="_blank">
        <img src={logoSeasFire} alt="ViZarrDev"/>
      </a>
      <AboutButton />
    </nav>
  );
};

export default Navbar;