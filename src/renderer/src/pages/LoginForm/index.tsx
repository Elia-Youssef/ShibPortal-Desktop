import {useLocation} from 'react-router-dom';
import LoginPopUp from "../../components/LoginPopUp";
import SubLoginPopUpConnect from "../../components/subLoginPopUpConnect";
import SubLoginPopUpEmail from "../../components/subLoginPopUpEmail";
import SubLoggingin from "../../components/subLoggingin";
import SubLogginginNew from "../../components/subLogginginNew";
import Login from "../Login";

export default function LoginForm() {
  const location = useLocation();
  const {isEmail, email, isWallet, islogged, Data} = location.state || {};
  if (!islogged && !isEmail && !isWallet) {
    sessionStorage.clear();
    localStorage.clear();
  }
  return (
    <>
      <div>
        {islogged ? (
          !Data.data.isNewUser ? (
            <LoginPopUp title={"Welcome Back!"}>
              <SubLoggingin Data={Data}/>
            </LoginPopUp>) : (
            <LoginPopUp title={"Welcome to Shib Launcher"}>
               <SubLogginginNew isvalid={true} isemail={isEmail} email={email} />
            </LoginPopUp>
          )
        ) : (
          isEmail ? (
              !email ? (
                <LoginPopUp title={"Login / Join"}>
                  <SubLoginPopUpConnect isvalid={false} iserror={false}/>
                </LoginPopUp>
              ) : (
                <LoginPopUp title={"Check Your Email"}>
                  <SubLoginPopUpEmail Email={email}/>
                </LoginPopUp>
              )
            ) :
            isWallet ? (
              <LoginPopUp title={"Connect a Wallet"}>
                {/*<SubLoginPopUpWallet isvalid ={true} iserror = {false}/>*/}
                <Login/>
              </LoginPopUp>
            ) : (
              <LoginPopUp title={"Login / Join"}>
                <SubLoginPopUpConnect isvalid={true} iserror={false}/>
              </LoginPopUp>
            )
        )
        }
      </div>
    </>
  )
    ;
}
