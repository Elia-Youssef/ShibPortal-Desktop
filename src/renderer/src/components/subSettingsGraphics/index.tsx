import styles from "./styles.module.css"
import ArrowLeft from "../../assets/ArrowLeftd.png";
import ArrowRight from "../../assets/ArrowRight.png";
import {useEffect, useState} from "react";
import PopupSave from "@renderer/components/PopupSave";
import PopupReset from "@renderer/components/PopupReset";
import PopupBack from "@renderer/components/PopupBack";

export default function subSettingsGraphics() {

  const [activeTab, setActiveTab] = useState('High');
  // const [sliderValue, setSliderValue] = useState(30);
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  const [isModalOpenBack, setIsModalOpenBack] = useState(false);
  const [isModalOpenReset, setIsModalOpenReset] = useState(false);
  const modes = ['Windowed', 'Borderless', 'FullScreen'];
  const resolutions = ['1920x1080', '1280x720', '1024x768', '800x600'];
  const [currentModeIndexDisplay, setCurrentModeIndexDisplay] = useState(0);
  const [currentModeIndexResolution, setCurrentModeIndexResolution] = useState(0);
  let selectedDisplayMode,selectedQuality,selectedResolution

  useEffect(() => {
    GetSettings();
  }, []);
  const openModalSave = () => {
    setIsModalOpenSave(true);
    setSettings()
  };
  const openModalReset= () => {
    setIsModalOpenReset(true);
  };
  const closeModalReset = () => {
    setIsModalOpenReset(false);
  };
  const openModalBack = async () => {
    setIsModalOpenBack(true);
  };
  const closeModalBack = () => {
    setIsModalOpenBack(false);
  };
  // const handleSliderChange = (event) => {
  //   setSliderValue(event.target.value);
  // };

  const setSetting = async () =>{

  switch (modes[currentModeIndexDisplay]) {
    case 'Windowed':
      selectedDisplayMode = "W";
      break;
    case 'Borderless':
      selectedDisplayMode = "WF";
      break;
    case 'FullScreen':
      selectedDisplayMode = "F";
      break;
    default:
      selectedDisplayMode = "W";
  }
  selectedResolution = resolutions[currentModeIndexResolution];
  switch (activeTab) {
    case 'Low':
      selectedQuality = 0;
      break;
    case 'Med':
      selectedQuality = 1;
      break;
    case 'High':
      selectedQuality = 2;
      break;
    case 'Ultra':
      selectedQuality = 3;
      break;
    default:
      selectedQuality = 2; // Default to 'High' if nothing matches
  }
}
  const setSettings = async () => {
    window.ShibAPI.SetSettingsGraphics(selectedDisplayMode,selectedResolution,selectedQuality);
  }

  const GetSettings = async () => {
    const result = await window.ShibAPI.GetSettingsGraphics();
    if (result) {

       let selectedDisplayMode
      switch (result.Mode) {
        case 'W':
          selectedDisplayMode = "Windowed";
          break;
        case 'WF':
          selectedDisplayMode = "Borderless";
          break;
        case 'F':
          selectedDisplayMode = "FullScreen";
          break;
        default:
          selectedDisplayMode = "Windowed";
      }

      switch (result.Quality) {
        case 0:
          setActiveTab('Low');
          break;
        case 1:
          setActiveTab('Med');
          break;
        case 2:
          setActiveTab('High');
          break;
        case 3:
          setActiveTab('Ultra');
          break;
        default:
          setActiveTab('High');
      }
      const modeIndex = modes.indexOf(selectedDisplayMode);
      const resolutionIndex = resolutions.indexOf(result.Resolution);

      if (modeIndex !== -1) setCurrentModeIndexDisplay(modeIndex);
      if (resolutionIndex !== -1) setCurrentModeIndexResolution(resolutionIndex);
    }
  };
  const handleDisplayPrevious = () => {
      setCurrentModeIndexDisplay((prevIndex) =>
        prevIndex === 0 ? modes.length - 1 : prevIndex - 1
      );
    };
  const handleResolutionPrevious = () => {
      setCurrentModeIndexResolution((prevIndex) =>
        prevIndex === 0 ? resolutions.length - 1 : prevIndex - 1
      );
    };
  const handleDisplayNext = () => {
      setCurrentModeIndexDisplay((prevIndex) =>
        prevIndex === modes.length - 1 ? 0 : prevIndex + 1
      );
    };
  const handleResolutionNext = () => {
      setCurrentModeIndexResolution((prevIndex) =>
        prevIndex === resolutions.length - 1 ? 0 : prevIndex + 1
      );
    };

  setSetting();
  return (

      <div className={styles.settingscontainer}>
        <div className={styles.settingscontent}>
          <div className={styles.settingdisplay}>

            <label>Display Mode</label>
            <button className={styles.arrowbutton} onClick={handleDisplayPrevious}><img src={ArrowLeft}
                                                                                        alt="Arrow Left"/></button>
            <div className={styles.value}>{modes[currentModeIndexDisplay]}</div>
            <button className={styles.arrowbutton} onClick={handleDisplayNext}><img src={ArrowRight} alt="Arrow Right"/>
            </button>
          </div>
          <div className={styles.settingdisplay}>
            <label>Resolution</label>
            <button className={styles.arrowbutton} onClick={handleResolutionPrevious}><img src={ArrowLeft}
                                                                                           alt="Arrow Left"/></button>
            <div className={styles.value}>{resolutions[currentModeIndexResolution]}</div>
            <button className={styles.arrowbutton} onClick={handleResolutionNext}><img src={ArrowRight}
                                                                                       alt="Arrow Right"/></button>
          </div>
          <div className={styles.settingdisplay}>
            <label>Graphic Quality</label>
            <div className={styles.qualityoptions}>
              <button className={`${styles.qualitybuttonleft} ${activeTab === 'Low' ? styles.active : ''}`}
                      onClick={() => setActiveTab('Low')}> Low
              </button>
              <button className={`${styles.qualitybutton} ${activeTab === 'Med' ? styles.active : ''}`}
                      onClick={() => setActiveTab('Med')}> Med
              </button>
              <button className={`${styles.qualitybutton} ${activeTab === 'High' ? styles.active : ''}`}
                      onClick={() => setActiveTab('High')}> High
              </button>
              <button className={`${styles.qualitybuttonright} ${activeTab === 'Ultra' ? styles.active : ''}`}
                      onClick={() => setActiveTab('Ultra')}> Ultra
              </button>
            </div>
          </div>
          {/*<div className={styles.settingdisplay}>*/}
          {/*  <label>Brightness</label>*/}
          {/*  <input type="range" min="0" max="100" className={styles.slider} id="myRange"  value={sliderValue}*/}
          {/*         onChange={handleSliderChange}*/}
          {/*         style={{*/}
          {/*           background: `linear-gradient(to right,#A52A2A ${sliderValue}%, #808080 ${sliderValue}%)`,*/}
          {/*         }}/>*/}
          {/*</div>*/}
          {/*<div className={styles.settingdisplay}>*/}
          {/*  <label>Motion Blur</label>*/}

          {/*  <button className={styles.arrowbutton}><img src={ArrowLeft} alt="Arrow Left"/></button>*/}
          {/*  <div className={styles.value}>No</div>*/}
          {/*  <button className={styles.arrowbutton}><img src={ArrowRight} alt="Arrow Right"/></button>*/}

          {/*</div>*/}
          <div className={styles.buttonscontainer}>
            <button className={styles.savebutton} onClick={openModalSave}>Save Change</button>
            <PopupSave isOpen={isModalOpenSave}></PopupSave>

            <button className={styles.resetbutton} onClick={openModalReset}>Reset to Default</button>
            <PopupReset isOpen={isModalOpenReset} onClose={closeModalReset} Settings={'Graphics'}></PopupReset>

            <button className={styles.backbutton} onClick={openModalBack}>Back to Home</button>
            <PopupBack isOpen={isModalOpenBack} onClose={closeModalBack} Settings={{
              displayMode: selectedDisplayMode,
              resolution: selectedResolution,
              quality: selectedQuality
            }}></PopupBack>
          </div>
        </div>
      </div>
  )
}
