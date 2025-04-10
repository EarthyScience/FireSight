import { useSetAtom } from "jotai";
import { uiAtom } from '../state';
import { logoSF } from "../assets/index";

import './AboutModal.css'

const AboutModal = () => {
  const setUi = useSetAtom(uiAtom);
  return (
    <div className="modal">
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={() =>
            setUi((prev) => ({
              ...prev,
              modal: false,
            }))
          }
        >
          &times;
        </button>
        {/* <img src={logoSF} alt="SeasFire" width={"80%"}/> */}
        <h1>ViZarrDev</h1>
        <a> builds on the lessons learned from the visualization prototype from the SeasFire project. </a>

        <p>
        The ESA-funded SeasFire project is exploring the potential of spatio-temporal asynchronous links happening between pre-occurring and non-overlapping atmospheric conditions and European fire regimes to predict the seasonal burned areas sizes in Europe by leveraging two major advancements of our time:
        </p>
        <ul>
          <li>
          the availability of a huge amount of satellite data with a good spatio-temporal resolution, which will be used as fire drivers called the Earth system variables, and
          </li>
          <li>
          the progress in Deep Learning (DL) and especially in graph and image based modelling frameworks, finding methods capable of capturing the spatio-temporal interactions of the Earth System variables.
          </li>
        </ul>
  
        <a href="https://seasfire.hua.gr/">https://seasfire.hua.gr/</a><br/>
        <a href="https://zenodo.org/records/8055879">zenodo</a>
        <p>
        <br/>
        <strong>Citation: </strong> <br/><br/>
        Alonso, L., Gans, F., Karasante, I., Ahuja, A., Prapas, I., Kondylatos, S., Papoutsis, I., Panagiotou, E., Mihail, D., Cremer, F., Weber, U., & Carvalhais, N. (2023). SeasFire Cube: A Global Dataset for Seasonal Fire Modeling in the Earth System (0.3) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.8055879
        </p>
        <p> <strong> Contact :</strong></p>
        <a href="https://lazarusa.github.io/" target='_blank'>Lazaro Alonso &</a>
        <a href="https://www.bgc-jena.mpg.de/person/jpoehls/2206" target='_blank'> Jeran Poehls</a>

       <p>Max-Planck Institute for Biogeochemistry<br/>
        Hans-Knöll Str. 10<br/>
        07745 Jena
        </p>
        <a >
        Copyright Ⓒ 2024. Licensed under the Apache License, Version 2.0.
        </a>
      </div>
    </div>
  );
};
export default AboutModal;