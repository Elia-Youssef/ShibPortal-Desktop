import styles from "./styles.module.css"
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function subLogginginNew({isvalid, isemail, email}: { isvalid: boolean; isemail: boolean; email: string }) {
  const [username, setUsername] = useState('');
  const [userAvailability, setUserAvailability] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const handleusernameChange = (e) => {
    setUsername(e.target.value);
  };

  const checkUsernameAvailability = async () => {
    if (!username.trim()) {
      setUserAvailability("Please fill the username.");
      setIsAvailable(false);
      return;
    }
    setIsChecking(true);
    const {data } = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/USER/CheckUsername?username=${username}`,
      //body: { params: [{ username: username }] },
    });
    if (data) {
      const { available, message } = data;

      // Check the 'available' property
      if (available) {
        setIsAvailable(true);
        setUserAvailability(""); // Clear any error messages
      } else {
        setIsAvailable(false);
        setUserAvailability(message); // Display the error message from the API
      }
    } else {
      // Handle the error case
      setIsAvailable(false);
      setUserAvailability("Failed to check username availability.");
    }
    setIsChecking(false);
  };

// useEffect to check username availability on each keystroke
  useEffect(() => {
    if (username) {
      const debounceTimeout = setTimeout(() => {
        checkUsernameAvailability();
      }, 300); // 300ms debounce time

      // Cleanup function to clear the timeout if the user is still typing
      return () => clearTimeout(debounceTimeout);
    } else {
      setIsAvailable(false);
      setUserAvailability("");
      return
    }
  }, [username]);

  async function SignUp() {
    if (isemail == true)
    {
      const {ok, data} = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/SIGNUPEMAIL",
        body: { params: [{ email:email, name: username }] }
      })

      if (ok) {
        localStorage.setItem("token", data.token)
        window.ShibAPI.SetToken(data.token);
        localStorage.setItem("user", JSON.stringify(data))
        navigate("/home")
      }
    }
    else
    {
      const {ok, data} = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/SIGNUP",
        body: { params: [{ walletAddress: window.userAddress, name: username }] }
      })

      if (ok) {
        localStorage.setItem("token", data.token)
        window.ShibAPI.SetToken(data.token);
        localStorage.setItem("user", JSON.stringify(data))
        navigate("/home")
      }
    }

  }

  return (
    <div className={styles.subcontainer}>

      <label className={styles.label}>Set up your profile to continue</label>
      <label className={styles.label2}>What should we call you?</label>

      <input
        type="text"
        id="Name"
        placeholder="Enter your username"
        className={`${styles.usernameinput} ${
          isAvailable ? styles.validInput : styles.invalidInput
        }`}
        value={username}
        onChange={handleusernameChange}
      />
      {/* Availability message */}
      {!isAvailable && (
        <label className={styles.notvalidlabel}>{userAvailability}</label>
      )}
      {isAvailable && username && (
        <label className={styles.validlabel}>This username is available!</label>
      )}


      {!isvalid ? (
        <label className={styles.notvalidlabel}>this username is available to use!</label>
      ) : null}
      {/*{useravailability && (*/}
      {/*  <label className={styles.notvalidlabel}>*/}
      {/*    {useravailability === "Name Already Used."*/}
      {/*      ? "Name Already Used."*/}
      {/*      : useravailability === "Please fill the username."*/}
      {/*        ? "Please fill the username."*/}
      {/*        : null}*/}
      {/*  </label>*/}
      {/*)}*/}
      {/*<label className={styles.label3}>.Using only letters and numbers-noprofanity, symbols or spaces allowed</label>*/}
      {/*<label className={styles.label3}>.You can change your username later in settings</label>*/}
      <label className={styles.label3}>• Using only letters and numbers-noprofanity, symbols or spaces allowed</label>
      <label className={styles.label3}>• You can change your username later in settings</label>

      <button className={styles.continuebutton} onClick={SignUp} disabled={!isAvailable || isChecking}
      >
        {isChecking ? "Checking..." : "Continue"}
      </button>


      <div className={styles.footer}>
        <a href="#" className={styles.termslink}>Terms of use</a>
        <span className={styles.divider}>|</span>
        <a href="#" className={styles.privacylink}>Privacy policy</a>
      </div>
    </div>
  );
};
