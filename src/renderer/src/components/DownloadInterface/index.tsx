import styles from "./styles.module.css"
import {useState, useEffect} from 'react';

// Helper function to format download speed
const formatSpeed = (speedInBytes: number): string => {
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
};

export default function DownloadInterface({GameId, Version}: { GameId: any, Version: any }) {
  const [isDownloading, setIsDownloading] = useState(false);
  //const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0); // Track progress
  const [speed, setSpeed] = useState(0); // Track download speed in bytes per second
  const [isDownloadComplete, setIsDownloadComplete] = useState(false); // Track if download is complete
  const [fileExists, setFileExists] = useState(false); // Track if download is complete

  useEffect(() => {
    window.ShibAPI.onDownloadProgress(({progress, downloadSpeed}: { progress: number, downloadSpeed: number }) => {
      setProgress(progress);
      setSpeed(downloadSpeed);
    });

    // Handle download completion
    window.ShibAPI.onDownloadComplete((message: string) => {
      setMessage(message);
      setIsDownloading(false);
      //setIsPaused(false);
    });

    // Handle download error
    window.ShibAPI.onDownloadError((error: string) => {
      setMessage(error);
      setIsDownloading(false);
      //setIsPaused(false);
    });

    const checkLocalData = async () => {
      const { exists } = await window.ShibAPI.GetGamePath();
      setFileExists(exists);
    }

    checkLocalData();
  }, []);

  const downloadFile = async () => {
    const res = await window.ShibAPI.Fetch({
      method: "get",
      api: `/api/SL/DOWNLOADVERSION?GameId=${GameId}&VersionNumber=${Version}`,
    });

    if (res.ok) {
      let DownloadURL = res.data.URL;

      try {
        setIsDownloading(true);
        setMessage('');
        setProgress(0);
        const downloadMessage = await window.ShibAPI.downloadFile(DownloadURL,"",Version);

        if (downloadMessage == 'File downloaded successfully') {
          setMessage("Unzipping File...");
          setProgress(0);
          await window.ShibAPI.unzipFile("",Version);
          setMessage("")
          // setMessage(unzipMessage);
          setIsDownloadComplete(true);
        } else {
          setMessage(downloadMessage);
        }
      } catch (error) {
        console.error('Error downloading the file:', error);
        setMessage('Failed to download file');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Function to handle launching the game
  const playGame = async () => {
    const { exists, path } = await window.ShibAPI.GetGamePath();
    console.log(window.ShibAPI.GetGamePath());
    if (exists) window.ShibAPI.LaunchGame(path, [`-token=${localStorage.getItem("token")}`, `-user_data={}`]);
  };

  return (
    <div className={styles.baseContainer}>
      <div className={styles.row}>
        {isDownloading && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
              <div style={{width: `${progress}%`}}/>
            </div>
            <div className={styles.speedText}>{formatSpeed(speed)}</div>
          </div>
        )}

        <button
          onClick={isDownloadComplete || fileExists ? playGame : downloadFile}
          disabled={isDownloading}
          className={styles.button}
        >
          {isDownloading ? `${progress}%` : isDownloadComplete || fileExists ? `Play` : `Download`}
        </button>
      </div>

      <div className={styles.row} style={{marginBottom: "-0.8em"}}>
        <div style={{height: "0.8em"}}>
          {message}
        </div>
      </div>
    </div>
  )
};
