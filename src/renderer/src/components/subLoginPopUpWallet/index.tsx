import styles from "./styles.module.css"
import {useNavigate} from "react-router-dom";
import ImageCoinBase from '../../assets/CoinBase.png';
import ImageMetamask from '../../assets/Metamask.png';
import ImageRabby from '../../assets/Rabby.png';
import ImageRainbow from '../../assets/Rainbow.png';
import ImageWalletConnect from '../../assets/WalletConnect.png';

export default function subLoginPopUpWallet() {


  const navigate = useNavigate();
  // const WalletAddress = "0x123123123123123ABC"

    const Validate = async () => {
      const res = await window.ShibAPI.Fetch({
        method: "get",
        api: "/api/USER/WALLETEXISTENCE?WalletAddress=0x123123123123123ABC",
      })
      if (res.data.Success) {
        const resdata = await window.ShibAPI.Fetch({
          method: "post",
          api: "/api/USER/LOGIN",
          body: {
            params: [{
              walletAddress: "0x123123123123123ABC"
            }]
          }
        })
        navigate("/LoginForm", { state: { islogged : true,Data:resdata}})
      }
      else {
        const resdata = await window.ShibAPI.Fetch({
          method: "post",
          api: "/api/USER/SIGNUP",
          body: {
            params: [{
              walletAddress: "0x123123123123123ABC"
            }]
          }
        })
        navigate("/LoginForm", { state: { islogged : true,Data:resdata}})
      }
  }
  const ValidateNewUser = async () => {
    const res = await window.ShibAPI.Fetch({
      method: "get",
      api: "/api/USER/WALLETEXISTENCE?WalletAddress=0x123123123123123ABC111",
    })

    if (res.data.Success) {
      const resdata = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/LOGIN",
        body: {
          params: [{
            walletAddress: "0x123123123123123ABC111"
          }]
        }
      })
      navigate("/LoginForm", { state: { islogged : true,Data:resdata}})
    }
    else {
      const resdata = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/SIGNUP",
        body: {
          params: [{
            walletAddress: "0x123123123123123ABC111",
            name: "shahoud"
          }]
        }
      })
      navigate("/LoginForm", { state: { islogged : true,Data:resdata}})
    }
  }


  return (
    <div className={styles.subcontainer}>
      <button className={styles.imageButton} onClick={ValidateNewUser}>
        <img src={ImageCoinBase} className={styles.rotatedImage}/>
      </button>
      <button className={styles.imageButton} onClick={Validate}>
        <img src={ImageMetamask} className={styles.rotatedImage}/>
      </button>

      <button className={styles.imageButton}>
        <img src={ImageWalletConnect} className={styles.rotatedImage}/>
      </button>

      <button className={styles.imageButton}>
        <img src={ImageRabby} className={styles.rotatedImage}/>
      </button>

      <button className={styles.imageButton}>
        <img src={ImageRainbow} className={styles.rotatedImage}/>
      </button>


      <button className={styles.backbutton} onClick={() => navigate("/LoginForm", {state: {isEmail: false}})}>Back
      </button>
    </div>
  );
};
