import styles from "./styles.module.css"
import {useEffect, useState} from "react";
import PopupSave from '../PopupSave';
import PopupReset from '../PopupReset';
import PopupBack from '../PopupBack';

 declare module "react" {
  interface  HTMLAttributes<T> {
    webkitdirectory?: string;
  }
 }
export default function subSettingsLocation() {
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  const [isModalOpenBack, setIsModalOpenBack] = useState(false);
  const [isModalOpenReset, setIsModalOpenReset] = useState(false);
  const [folderPath, setFolderPath] = useState("enter a location");

  useEffect(() => {
    GetLocation();
  }, []);
  const openModalSave = () => {
    setIsModalOpenSave(true);
   SetLocation();
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
  const handleFolderSelection = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const pathSegments = files[0].path.split("\\");
      const allButLast = pathSegments.slice(0, -1);
      const folderPath = allButLast.join("\\");
      setFolderPath(folderPath);
    }
  };
  const handleBrowseClick = async () => {
    const selectedFolderPath = await window.ShibAPI.selectFolder();
    if (selectedFolderPath) {
      setFolderPath(selectedFolderPath);
    }
  };
  const SetLocation = async () => {
    window.ShibAPI.SetLocationPath(folderPath);
  };
  const GetLocation = async () => {
    const result = await window.ShibAPI.GetLocationPath();
    if (result) {
      setFolderPath(result.location);
    }
  };
  return (

    <div className={styles.settingscontainer}>

      <div className={styles.settingscontent}>
        <label> Choose Install Location</label>
      </div>
      <div className={styles.settingdisplay}>
        <div>Folder:</div>
        <div className={styles.locationdisplay}>
          <input type="text" id="folder" value={folderPath}/>
          <button className={styles.browsebutton} onClick={handleBrowseClick}>
            Browse
          </button>
          <input
            type="file" id="folderInput" style={{display: "none"}} webkitdirectory="true" onChange={handleFolderSelection}/>
        </div>
      </div>
      <div className={styles.buttonscontainer}>
        <button className={styles.savebutton} onClick={openModalSave}>Save Change</button>
        <PopupSave isOpen={isModalOpenSave}></PopupSave>

        <button className={styles.resetbutton} onClick={openModalReset}>Reset to Default</button>
        <PopupReset isOpen={isModalOpenReset} onClose={closeModalReset} Settings={'Location'}></PopupReset>

        <button className={styles.backbutton} onClick={openModalBack}>Back to Home</button>
        <PopupBack isOpen={isModalOpenBack} onClose={closeModalBack} Settings={{folderPath: folderPath}}></PopupBack>
      </div>

    </div>
  )
}
