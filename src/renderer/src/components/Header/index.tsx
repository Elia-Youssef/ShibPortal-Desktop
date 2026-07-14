import styles from "./styles.module.css"
import HeaderProfile from "../HeaderProfile";
import HeaderLogo from "../../assets/HeaderLogo.png"
import SettingsLogo from "../../assets/SettingsButton.png"
import {useNavigate} from "react-router-dom";
// import {useState} from "react";

export default function Header({currentPage, showBackButton}: { currentPage: number, showBackButton: boolean }) {
  // const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.column} style={{gap: 80}}>
        {showBackButton ?
          <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>
          :
          <div className={styles.logo} style={{backgroundImage: `url(${HeaderLogo})`}}/>
        }

        <div className={styles.tabsContainer}>
          <div className={`${styles.tab} ${currentPage == 0 ? styles.tabHighlight : ""}`}
               onClick={() => navigate("/home")}>
            Home
          </div>

          <div className={`${styles.tab} ${currentPage == 1 ? styles.tabHighlight : ""}`}
               onClick={() => navigate("/library")}>
            My Collections
          </div>
        </div>
      </div>

      <div className={styles.column}>
        <HeaderProfile/>
        <div
          className={styles.settingsLogo}
          style={{backgroundImage: `url(${SettingsLogo})`}}
          onClick={() => navigate("/Profile" ,  {state: { title: "Global Game Settings" }})}/>

      </div>
    </div>
  );
};
