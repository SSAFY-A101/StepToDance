import styles from "./RankingList.module.css";

const RankingList = ({ ranking, name, score }) => {
  return (
    <div className={styles["ranking"]}>
      <span className={styles["ranking-rank"]}>{ranking}등</span>
      <span className={styles["ranking-name"]}>{name}</span>
      <span className={styles["ranking-score"]}>{score}점</span>
    </div>
  );
};

export default RankingList;
