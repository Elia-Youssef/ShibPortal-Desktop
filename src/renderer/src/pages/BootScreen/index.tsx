import styles from './styles.module.css'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Image from '../../assets/preloader.png';
import SpinnerImageSpinner from '../../assets/Prelaoderspinner.png';
import packageJson from '../../../../../package.json';

export default function BootScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    CheckUpdate();
  }, [navigate]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.preloader} style={{backgroundImage: `url(${SpinnerImageSpinner})`}}/>
        <img src={Image} className={styles.Image}/>
        <div className={styles.preloader}></div>
      </div>
    </>
  )

  async function CheckUpdate() {
    const appVersion = packageJson.version;
    const result = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/SL/CHECKUPDATE?version=${appVersion}`,
    });

    if (result.ok) {
      if (result.data.Success) {
        navigate("/PopupUpdate");
        return;
      }
    }

    // if no update, check the token & etc..
    initializeApp();
  }

  async function initializeApp() {
    const {Token: token} = await window.ShibAPI.GetToken();
    const {Udata: Udata} = await window.ShibAPI.GetUserData();

    window.ShibAPI.GetLocationPath();

    if (Udata) {
      localStorage.setItem("user", JSON.stringify(Udata));
    }
    localStorage.setItem("token", token)

    if (token && token !== "undefined" && token.trim() !== "") {
      const decoded = decodeToken(token);

      // const ExpiryDate = new Date(decoded.exp * 1000);
      const decodedExp = new Date(decoded.exp * 1000);

      function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

      const ExpiryDate = addDays(decodedExp, -3);
      if (ExpiryDate < new Date()) {
        sessionStorage.clear();
        localStorage.clear();
        navigate("/login");
      } else {
        navigate("/home");
      }
    } else {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/login");
    }
  }

  function decodeToken(token) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
