import styles from "./styles.module.css"
import {ReactNode} from "react";

export default function ViewGameSection({title, hideBorder = false, children}: {
  title: string,
  hideBorder?: boolean,
  children: ReactNode
}) {
  return (
    <div className={styles.container} style={{
      padding: hideBorder ? 0 : "20px 40px 30px 40px",
      borderWidth: hideBorder ? 0 : 1
    }}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
