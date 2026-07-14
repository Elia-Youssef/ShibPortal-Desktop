import styles from "./styles.module.css"
import Image from '../../assets/Vector 27.png';
import {useNavigate} from "react-router-dom";
import  { useState,useEffect  } from 'react';
import {useShibAuth} from "@shibaone/shib-auth-sdk";
import {useConnectModal} from "@rainbow-me/rainbowkit";


export default function subLoginPopUpConnect({isvalid, iserror}) {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const { user } = useShibAuth()
  const { openConnectModal } = useConnectModal()
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleEmailValidation = async () => {
    const res = await window.ShibAPI.Fetch({
      method: "post",
      api: `/api/USER/SENDCODE?email=${email.toLowerCase()}`,
    })
    if (res.ok) {
      navigate("/LoginForm", {state: {isEmail: true, email: email}});
    }
  }

  useEffect(() => {
    localStorage.clear();
    window.result = 'undefined'
    window.userAddress = user?.address

    if (user?.address) {
      LoginOrSignUp()
      console.log('user: ', user)
    }
  }, [user])



  return (
    <div className={styles.subcontainer}>
      <label className={styles.emaillabel} htmlFor="email">Email</label>
      <input type="email" id="email" placeholder="hello@example.com" className={styles.emailinput} value={email}
             onChange={handleEmailChange}/>
      {!isvalid ? (
        <label className={styles.notvalidlabel}>Please enter a valid email address</label>
      ) : null}
      <button className={styles.emailbutton}
              onClick={handleEmailValidation}>Continue with Email
               {/*onClick={() => navigate("/LoginForm", {state: {isEmail: true, email: email}})}>Continue with Email*/}
      </button>
      {iserror ? (
        <label className={styles.notvalidlabel}>An error has occured.Please try again.</label>
      ) : null}
      <div className={styles.separator}>
        <div className={styles.line}>
          <img src={Image} className={styles.rotatedImage}/>
        </div>
        <div className={styles.ortext}>Or</div>
        <div className={styles.line}>
          <img src={Image}/>
        </div>
      </div>

      <button className={styles.walletbutton}
         onClick={openConnectModal}>
        Connect Wallet</button>

      <div className={styles.helpsection}>
        <a href="#" className={styles.helplink} onClick={TroubleButton}>Having trouble with login?</a>
      </div>

      <div className={styles.footer}>
        <a href="#" className={styles.termslink} onClick={TermsButton}>Terms of use</a>
        <div className={styles.divider}>|</div>
        <a href="#" className={styles.privacylink} onClick={PolicyButton}>Privacy policy</a>
      </div>


</div>
  );

  async function LoginOrSignUp() {
    const {data} = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/USER/WALLETEXISTENCE?WalletAddress=${user?.address}`,
    })

    if (data?.Success) {
      const {ok, data} = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/LOGIN",
        body: {params: [{walletAddress: user?.address}]}
      })

      if (ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.Token)
        window.ShibAPI.SetToken(data.Token);
        navigate("/home")

      }
    } else {
      navigate("/LoginForm", {state: {islogged: true, Data: {data: {isNewUser: true}}}})

    }
  }
  function TroubleButton() {
      window.open('https://docs.shib.io', '_blank');
  }
  function TermsButton() {
    window.open('https://www.shibthemetaverse.io/terms-of-use', '_blank');
  }
  function PolicyButton() {
    window.open('https://www.shibthemetaverse.io/privacy-policy', '_blank');
  }
};
