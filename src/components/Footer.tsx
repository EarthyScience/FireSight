import { logoMPI } from "../assets/index";

import './Footer.css';

const Footer = () => (
  <div className="footer">
    <img src={logoMPI} alt="logoMPI" height={35}/>
    <p>Copyright Ⓒ 2024. All Rights Reserved.</p>
    <span>Contact :<a href="https://lazarusa.github.io/" target='_blank'>Lazaro Alonso</a> </span>
  </div>
);

export default Footer;
