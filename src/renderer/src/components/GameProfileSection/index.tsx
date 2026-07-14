import styles from "./styles.module.css";
import DownloadSection from "../DownloadSection";

export default function GameProfileSection({ gameData }: { gameData: any }) {
  return (
    <div className={styles.container}>
      <div className={styles.banner} style={{ backgroundImage: `url(${gameData?.CoverPicture?.Image || ""})` }} />

      <div className={styles.detailsContainer}>
        <div className={styles.profileDetails}>
          <div className={styles.profile} style={{backgroundImage: `url(${gameData?.ProfilePicture?.Image || ""})`}}/>

          <div className={styles.detailsColumn}>
            <div className={styles.title}>{gameData?.DisplayTitle || ""}</div>
            <div className={styles.description}>{gameData?.Description || ""}</div>

            <div className={styles.details}>
              <div className={styles.detailsRow}>
                <div><span className={styles.detailHighlight}>Developed by </span>{gameData?.DevelopedBy}</div>
                <div>
                  {gameData?.ReleaseDate == null ?
                    <span className={styles.detailHighlight}>Coming Soon</span> :
                    <span className={styles.detailHighlight}>Release Date: </span>
                  }
                  {gameData?.ReleaseDate &&
                    // new Date(gameData.ReleaseDate).toISOString().slice(0, 10).replace(/-/g, '/')
                    new Date(gameData.ReleaseDate).toLocaleDateString('en-CA').replace(/-/g, '/')

                  }
                </div>
              </div>
              <div className={styles.detailsRow}>
                <div><span className={styles.detailHighlight}></span>{gameData?.Genre}</div>
                <div>
                  {gameData?.LatestUpdate == null ?
                    <span className={styles.detailHighlight}></span> :
                    <span className={styles.detailHighlight}>Latest Update: </span>
                  }
                  {gameData?.LatestUpdate &&
                    // new Date(gameData.LatestUpdate).toISOString().slice(0, 10).replace(/-/g, '/')
                    new Date(gameData.LatestUpdate).toLocaleDateString('en-CA').replace(/-/g, '/')
                  }
                </div>

              </div>
            </div>
          </div>
        </div>

        <DownloadSection gameId={gameData?.Id} gameTitle={gameData?.Title} version={gameData?.GameVersion?.version}
                         size={gameData?.GameVersion?.DownloadableSize} ispixelstream={gameData?.isPixelStream}/>

        {/*{ gameData?.isPixelStream ?*/}
        {/*<button className={styles.playButton} onClick={openPixelStreaming}>*/}
        {/*  Play on Browser*/}
        {/*</button>*/}
        {/*  : <></>*/}
        {/*}*/}
      </div>
    </div>
  );

  // function openPixelStreaming() {
  //   window.ShibAPI.OpenPS()
  // }
};
