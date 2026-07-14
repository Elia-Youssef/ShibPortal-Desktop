import styles from "./styles.module.css"
// import Image from '../../assets/Shytoshi.png';
import editImage from "../../assets/pencil-square.png";
import { useNavigate} from "react-router-dom";
import { useState,useEffect  } from 'react';
import {useShibAuth} from "@shibaone/shib-auth-sdk";
export default function subProfile() {
  title: String;
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();
  const {logoutUser } = useShibAuth()
  const userData = localStorage.getItem("user");
  // let  token = "";
  let email = "";
  if (userData) {
    const userObject = JSON.parse(userData);
     email = userObject.Email;
     // token = userObject.Token;
  }

  useEffect(() => {
  const Validate = async () => {
    const Result = await window.ShibAPI.GetToken();
    const res = await window.ShibAPI.Fetch({
      method: "get",
      api: "/api/USER/SHOWUSERINFO?Token=" + Result.Token,
    })
    if (res.ok) {
      setUsername(res.data.User.UserName);
      setUserId(res.data.User.Id);
    }
  };
    Validate()
  },[]);
    const FillUserName = async () => {
      const result = await window.ShibAPI.Fetch({
        method: "post",
        api: "/api/USER/FILLUSERINFO",
        body: {
          userInfo: [{
            id: userId,
            userName: username,
            email: email,
            createdOn:  new Date().toISOString()
          }]
        },
        // tokenkey: localStorage.getItem("token")
      })
      if (result.ok) {
        let Token = result.data.Token ?? "";
        window.ShibAPI.SetToken(Token);

        updateUserName(username,Token)
      }
    };
  const updateUserName = (newUserName,Token) => {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    if (userData) {
      userData.UserName = newUserName;
      userData.Token = Token;
      const updatedUserDataString = JSON.stringify(userData);
      localStorage.setItem('user', updatedUserDataString);
      localStorage.setItem('token', Token);
      navigate("/Profile",  {state: { title: "My Account" }});
      setIsEditable((prev) => !prev);
    }
  };
  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };
  const Logout =  () => {
    sessionStorage.clear();
    localStorage.clear();
    window.ShibAPI.SetToken("")
    logoutUser();
    navigate("/");
  };
  return (
    <div className={styles.profilecard}>
      {/*<div className={styles.profilepicture}>*/}
      {/*  <img src={Image} alt="Profile Picture"/>*/}
      {/*  <button  className={styles.editbutton} onClick={()=>navigate("/Home")}>Edit</button>*/}
      {/*</div>*/}

      <div className={styles.usernamecontainer}>
        <label>Username: </label>
        <input type="text" id="username" value={username}  disabled={!isEditable} onChange={handleUserNameChange}/>
        {isEditable?(
        <button className={styles.editicondisable}>
        <img src={editImage} alt="edit image disabled"/>
        </button>
        ):(
        <button className={styles.editicon} onClick={handleEditClick}>
        <img src={editImage} alt="edit image"/>
        </button>
        )}

      </div>
      <button className={styles.savebutton} onClick={FillUserName}>Save Changes</button>
      <button className={styles.logoutbutton} onClick={Logout}>Log Out</button>
      <button className={styles.backbutton} onClick={() =>navigate("/Home")}>Back to Home</button>
    </div>
  )
}
