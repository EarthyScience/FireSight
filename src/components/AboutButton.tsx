import { useSetAtom } from "jotai";
import { uiAtom } from "../state";
  const AboutButton = () => {
    const setUi = useSetAtom(uiAtom);
    return (
        <button className="button-about"
          onClick={() =>
            setUi((prev) => ({
              ...prev,
              modal: true,
            }))
          }
        >
            <a>About</a>
        </button>
    );
  };
  
  export default AboutButton;