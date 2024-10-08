import { logoMPI } from "../assets/index";

import './Footer.css';

const Footer = () => (
  <div className="footer">
    <a href="https://www.bgc-jena.mpg.de/en/bgi/mdi" target="_blank">
      <img src={logoMPI} alt="logoMPI" height={35}/>
    </a>
    <p>Copyright Ⓒ 2024. All Rights Reserved.</p>
    <span>Contact :<a href="https://lazarusa.github.io/" target='_blank'>Lazaro Alonso</a> </span>
  </div>
);

export default Footer;
