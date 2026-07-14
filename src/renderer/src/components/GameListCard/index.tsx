import styles from "./styles.module.css"
import TitleIcon from "../../assets/GameListTitleIcon.png"

export default function GameListCard({image, title, description, released, onClick}: {
  image: string,
  title: string,
  description: string,
  released: boolean,
  onClick: () => void
}) {

  return (

    <div
      className={`${styles.container} ${!released ? styles.disabled : ''}`}
      onClick={released ? onClick : undefined}
    >

      {/*<div className={styles.image} style={{backgroundImage: `url(${image})`}}>*/}
      {/*  {!released && (*/}
      {/*    <div className={styles.overlay}>*/}
      {/*      <p className={styles.overlayText}>Coming Soon</p>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
      <div
        className={styles.image}
        style={{backgroundImage: `url(${image})`}}>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.titleContainer}>
          <div
            className={styles.titleLogo}
            style={{backgroundImage: `url(${TitleIcon})`}}
          />
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};
