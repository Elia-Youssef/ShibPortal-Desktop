import styles from "./styles.module.css"
export default function PopupUpdate() {

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay}>
        <div className={styles.settingscontent}>
          <label> New Release!</label>
        </div>
        <div className={styles.settingdisplay}>
          <div>A new Version is OUT, Please download it via the link below</div>
        </div>
        <div className={styles.buttonscontainer}>
          <button
            className={styles.savebutton}
            onClick={() => window.open('https://download.shibthemetaverse.io/shibportal-latest-setup.exe', '_blank')}
          >
           Update
          </button>
        </div>
      </div>
    </div>
  )

}
