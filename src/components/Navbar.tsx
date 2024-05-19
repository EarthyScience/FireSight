import { logoSeasFire } from "../assets/index";
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logoSeasFire} alt="SeasFire"/>
      <ul>
        {/* <li>
          <a href="/">Home </a>
        </li> */}
        {/* <li>
          <a href="/about">About</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;