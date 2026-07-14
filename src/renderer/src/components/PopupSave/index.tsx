import styles from "./styles.module.css"
import {useNavigate} from "react-router-dom";
export default function PopupSave({ isOpen }) {
  const navigate = useNavigate();
    if (!isOpen) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay}>
        <div className={styles.settingscontent}>
          <label> Your Changes Have Been Saved!</label>
        </div>

        <div className={styles.buttonscontainer}>
          <button className={styles.savebutton} onClick={() =>navigate("/Home")}>Back to Home</button>
        </div>
      </div>
</div>
      )
      }
