import styles from "./styles.module.css"
import {useNavigate} from "react-router-dom";

export default function PopupBack({ isOpen, onClose,Settings }) {
  const navigate = useNavigate();
    if (!isOpen) return null;

  const openModalSave = () => {
    setSettings()
    navigate("/Home");
  };
  const setSettings = async () => {
    window.ShibAPI.SetSettingsGraphics(Settings.displayMode,Settings.resolution,Settings.quality);
    window.ShibAPI.SetSettingsAudio(Settings.master,Settings.music,Settings.sfx);
    window.ShibAPI.SetLocationPath(Settings.folderPath);
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay}>
        <div className={styles.settingscontent}>
          <label> You Have Unsaved Changes!</label>
        </div>
        <div className={styles.settingdisplay}>
          <div>You've made changes that haven't been saved. Do you want to save them before existing?</div>
        </div>
        <div className={styles.buttonscontainer}>
          <button className={styles.savebutton} onClick={openModalSave}>Save and Back to Home</button>
          <button className={styles.resetbutton} onClick={()=>navigate('/Home')}>Leave Without Saving</button>
          <button className={styles.backbutton} onClick={onClose}>Cancel</button>
        </div>
      </div>
</div>
      )
      }
