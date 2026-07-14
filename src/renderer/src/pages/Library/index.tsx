import styles from "./styles.module.css"
import Wrapper from "../../components/Wrapper";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import LibraryListCard from "../../components/LibraryListCard";
export default function Library() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.UserId;
      const res = await window.ShibAPI.Fetch({
        method: "get",
        api: `/api/SL/SHOWDOWNLOADEDGAMES?UserId=${userId}`
      });

      if (res.ok) {
        setGames(res.data);
        //sessionStorage.setItem("games_list", JSON.stringify(res.data));
      }
    };
    fetchGames();
    // if (sessionStorage.getItem("games_list")) {
    // setGames(JSON.parse(sessionStorage.getItem("games_list") || "{}"));
    // } else {
    //   fetchGames();
    // }
  }, []);

  return (
    <Wrapper currentPage={1}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.sectionTitle}>
            My Collections
          </div>

          <div className={styles.row}>
            {games.map((game: any) => (
              <LibraryListCard
                key={game.Id}
                image={game.ProfilePicture?.Image || ""}
                title={game.DisplayTitle || ""}
                description={game.Description || ""}
                size={""}
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
