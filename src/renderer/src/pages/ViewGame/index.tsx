import styles from "./styles.module.css"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Wrapper from "../../components/Wrapper";
import GameProfileSection from "../../components/GameProfileSection";
import ViewGameSection from "../../components/ViewGameSection";
import MediaViewer from "../../components/MediaViewer";
// import TimePlayedIcon from "../../assets/TimePlayedIcon.png"
// import TopThreeIcon from "../../assets/TopThreeIcon.png"
// import FastestRaceIcon from "../../assets/FastestRaceIcon.png"
// import AchievementsIcon from "../../assets/AchievementsIcon.png"
// import AchievementBlue from "../../assets/AchievementBlue.png"
// import AchievementGreen from "../../assets/AchievementGreen.png"
// import AchievementOrange from "../../assets/AchievementOrange.png"
// import AchievementLightBlue from "../../assets/AchievementLightBlue.png"
// import AchievementYellow from "../../assets/AchievementYellow.png"

export default function ViewGame() {
  const {game_id} = useParams()
  const [game, setGame] = useState<any>({});

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await window.ShibAPI.Fetch({
        method: "get",
        api: `/api/SL/GETGAMEDATA?GameId=${game_id}&Platform=Windows`,
      });

      if (res.ok) {
        setGame(res.data[0]);
      }
    };

    if (!game.Id) fetchGame();
  }, [])

  // const handleImageClick = (url: string) => {
  //   setSelectedImage(url);
  //   setIsModalOpen(true);
  // };
  //
  // // Handler for closing the modal
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedImage(null);
  // };

  return (
    <Wrapper showBackButton currentPage={-1}>
      <div className={styles.container}>
        <GameProfileSection gameData={game}/>

        <div className={styles.body}>
          <div className={styles.bodyColumn} style={{width: "75%"}}>
            {/*{game.Id != 4?*/}
            {/*<div className={styles.versionsContainer}>*/}
            {/*  <div className={styles.titleContainer}>*/}
            {/*    <div className={styles.title}>What's New in v1.0.0 <span className={styles.subTitle}>- 2 days ago</span>*/}
            {/*    </div>*/}
            {/*    <div className={styles.versionHistory}>VersionHistory</div>*/}
            {/*  </div>*/}

            {/*  <div className={styles.versionsBody}>*/}
            {/*    <li>{game?.Updates}*/}
            {/*    </li>*/}

            {/*  </div>*/}
            {/*</div> : <></>*/}
            {/*}*/}

            <ViewGameSection title={"Preview"} hideBorder>
              <MediaViewer
                media={game?.GameMedia?.map((media: any) => ({
                  url: media.PresignedUrl,
                  type: media.Type,
                  released: true
                }))}
                numPerPage={1}
                // onClick={(id: number) => {handleImageClick}}
              />
            </ViewGameSection>

            {/*{isModalOpen && selectedImage && (*/}
            {/*  <div className={styles.modal} onClick={handleCloseModal}>*/}
            {/*    <div className={styles.modalContent}>*/}
            {/*      <img src={selectedImage} alt="Full Image" />*/}
            {/*      <span className={styles.closeButton} onClick={handleCloseModal}>*/}
            {/*  &times;*/}
            {/*</span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            { game?.Events == null ? <></> :
            <ViewGameSection title={"Events"}>
              <div className={styles.eventsContainer}>
                <div
                  style={{
                    height: 300,
                    width: "40%",
                    backgroundImage: `url(${game?.EventPicture?.Image})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: 10
                  }}
                />
                <div style={{width: "60%"}}>
                  {game?.Events}
                </div>
              </div>
            </ViewGameSection>
            }
            { game?.AboutThisGameDescription == null ? <></> :
            <ViewGameSection title={"About This Game"}>
              <div className={styles.AboutContainer}>
                {game?.AboutThisGameDescription}
                </div>
            </ViewGameSection>
            }
          </div>

          <div className={styles.bodyColumn} style={{width: "25%"}}>
            {/*<ViewGameSection title={"My Stats"} hideBorder>*/}
            {/*  <div className={styles.statsContainer}>*/}
            {/*    <div className={styles.statsRow}>*/}
            {/*      <div className={styles.statsIcon} style={{backgroundImage: `url(${TimePlayedIcon})`}}/>*/}
            {/*      <div className={styles.statsTitle}>Time Played</div>*/}
            {/*      <div className={styles.statsValue}>---</div>*/}
            {/*    </div>*/}
            {/*    <div className={styles.statsRow}>*/}
            {/*      <div className={styles.statsIcon} style={{backgroundImage: `url(${TopThreeIcon})`}}/>*/}
            {/*      <div className={styles.statsTitle}>Games Finished in Top 3</div>*/}
            {/*      <div className={styles.statsValue}>---</div>*/}
            {/*    </div>*/}
            {/*    <div className={styles.statsRow}>*/}
            {/*      <div className={styles.statsIcon} style={{backgroundImage: `url(${FastestRaceIcon})`}}/>*/}
            {/*      <div className={styles.statsTitle}>Fastest Race</div>*/}
            {/*      <div className={styles.statsValue}>---</div>*/}
            {/*    </div>*/}
            {/*    <div className={styles.statsRow}>*/}
            {/*      <div className={styles.statsIcon} style={{backgroundImage: `url(${AchievementsIcon})`}}/>*/}
            {/*      <div className={styles.statsTitle}>Achievements</div>*/}
            {/*    </div>*/}
            {/*    <div className={styles.statsAchievmentsContainer}>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementOrange})`}}/>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementYellow})`}}/>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementBlue})`}}/>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementGreen})`}}/>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementBlue})`}}/>*/}
            {/*      <div className={styles.statsAchievementIcon} style={{backgroundImage: `url(${AchievementLightBlue})`}}/>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</ViewGameSection>*/}

            <ViewGameSection title={"Hardware Requirements"} hideBorder>
              <div className={styles.requirementsContainer}>
                {game?.Requirement?.map((requirement: any, i) => (
                  <div key={i}>
                    <div className={styles.requirementsTitle}>{requirement.Requirement_Type}</div>
                    <div className={styles.requirementsBody}>
                      <span className={styles.requirementsBodyHighlight}>OS:</span> {requirement.OS}
                    </div>
                    <div className={styles.requirementsBody}>
                      <span className={styles.requirementsBodyHighlight}>Processor:</span> {requirement.Processor}
                    </div>
                    <div className={styles.requirementsBody}>
                      <span className={styles.requirementsBodyHighlight}>Memory:</span> {requirement.Memory}
                    </div>
                    <div className={styles.requirementsBody}>
                      <span className={styles.requirementsBodyHighlight}>Graphics:</span> {requirement.Graphics}
                    </div>
                    <div className={styles.requirementsBody}>
                      <span className={styles.requirementsBodyHighlight}>Storage:</span> {requirement.Storage}
                    </div>
                  </div>
                ))}
              </div>
            </ViewGameSection>

          </div>
        </div>
      </div>
    </Wrapper>
  )
}
