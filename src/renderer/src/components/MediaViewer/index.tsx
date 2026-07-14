import styles from "./styles.module.css"
import arrowImage from "../../assets/ArrowLeft.png"
import {useEffect, useState} from "react";


type Media = {
  url: string,
  type: "image" | "video",
  id:number,
  released: boolean,
  isHBannerUrl: boolean,
  HBannerUrl: string
}

export default function MediaViewer({media = [], numPerPage = 3, cover = true,onClick}: { media: Media[], numPerPage?: number , cover?: boolean,onClick?: (id: number, isHBannerUrl: boolean, HBannerUrl: string ) => void}) {
  const [currentPage, setCurrentPage] = useState<number>(0)

  useEffect(() => {

    const interval = setInterval(() => {
      changePage(1);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <div className={styles.container}>
      <div className={styles.mediaContainer}>
        {media.slice(currentPage * numPerPage, currentPage * numPerPage + numPerPage).map((m: Media, i) => (
          m.type == "image" ?

            <div
              key={i}
              className={`${styles.image} ${!m.released ? styles.disabled : ''}`}
              style={{backgroundImage: `url(${m.url})`, width: `${100 / numPerPage}%`,backgroundSize: cover? "cover": "contain"}}
              onClick={m.released && m.id ? () => onClick?.(m.id, m.isHBannerUrl, m.HBannerUrl) : undefined}

            />
            :
            <video
              key={i}
              className={styles.video}
              style={{width: `${100 / numPerPage}%`}}
              controls
              disablePictureInPicture
              disableRemotePlayback
              controlsList={"nodownload"}
              contextMenu={"return false"}
            >
              <source src={m.url} type="video/mp4"/>
            </video>
        ))}
      </div>

      <div className={styles.navigationContainer}>
        <div
          className={styles.arrowButton}
          style={{backgroundImage: `url(${arrowImage})`}}
          onClick={() => changePage(-1)}
        />

        <div className={styles.paginationContainer}>
          {getPageCirclesArray().map((_, i) => (
            <div
              key={i}
              className={styles.paginationCircle}
              style={{backgroundColor: currentPage == i ? "#DAA46B" : "transparent"}}
            />
          ))}
        </div>

        <div
          className={styles.arrowButton}
          style={{backgroundImage: `url(${arrowImage})`, transform: `scaleX(-1)`}}
          onClick={() => changePage(1)}
        />
      </div>
    </div>
  );

  function changePage(change: number) {
    const totalPages = Math.floor(media.length / numPerPage);
    const nextPage = currentPage + change;

    if (nextPage < 0) {
      setCurrentPage(totalPages - 1);
    } else if (nextPage >= totalPages) {
      setCurrentPage(0);
    } else {
      setCurrentPage(nextPage);
    }
  }


  function getPageCirclesArray() {
    let testing: number[] = []
    for (let i = 0; i < media.length / numPerPage; i++) testing.push(i)
    return testing
  }
};
