import styles from "./styles.module.css"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import GameListCard from "../../components/GameListCard";
import Wrapper from "../../components/Wrapper";
import MediaViewer from "../../components/MediaViewer";

export default function Home() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await window.ShibAPI.Fetch({
        method: "get",
        api: "/api/SL/SHOWGAMES"
      });

      if (res.ok) {
        setGames(res.data);
         sessionStorage.setItem("games_list", JSON.stringify(res.data));
      }
    };

    if (sessionStorage.getItem("games_list")) {
      setGames(JSON.parse(sessionStorage.getItem("games_list") || "{}"));
    } else {
      fetchGames();
     }
  }, []);

  return (
    <Wrapper currentPage={0}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.sectionTitle}>
            Featured and Recommended
          </div>

          <div className={styles.row}>
            <MediaViewer
              media={games.map((game: any) => ({url: game?.HomeBPicture?.Image, type: "image",id: game.Id,released: game.Released,isHBannerUrl: game.isHBannerUrl, HBannerUrl: game.HBannerUrl,}))}
              numPerPage={1}
              cover = {false}
              // onClick={(id: number) => {
              //   navigate(`/view_game/${id}`)
              onClick={(id: number, isHBannerUrl: boolean, HBannerUrl: string ) => {
                if (isHBannerUrl) {
                  // window.location.href = HBannerUrl;
                  window.open(HBannerUrl,'_blank');
                } else {
                  navigate(`/view_game/${id}`);
                }
              }}
              />
          </div>

          <div className={styles.sectionTitle}>
            All Games
          </div>

          <div className={styles.row}>
            {games.map((game: any) => (
              <GameListCard
                key={game.Id}
                image={game.ProfilePicture?.Image || ""}
                title={game.DisplayTitle || ""}
                description={game.Description || ""}
                released={game.Released || false}
                onClick={() => {
                  navigate(`/view_game/${game.Id}`)
                }}
              />
            ))}

          </div>
        </div>
      </div>
    </Wrapper>
  )
}
