import { createPortal } from "react-dom";
import { useAtomValue } from "jotai";
import AboutModal from "./AboutModal";
import {uiAtom } from "../state";

const mountElement = document.getElementById("overlays");

const Overlays = () => {
  const ui = useAtomValue(uiAtom);
  return mountElement ? createPortal(<>{ui.modal && <AboutModal />}</>, mountElement) : null;
};
export default Overlays;