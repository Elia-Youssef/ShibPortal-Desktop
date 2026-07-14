import styles from "./styles.module.css"
import HeaderLogo from "../../assets/HeaderLogo.png"
import {useNavigate} from "react-router-dom";
export default function HeaderProfile() {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.detailsBackground}/>
      <div className={styles.imageBackground}/>

      <div className={styles.profile} style={{backgroundImage: `url(${HeaderLogo})`}} onClick={() => navigate("/Profile" ,  {state: { title: "My Account" }})}/>

      <div className={styles.detailsContainer}>
        <div className={styles.username} onClick={() => navigate("/Profile" ,  {state: { title: "My Account" }})}>
          {userData?.UserName}
        </div>

        <div className={styles.onlineStatus}>
          <div className={styles.onlineLogo} />
          <div className={styles.onlineText}>
            Online
          </div>
        </div>
      </div>
    </div>
  )
}
