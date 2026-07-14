
import styles from "./styles.module.css"

export default function LoginPopUp({title, children}:{title: string, children: JSX.Element}) {
  return (
    <div className={styles.Maincontainer}>
      <div className={styles.Mainbox}>
        <h2 className={styles.Maintitle}>{title}</h2>
        <div className={styles.SubContainerWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};
