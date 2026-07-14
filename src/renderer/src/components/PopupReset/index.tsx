import styles from "./styles.module.css"
import { useNavigate} from "react-router-dom";
export default function PopupReset({ isOpen, onClose, Settings }) {
  const navigate = useNavigate();
    if (!isOpen) return null;
  const resetSettings = async () => {
    if (Settings == "Graphics") {
      let selectedDisplayMode = "W";
      let selectedResolution = "1920x1080";
      let selectedQuality = 2;

      window.ShibAPI.SetSettingsGraphics(selectedDisplayMode, selectedResolution, selectedQuality);
    }
    else if (Settings == "Audio")
    {
      window.ShibAPI.SetSettingsAudio(30,30,30);
    }
    else if (Settings =="Location")
    {
      window.ShibAPI.SetLocationPath("C:/ShibLauncher");
    }
    navigate("/Home");

  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay}>
        <div className={styles.settingscontent}>
          <label> Reset to Default?</label>
        </div>
        <div className={styles.settingdisplay}>
          <div>All your custom changes will be lost Do you wish to continue?</div>
        </div>
        <div className={styles.buttonscontainer}>
          <button className={styles.savebutton} onClick={resetSettings}>Reset to Default</button>
          <button className={styles.resetbutton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
      )
      }
