import styles from "./styles.module.css"
import SpinnerImageSpinner from '../../assets/Prelaoderspinner.png';
import Image from '../../assets/Shytoshi.png';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
export default function subLoggingin({ Data }) {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
    navigate("/Home");
    }, 3500);
  }, [])

  return (
    <div className={styles.subcontainer}>
      <div>
        <img src={Image} className={styles.Image}/>
      </div>
      <div className={styles.label}>{Data.data.UserName}</div>
      <div className={styles.subcontainerloader}>
      <div className={styles.preloader} style={{backgroundImage: `url(${SpinnerImageSpinner})`}}/>
      <div className={styles.labelloader}>Logging in...</div>
      </div>
    </div>
  );
};
