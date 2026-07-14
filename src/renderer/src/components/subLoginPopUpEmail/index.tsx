import styles from "./styles.module.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useShibAuth} from "@shibaone/shib-auth-sdk";

export default function subLoginPopUpEmail({Email}) {
  Email : String;

  const navigate = useNavigate();
  const { user } = useShibAuth()
  const [code,setCode] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
   Email = Email.toLowerCase();
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  const handleEmailVerification = async () => {
    const res = await window.ShibAPI.Fetch({
      method: "post",
      api: `/api/USER/VERIFYCODE?Email=${Email}&Code=${code}`,
    })
    if (res.ok) {
      if (Email) {
        LoginOrSignUp()
        console.log('user: ', user)
      }
      // navigate("/LoginForm", {state: {islogged: true, isEmail: true,email:Email, Data: {data: {isNewUser: true}}}});
    }
  }

  const SendEmailValidation = async () => {
    const res = await window.ShibAPI.Fetch({
      method: "post",
      api: `/api/USER/SENDCODE?email=${Email.toLowerCase()}`,
    })
    if (res.ok) {
      setIsResendDisabled(true); // Disable the button
      setTimer(180);
      // navigate("/LoginForm", {state: {isEmail: true, email: Email}});
    }
  }
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false); // Re-enable the button when timer ends
    }
    return () => clearInterval(countdown); // Cleanup on unmount
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <div className={styles.subcontainer}>
      <label className={styles.label} htmlFor="email">We email a login verification code to {Email}.</label>


      <input
        className={`${styles.input} ${styles.code}`} value={code}
        maxLength={6} onChange={handleCodeChange}
      />
      <label className={styles.label} htmlFor="email">Enter the "Verification Code" in your email to sign in this code
        will
        expire in 3 minutes</label>
      <button className={styles.emailbutton} onClick={handleEmailVerification}>Confirm</button>

      {/*<button className={styles.walletbutton} onClick={SendEmailValidation}>Resend Email</button>*/}
      <button
        className={`${isResendDisabled ? styles.disabledButton : styles.walletbutton}`}
        onClick={SendEmailValidation}
        disabled={isResendDisabled}
      >
        {isResendDisabled ? `Resend Email (${formatTime(timer)})` : "Resend Email"}
      </button>

      <button className={styles.backbutton} onClick={() => navigate("/LoginForm", {state: {isEmail: false}})}>Back
      </button>
    </div>
  );

  async function LoginOrSignUp() {
    const {data} = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/USER/MAILEXISTENCE?Email=${Email}`,
    })

    if (data?.Success) {
      const {ok, data} = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/LOGINMAIL",
        body: {params: [{email: Email}]}
      })

      if (ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.Token)
        navigate("/home")

      }
    } else {
      navigate("/LoginForm", {state: {islogged: true, isEmail: true,email:Email, Data: {data: {isNewUser: true}}}});

    }
  }

};
