import styles from "./styles.module.css"
import {ReactNode} from "react";
import Header from "../Header";

export default function Wrapper({currentPage, showBackButton = false, children}: { currentPage: number, showBackButton?: boolean, children: ReactNode }) {
  return (
    <div className={styles.container}>
      <Header currentPage={currentPage} showBackButton={showBackButton} />
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
};
