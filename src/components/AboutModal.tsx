import { useSetAtom } from "jotai";
import { uiAtom } from '../state';
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
        <h2>SeasFire</h2>
        <p>
        The ESA-funded SeasFire project is exploring the potential of spatio-temporal asynchronous links happening between pre-occurring and non-overlapping atmospheric conditions and European fire regimes to predict the seasonal burned areas sizes in Europe by leveraging two major advancements of our time:
        <ul>
          <li>
          the availability of a huge amount of satellite data with a good spatio-temporal resolution, which will be used as fire drivers called the Earth system variables, and
          </li>
          <li>
          the progress in Deep Learning (DL) and especially in graph and image based modelling frameworks, finding methods capable of capturing the spatio-temporal interactions of the Earth System variables.
          </li>
        </ul>
        </p>
      </div>
    </div>
  );
};
export default AboutModal;