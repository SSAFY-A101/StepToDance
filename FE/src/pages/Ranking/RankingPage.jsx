import { useEffect, useState } from "react";
import { getRanking } from "../../api/RankingApis";
import styles from "./RankingPage.module.css";
import RankingList from "./components/RankingList";

const RankingPage = () => {
  const [rankingList, setRankingList] = useState([]);
  const [myRank, setMyRank] = useState([]);
  const [renderRank, setRenderRank] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRanking();
        setMyRank(res.data.my_info);
        setRankingList(res.data.top_ranker_list);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (rankingList) {
      const rankComponent = rankingList.map((rank, index) => {
        console.log(rank);
        return (
          <RankingList
            key={index}
            id={rank.id}
            ranking={rank.rank}
            name={rank.nickname}
            score={rank.score}
          />
        );
      });
      setRenderRank(rankComponent);
    }
  }, [rankingList]);

  return (
    <section className={styles["rank-page"]}>
      <p className={styles["rank-title"]}>Ranking</p>
      <article className={styles["rank-content"]}>{renderRank}</article>
    </section>
  );
};

export default RankingPage;
