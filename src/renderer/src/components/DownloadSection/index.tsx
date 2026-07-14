import styles from "./styles.module.css"
import WindowsIcon from "../../assets/WindowsIcon.png"
import MaintenanceIcon from "../../assets/ServerMaintenance.png"
import {useEffect, useState} from "react";
import SpinnerImageSpinner from '../../assets/Prelaoderspinner.png';
// import {Play} from "lucide-react";
type GameState =
  "NotInstalled"
  | "Downloading"
  | "Paused"
  | "Installing"
  | "Installed"
  | "PendingUpdate"
  | "ServerDown"
  | "Incomplete"
  | "Updating";

export default function DownloadSection({gameId,gameTitle, version, size, ispixelstream}: {
  gameId: any,
  gameTitle:any,
  version: any,
  size: any,
  ispixelstream: any
}) {
  const [gameState, setGameState] = useState<GameState>();
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [resumeDownload, setResumeDownload] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [UpdateV, SetUpdateV] = useState(false);
  const [loading, setLoading] = useState(false);
  const [PlayOnBrowser, setPlayOnBrowser] = useState(false);


  useEffect(() => {
    window.ShibAPI.onDownloadProgress(({progress, downloadSpeed}: { progress: number, downloadSpeed: number }) => {
      setProgress(progress);
      setSpeed(downloadSpeed);

      if (progress === 100) {
        // setGameState("Installed");
        setGameState("Installing");
      }
    });

    window.ShibAPI.onGameClose(() => {
      console.log("Game has closed.");
      setPlaying(false);
    });

    window.ShibAPI.onDownloadComplete((message: string) => {
      setGameState("Installed");
      console.log(message)
    });

    window.ShibAPI.onDownloadError((error: string) => {
      setGameState("NotInstalled")
      console.log(error)
    });
    CheckPlayOnBrowser();
     CheckUpdate();
    checkLocalData();
  }, [gameTitle]);
  const checkLocalData = async () => {
    // const {exists} = await window.ShibAPI.GetGamePath();
    try {
      const existence = await window.ShibAPI.checkIfFileExists(gameTitle);
      switch (existence) {
        case "FolderNotExisting":
          setGameState("NotInstalled");
          break;
        case "DownloadCompleted":
          setGameState("Installed");
          break;
        case "DownloadIncomplete":
          const result = await window.ShibAPI.GetGameStatus();
          if (result.GameStatus == "Paused") {
            setGameState("Incomplete");
          }
          else
          {
            setGameState("Downloading");
          }
          setResumeDownload(true);
          break;
        default:
          console.warn("Unexpected response:", existence);
      }
    } catch (error) {
      console.error("Error uninstalling game:", error);
    }
  }
  const CheckUpdate = async () => {
    const result = await window.ShibAPI.GetVersionDownloaded();
    if (result) {
      let UpdateVe = version == result[gameId].version;
      SetUpdateV(UpdateVe)
    }
  }
  const CheckPlayOnBrowser = async () => {
    if (gameId == 1|| gameId == 3) {
      setPlayOnBrowser(true);
      }
    else
    {
      setPlayOnBrowser(false);
    }

  }
  function openPixelStreaming() {
    window.ShibAPI.OpenPS()
  }
  function PlayGameOnBrowser() {
    if (gameId == 1)
    {
      window.open('https://play.shibaeternity.games', '_blank');
    }
    else
    {
      window.open('https://agentshiboshi.playwithshib.games', '_blank');
    }

  }
  const downloadFiles = async () => {
    console.log("Starting API Run");
    window.ShibAPI.SetGameStatus("Downloading");
    window.ShibAPI.SetGameDownloadUpdate("Download");
    gameTitle = gameTitle.split(' ').join('')
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.UserId;
    const Downloadedversion = await window.ShibAPI.GetVersionDownloaded();
    let versionDownloaded = Downloadedversion?.version || "0.0.0";
    versionDownloaded = resumeDownload? "0.0.0" : versionDownloaded;
    const res = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/SL/DOWNLOADVERSIONS?GameId=${gameId}&Platform=Windows&latestVersion=${version}&UserId=${userId}`,
    });
    if (res.ok && res.data) {

        console.log("API Complete");
        let DownloadURL = JSON.stringify(res.data);
        console.log("DOWNLOAD URL: " + DownloadURL);
        try {
          setGameState("Downloading")
          resumeDownload ? setProgress(progress) : setProgress(0);

          const downloadMethod = resumeDownload ? 'resumeDownload' : 'downloadFile';
          const downloadMessage = await window.ShibAPI[downloadMethod](DownloadURL, gameTitle, version);

          if (downloadMessage === 'File downloaded successfully') {
            await window.ShibAPI.unzipFile(gameTitle,gameTitle);
            await window.ShibAPI.CopyAndDeleteFile(gameTitle,DownloadURL);
            window.ShibAPI.SetVersionDownloaded(gameId, gameTitle, version);
            setGameState("Installed");
            setProgress(100);
            window.ShibAPI.SetGameDownloadUpdate("Complete");
            CheckUpdate();
          } else {

          }
        } catch (error) {
          console.error('Error downloading the file:', error);
          setGameState("NotInstalled")
        }

    } else {
      setGameState("ServerDown");
    }
  };

  const updateFiles = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.UserId;
    const res = await window.ShibAPI.Fetch({
      method: "post",
      api: `/api/SL/DELETEGAME?GameID=${gameId}&UserID=${userId}`,
    });
    if (res.ok && res.data) {
      // setGameState("NotInstalled")
      setResumeDownload(false);
      setProgress(0)
      await window.ShibAPI.cancelDownload(gameTitle);
      window.ShibAPI.SetVersionDownloaded(gameId, gameTitle, "0.0.0");
      window.ShibAPI.SetGameDownloadUpdate("Download");
      CheckUpdate();
    }
    await downloadFiles();
    // console.log("Starting API Run");
    // window.ShibAPI.SetGameStatus("Downloading");
    // window.ShibAPI.SetGameDownloadUpdate("Update");
    // gameTitle = gameTitle.split(' ').join('')
    // const user = JSON.parse(localStorage.getItem("user") || "{}");
    // const userId = user.UserId;
    // const Downloadedversion = await window.ShibAPI.GetVersionDownloaded();
    // let versionDownloaded = Downloadedversion[gameId].version || "0.0.0";
    // versionDownloaded = resumeDownload? "0.0.0" : versionDownloaded;
    // const res = await window.ShibAPI.Fetch({
    //   method: "post",
    //   api: `/api/SL/UPDATEVERSIONS?gameId=${gameId}&platform=Windows&VersionNumber=${version}&VersionDownloaded=${versionDownloaded}&userId=${userId}`,
    // });
    // if (res.ok && res.data) {
    //
    //   console.log("API Complete");
    //
    //   let DownloadURL = JSON.stringify(res.data);
    //   console.log("DOWNLOAD URL: " + DownloadURL);
    //   try {
    //     setGameState("Downloading")
    //     resumeDownload ? setProgress(progress) : setProgress(0);
    //
    //     const downloadMethod = resumeDownload ? 'resumeDownload' : 'downloadFile';
    //     const downloadMessage = await window.ShibAPI[downloadMethod](DownloadURL, gameTitle, version);
    //
    //     if (downloadMessage === 'File downloaded successfully') {
    //       const files = JSON.parse(DownloadURL);
    //
    //          for (let file of files) {
    //            if (file.fileName.endsWith(".zip")) {
    //              await window.ShibAPI.unzipFile(gameTitle, file.fileName.substring(0, file.fileName.length - 4));
    //            }
    //          }
    //       await window.ShibAPI.CopyAndDeleteFile(gameTitle,DownloadURL);
    //       window.ShibAPI.SetVersionDownloaded(gameId, gameTitle, version);
    //       setGameState("Installed");
    //
    //       setProgress(100);
    //       window.ShibAPI.SetGameDownloadUpdate("Complete");
    //       CheckUpdate();
    //     } else {
    //
    //     }
    //   } catch (error) {
    //     console.error('Error downloading the file:', error);
    //     setGameState("NotInstalled")
    //   }
    //
    // } else {
    //   setGameState("ServerDown");
    // }
  };
  // const Unzip = async() => {
  //   const res = await window.ShibAPI.Fetch({
  //     method: "post",
  //     api: `/api/SL/UPDATEVERSIONS?gameId=2&platform=windows&VersionNumber=0.0.1&VersionDownloaded=0.0.0&userId=75`,
  //   });
  //   const result = await window.ShibAPI.Fetch({
  //     method: "get",
  //     api: `/api/SL/GETENTRYFOLDER?GameId=${gameId}`,
  //   });
  //   let entryFolder = result.data.EntryFolder;
  //   console.log("DOWNLOAD URL: " + entryFolder);
  //   if (res.ok && res.data) {
  //     console.log("API Complete");
  //
  //     let DownloadURLs = JSON.stringify(res.data);
  //     const files = JSON.parse(DownloadURLs);
  //
  //    for (let file of files) {
  //      if (file.fileName.endsWith(".zip")) {
  //        await window.ShibAPI.unzipFile(gameTitle, file.fileName.substring(0, file.fileName.length - 4));
  //      }
  //    }
  //     // await window.ShibAPI.unzipFile(gameTitle,gameTitle);
  //      await window.ShibAPI.CopyAndDeleteFile(gameTitle, DownloadURLs);
  //
  //   }
  //   console.log("Unzip Completed" );
  // };
   const pauseDownload = () => {
    setResumeDownload(true);
    window.ShibAPI.SetGameStatus("Paused");
    setGameState("Paused")
    window.ShibAPI.pauseDownload();
  };

  const cancelDownload = async() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.UserId;
    const res = await window.ShibAPI.Fetch({
      method: "post",
      api: `/api/SL/DELETEGAME?GameID=${gameId}&UserID=${userId}`,
    });
    if (res.ok && res.data) {
      setGameState("NotInstalled")
      setResumeDownload(false);
      setProgress(0)
      window.ShibAPI.cancelDownload(gameTitle);
      window.ShibAPI.SetVersionDownloaded(gameId, gameTitle, "0.0.0");
      window.ShibAPI.SetGameDownloadUpdate("Download");
      CheckUpdate();
    }
  };
  const uninstallGame = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.UserId;
      const res = await window.ShibAPI.Fetch({
        method: "post",
        api: `/api/SL/DELETEGAME?GameID=${gameId}&UserID=${userId}`,
      });
      if (res.ok && res.data) {
        await window.ShibAPI.cancelDownload(gameTitle);
        setGameState("NotInstalled");
        setProgress(0);
        await window.ShibAPI.SetVersionDownloaded(gameId, gameTitle, "0.0.0");
        window.ShibAPI.SetGameDownloadUpdate("Download");
        CheckUpdate();
        console.log("Game uninstalled successfully.");
      }
      }
    catch
      (error)
      {
        console.error("Error uninstalling game:", error);
      }
    finally {
      setLoading(false); // Stop loading
    }
  };

  const onPlayClick = async () => {
    setPlaying(true);
    console.log("Launching the game...");
    const result = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/SL/GETENTRYPOINT?GameId=${gameId}`,
    });
    if (result.ok && result.data.EntryPoint) {
      console.log("API Complete");
      let entryPoint = result.data.EntryPoint;
      let Token = localStorage.getItem("token")?? ""
      window.ShibAPI.SetToken(Token)
      window.ShibAPI.playGame(gameTitle, entryPoint);
    }
  } ;

  // const UpdateClick = async () => {
  //
  //   console.log("Updating...");
  //   updateFiles();
  // } ;

    return (
      <div className={styles.container}>
        {
          PlayOnBrowser ? (

       <div className={styles.buttonContainer} onClick={PlayGameOnBrowser}>
        {
          <div className={styles.downloadContainer}>
            <div className={styles.downloadRow}>
              Play on Browser
            </div>
          </div>

        }

</div>
            ) :

            gameState == "Downloading" || gameState == "Paused" || gameState == "Installed"  || gameState == "Installing" || gameState == "Incomplete" || gameState == "Updating"?
             <div className={styles.downloadingStateContainer}>

               {gameState == "Installed" ?
                  (!UpdateV) ?
                    (
                    <div className={styles.Beditorcontainer}>
                      {loading ? (<>
                          <div className={styles.loadingspinner} style={{backgroundImage: `url(${SpinnerImageSpinner})`}}/>
                          <div className={styles.loadinglabel}>Uninstalling...</div>
                        </>

                      ): (
                        <>
                          <button className={styles.pauseButton} onClick={onPlayClick} disabled={playing}>
                            Play
                          </button>
                          <button className={styles.cancelButton} onClick={uninstallGame}>Uninstall</button>
                          {/*<button*/}
                          {/*  className={`${styles.pauseButton} ${gameId === 4 ? styles.disabled : ''}`}*/}
                          {/*  onClick={gameId === 4 ? undefined : UpdateClick}*/}
                          {/*  disabled={playing}*/}
                          {/*>Update*/}
                          {/*</button>*/}
                          {/*<button className={`${styles.cancelButton} ${gameId === 4 ? styles.disabled : ''}`}*/}
                          {/*        onClick={gameId === 4 ? undefined : uninstallGame}>Uninstall*/}
                          {/*</button>*/}
                        </>
                      )}
                      {/*<div className={styles.cancelButton} onClick={Unzip}>unzip</div>*/}
                    </div>

                    ) :
                    (<div className={styles.Beditorcontainer}>

                        {loading ? (<>
                            <div className={styles.loadingspinner} style={{backgroundImage: `url(${SpinnerImageSpinner})`}}/>
                            <div className={styles.loadinglabel}>Uninstalling...</div>
                          </>

                        ) : (
                          <>
                                <button className={styles.pauseButton} onClick={onPlayClick} disabled={playing}>
                              Play
                            </button>
                            <button  className={styles.cancelButton} onClick={uninstallGame}>Uninstall</button>
                            {/*<button*/}
                            {/*  className={`${styles.pauseButton} ${gameId === 4 ? styles.disabled : ''}`}*/}
                            {/*  onClick={gameId === 4 ? undefined : onPlayClick}*/}
                            {/*  disabled={playing}*/}
                            {/*>Play*/}
                            {/*</button>*/}
                            {/*<button className={`${styles.cancelButton} ${gameId === 4 ? styles.disabled : ''}`}*/}
                            {/*        onClick={gameId === 4 ? undefined : uninstallGame}>Uninstall*/}
                            {/*</button>*/}
                          </>
                        )}
                        {/*<div className={styles.cancelButton} onClick={Unzip}>unzip</div>*/}
                      </div>
                    )

                 :
                 gameState == "Incomplete" ?
                   (
                     <div className={styles.Beditorcontainer}>
                       <div className={styles.buttonContainer} onClick={onButtonClick}>
                       {/*<div*/}
                       {/*  className={`${styles.buttonContainer} ${gameId === 4 ? styles.disabled : ''}`}*/}
                       {/*   onClick={gameId === 4 ? undefined : onButtonClick}*/}
                       {/* >*/}
                        <div className={styles.downloadContainer}>
                          <div className={styles.downloadRow}>
                            <div className={styles.osIcon} style={{backgroundImage: `url(${WindowsIcon})`}}/>
                            Resume
                          </div>
                          <div className={styles.gameSize}>
                            {size}
                          </div>
                        </div>
                      </div>
                      {ispixelstream ? (<div className={styles.buttonContainer} onClick={openPixelStreaming}>
                        {
                          <div className={styles.downloadContainer}>
                            <div className={styles.downloadRow}>
                              Play on Browser
                            </div>
                          </div>

                        }
                      </div>) : (<></>)}

                    </div>
                  ) :
                  gameState == "Installing" ?
                    (
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div style={{width: `${progress}%`}}/>
                        </div>
                        <div className={styles.speedText}>Installing</div>
                      </div>
                    ):
                    (

                    <>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div style={{width: `${progress}%`}}/>
                        </div>
                        <div className={styles.speedText}>{`${progress}%`}</div>
                      </div>

                      <div className={styles.speedText}>{formatSpeed(speed)}</div>
                      <div className={styles.Beditorcontainer}>
                        <div
                          className={styles.pauseButton}
                          onClick={async () => {
                            if (gameState === "Paused") {
                              if (!UpdateV) {
                                const result = await window.ShibAPI.GetGameDownloadUpdate();
                                if (result.Status === "Update") {
                                  updateFiles();
                                } else {
                                  downloadFiles();
                                }
                              } else {
                                const result = await window.ShibAPI.GetGameDownloadUpdate();
                                if (result.Status === "Download") {
                                  downloadFiles();
                                }
                                else {
                                  updateFiles();
                                }
                              }
                            } else {
                              pauseDownload();
                            }
                          }}
                        >
                          {gameState == "Paused" ? "Resume" : "Pause"}
                        </div>
                        <div className={styles.cancelButton} onClick={cancelDownload}>Cancel</div>
                      </div>
                    </>)

              }

            </div>

            : gameState == "ServerDown" ?
              <div className={styles.serverMaintenance} onClick={onButtonClick}>
                <div className={styles.downloadRow}>
                  <div className={styles.osIcon}
                       style={{backgroundImage: `url(${MaintenanceIcon})`, width: 26, height: 26}}/>
                  Server Maintenance
                </div>
              </div>

              :gameState == "NotInstalled" ?
                  <div className={styles.Beditorcontainer}>

                    <div className={styles.buttonContainer} onClick={onButtonClick} >
                    {/*  <div*/}
                    {/*    className={`${styles.buttonContainer} ${gameId === 4 ? styles.disabled : ''}`}*/}
                    {/*    onClick={gameId === 4 ? undefined : onButtonClick}*/}
                    {/*  >*/}
                      {
                        <div className={styles.downloadContainer} >
                          <div className={styles.downloadRow}>
                            <div className={styles.osIcon} style={{backgroundImage: `url(${WindowsIcon})`}}/>
                            Download
                          </div>
                          <div className={styles.gameSize}>
                            {size}
                          </div>
                        </div>

                      }
                    </div>
                    {gameId === 2 && !ispixelstream ? (
                      <div className={styles.disabledPixelstream} onClick={openPixelStreaming}>
                        <div className={styles.downloadContainer}>
                          <div className={styles.downloadRow}>Play on Browser</div>
                        </div>
                      </div>
                    ) : gameId === 2 ? (
                      <div className={styles.buttonContainer} onClick={openPixelStreaming}>
                        <div className={styles.downloadContainer}>
                          <div className={styles.downloadRow}>Play on Browser</div>
                        </div>
                      </div>
                    ) : null}


                  </div>
                  :
                  <></>
        }
      </div>
    );

  async function onButtonClick() {
    if (gameState === "Installed") {
      onPlayClick();
    } else {
      if (!UpdateV) {
        const result = await window.ShibAPI.GetGameDownloadUpdate();
        if (result.Status === "Update") {
          updateFiles();
        } else {
          downloadFiles();
        }
      } else {
        const result = await window.ShibAPI.GetGameDownloadUpdate();
        if (result.Status === "Download") {
          downloadFiles();
        } else {
        updateFiles();
      }
      }
    }

  }

};

  function formatSpeed(speedInBytes: number) {
    let speed = speedInBytes / 1024; // Convert to KB/s
    let unit = 'KB/s';

    if (speed > 1024) {
      speed = speed / 1024; // Convert to MB/s
      unit = 'MB/s';
    }

    if (speed > 1024) {
      speed = speed / 1024; // Convert to GB/s
      unit = 'GB/s';
    }

    return `${speed.toFixed(2)} ${unit}`;
  }

