import { logoBGC_MPI, logoBGC, logoMPI } from "../assets/index";

import './Footer.css';

const Footer = () => (
  <div className="footer">
    <div className="large-screen-logo">
      <a href="https://www.bgc-jena.mpg.de/en/bgi/mdi" target="_blank">
        <img src={logoBGC_MPI} alt="logoMPI" height={35}/>
      </a>
    </div>
    <div className="small-screen-logos">
      <a href="https://www.bgc-jena.mpg.de/en/bgi/mdi" target="_blank">
        <img src={logoBGC} alt="logoBGC" height={35}/>
      </a>
    </div>
    <div className="expandable-text">
      <p>Ⓒ <a href="https://github.com/EarthyScience/FireSight?tab=Apache-2.0-1-ov-file#readme" target="_blank">Apache License, Version 2.0</a></p>
      <span>Contact :<a href="https://lazarusa.github.io/" target='_blank'>Lazaro Alonso</a>&
      <a href="https://www.bgc-jena.mpg.de/person/jpoehls/2206" target='_blank'>Jeran Poehls</a>
      </span>

    </div>
    <div className="small-screen-logos">
      <a href="https://www.bgc-jena.mpg.de/en/bgi/home" target="_blank">
        <img src={logoMPI} alt="logoMPI" className="small-screen-logo" height={35}/>
      </a>
    </div>
  </div>
);

export default Footer;
