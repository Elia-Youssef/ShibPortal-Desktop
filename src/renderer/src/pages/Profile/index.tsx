import styles from "./styles.module.css"
 import Wrapper from "../../components/Wrapper";
import SubProfile from "../../components/subProfile";
import SubSettings from "../../components/subSettings";
import {useLocation} from 'react-router-dom';

export default function Profile() {
  const location = useLocation();
  const{title}= location.state || {};

  return (
     <Wrapper currentPage={0}>

       <div className={styles.accountcontainer}>
         <div className={styles.header}>{title}</div>
         <div className={styles.subProfileContainer}>
           {title === "My Account" ? <SubProfile /> : <SubSettings />}
         </div>
       </div>
     </Wrapper>
  )
}
