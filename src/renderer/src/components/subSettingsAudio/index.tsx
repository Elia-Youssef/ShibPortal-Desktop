import styles from "./styles.module.css"
// import ArrowLeft from "../../assets/ArrowLeftd.png";
// import ArrowRight from "../../assets/ArrowRight.png";
import SoundImage from "../../assets/Sound.png";
import MuteImage from "../../assets/Mute.png";
import {useEffect, useState} from "react";
import PopupSave from "@renderer/components/PopupSave";
import PopupReset from "@renderer/components/PopupReset";
import PopupBack from "@renderer/components/PopupBack";

export default function subSettingsAudio() {

  const [sliderValueMaster,setSliderValueMaster] = useState(30);
  const [sliderValueMusicS,setSliderValueMusicS] = useState(30);
  const [sliderValueSFX,setSliderValueSFX] = useState(30);
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  const [isModalOpenBack, setIsModalOpenBack] = useState(false);
  const [isModalOpenReset, setIsModalOpenReset] = useState(false);

  useEffect(() => {
    GetSettings();
  }, []);
  const openModalSave = () => {
    setIsModalOpenSave(true);
    setSettings();
  };
  const openModalReset= () => {
    setIsModalOpenReset(true);
  };
  const closeModalReset = () => {
    setIsModalOpenReset(false);
  };
  const openModalBack = () => {
    setIsModalOpenBack(true);
  };
  const closeModalBack = () => {
    setIsModalOpenBack(false);
  };
  const handleSliderChangeMaster = (event) => {
    setSliderValueMaster(event.target.value);
  };
  const muteSliderValueMaster = () => {
    setSliderValueMaster(0);
  };
  const maxSliderValueMaster = () => {
    setSliderValueMaster(100);
  };
  const handleSliderChangeMusicS = (event) => {
    setSliderValueMusicS(event.target.value);
  };
  const muteSliderValueMusicS = () => {
    setSliderValueMusicS(0);
  };
  const maxSliderValueMusicS = () => {
    setSliderValueMusicS(100);
  };
  const handleSliderChangeSFX = (event) => {
    setSliderValueSFX(event.target.value);
  };
  const muteSliderValueSFX = () => {
    setSliderValueSFX(0);
  };
  const maxSliderValueSFX = () => {
    setSliderValueSFX(100);
  };


  const setSettings = async () => {

    window.ShibAPI.SetSettingsAudio(sliderValueMaster,sliderValueMusicS,sliderValueSFX);
  }

  const GetSettings = async () => {
    const result = await window.ShibAPI.GetSettingsAudio();
    if (result) {
      setSliderValueMaster(result.Master);
      setSliderValueMusicS(result.Music);
      setSliderValueSFX(result.Sfx);
    }
  }


  return (

      <div className={styles.settingscontainer}>
        <div className={styles.settingscontent}>
          <div className={styles.settingdisplay}>
            <label>Master</label>
            <button className={styles.soundbutton} onClick={muteSliderValueMaster}><img src={MuteImage} alt="Mute"/></button>
            <input type="range" min="0" max="100" className={styles.slider} id="myRange" value={sliderValueMaster}
                   onChange={handleSliderChangeMaster}
                   style={{
                     background: `linear-gradient(to right,#A52A2A ${sliderValueMaster}%, #808080 ${sliderValueMaster}%)`,
                   }}/>
            <button className={styles.soundbutton} onClick={maxSliderValueMaster}><img src={SoundImage} alt="MAX"/></button>
          </div>
          <div className={styles.settingdisplay}>
            <label>Music Sound</label>
            <button className={styles.soundbutton} onClick={muteSliderValueMusicS}><img src={MuteImage} alt="Mute"/></button>
            <input type="range" min="0" max="100" className={styles.slider} id="myRange" value={sliderValueMusicS}
                   onChange={handleSliderChangeMusicS}
                   style={{
                     background: `linear-gradient(to right,#A52A2A ${sliderValueMusicS}%, #808080 ${sliderValueMusicS}%)`,
                   }}/>
            <button className={styles.soundbutton} onClick={maxSliderValueMusicS}><img src={SoundImage} alt="MAX"/></button>
          </div>
          <div className={styles.settingdisplay}>
            <label>SFX Sound</label>
            <button className={styles.soundbutton} onClick={muteSliderValueSFX}><img src={MuteImage} alt="Mute"/></button>
            <input type="range" min="0" max="100" className={styles.slider} id="myRange" value={sliderValueSFX}
                   onChange={handleSliderChangeSFX}
                   style={{
                     background: `linear-gradient(to right,#A52A2A ${sliderValueSFX}%, #808080 ${sliderValueSFX}%)`,
                   }}/>
            <button className={styles.soundbutton} onClick={maxSliderValueSFX}><img src={SoundImage} alt="MAX"/></button>
          </div>
          {/*<div className={styles.settingdisplay}>*/}
          {/*  <label>Audio Format</label>*/}
          {/*  <button className={styles.arrowbutton}><img src={ArrowLeft} alt="Arrow Left"/></button>*/}
          {/*  <div className={styles.value}>No</div>*/}
          {/*  <button className={styles.arrowbutton}><img src={ArrowRight} alt="Arrow Right"/></button>*/}
          {/*</div>*/}
          {/*<div className={styles.settingdisplay}>*/}
          {/*  <label>Output Type</label>*/}
          {/*  <button className={styles.arrowbutton}><img src={ArrowLeft} alt="Arrow Left"/></button>*/}
          {/*  <div className={styles.value}>No</div>*/}
          {/*  <button className={styles.arrowbutton}><img src={ArrowRight} alt="Arrow Right"/></button>*/}
          {/*</div>*/}
          <div className={styles.buttonscontainer}>
            <button className={styles.savebutton} onClick={openModalSave}>Save Change</button>
            <PopupSave isOpen={isModalOpenSave}></PopupSave>

            <button className={styles.resetbutton} onClick={openModalReset}>Reset to Default</button>
            <PopupReset isOpen={isModalOpenReset} onClose={closeModalReset} Settings={'Audio'}></PopupReset>

            <button className={styles.backbutton} onClick={openModalBack}>Back to Home</button>
            <PopupBack isOpen={isModalOpenBack} onClose={closeModalBack} Settings={{master:sliderValueMaster,music:sliderValueMusicS,sfx:sliderValueSFX}}></PopupBack>
          </div>
        </div>
      </div>
  )
}
