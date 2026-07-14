import {useEffect, useState} from "react";
import config from "../../../../../config/config.json";
import {useNavigate} from "react-router-dom";
import styles from "./styles.module.css"
import Logo from "../../assets/ShibPortalBigLogo.png"

const LOGIN_URL = config[config.environment].frontend + "/login"

export default function Login() {
  const navigate = useNavigate();
  const [waitingForBrowser, setWaitingForBrowser] = useState<boolean>(false);

  useEffect(() => {
    window.ShibAPI.onLogin((token, user) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home")
    })
  }, [])

  return (
    <div className={styles.container}>
      <div
        className={styles.logo}
        style={{backgroundImage: `url(${Logo})`}}
      />

      <div style={{position: "relative", width: "100%"}}>
        {waitingForBrowser ?
          <div className={styles.waitingContainer}>
            <div className={styles.waitingText}>Continue login with Browser...</div>
            <button
              className={styles.cancelButton}
              onClick={() => setWaitingForBrowser(false)}
            >
              Cancel
            </button>
          </div>
          :
          <div>
            <button
              className={styles.loginButton}
              disabled={waitingForBrowser}
              onClick={onLogin}
            >
              Login with Browser
            </button>
          </div>
        }
      </div>
    </div>
  )

  function onLogin() {
    setWaitingForBrowser(true);
    window.open(LOGIN_URL, "_blank");
  }
}
