import styles from "./styles.module.css"
import SubSettingsGraphics from "../subSettingsGraphics";
import SubSettingsAudio from "../subSettingsAudio";
import SubSettingsLocation from "../subSettingsLocation";
import {useState} from "react";
// import GraphicsImage from "../../assets/Graphics.png";
// import AudioImage from "../../assets/musicnote.png";
import LocationImage from "../../assets/locationmarker.png";
export default function subSettings() {

    const [activeTab, setActiveTab] = useState('Install Location');

  return (
    <div className={styles.subprofilecontainer}>

      <div className={styles.sidebar}>
        <ul>
          {/*<li*/}
          {/*  className={activeTab === 'Graphics' ? styles.active : ''}*/}
          {/*  onClick={() => setActiveTab('Graphics')}>*/}
          {/*  <img src={GraphicsImage} alt="Graphics Icon"/>*/}
          {/*  Graphics*/}
          {/*</li>*/}
          {/*<li*/}
          {/*  className={activeTab === 'Audio' ? styles.active : ''}*/}
          {/*  onClick={() => setActiveTab('Audio')}>*/}
          {/*  <img src={AudioImage} alt="Audio Icon"/>*/}
          {/*  Audio*/}
          {/*</li>*/}
          <li
            className={activeTab === 'Install Location' ? styles.active : ''}
            onClick={() => setActiveTab('Install Location')}>
            <img src={LocationImage} alt="Loaction Icon"/>
            Install Location
          </li>
        </ul>
      </div>
      <div className="settingscontent">
        {activeTab === 'Graphics' && (
          <div>
            <div className={styles.containerlabel}>Graphics settings will apply to all games downloaded from the launcher. Not applicable to web-based
              games.</div>
            <SubSettingsGraphics/>
          </div>
        )}
        {activeTab === 'Audio' && (
          <div>
            <div className={styles.containerlabel}>Audio settings will apply to all games downloaded from the launcher. Not applicable to web-based games</div>
            <SubSettingsAudio/>
          </div>
        )}
        {activeTab === 'Install Location' && (
          <div>
            <div className={styles.containerlabel}>All game files will be stored in your chosen folder.</div>
            <SubSettingsLocation/>
          </div>
        )}
      </div>
    </div>

  )
}
