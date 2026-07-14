import styles from "./styles.module.css"
// import SettingsIcon from "../../assets/SettingsIcon.png"

export default function LibraryListCard({image, title,description, size, onClick}: {
  image: string,
  title: string,
  description: string;
  size: string,
  onClick: () => void
}) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.image} style={{backgroundImage: `url(${image})`}}/>

      <div className={styles.detailsContainer}>
        <div className={styles.title}>
          {title}
        </div>

        <div className={styles.description}>{size}</div>

        <div className={styles.description}>
          {description}
        </div>
      </div>

      <div className={`${styles.detailsContainer} ${styles.actionsContainer}`}>
        {/*<div className={styles.settingsLogo} style={{backgroundImage: `url(${SettingsIcon})`}}/>*/}
      </div>
    </div>
  );
};
