import styles from "./RankingList.module.css";
import { useNavigate } from "react-router-dom";

const RankingList = ({ id, ranking, name, score }) => {
  const navigate = useNavigate();

  const handleClick = (index) => {
    navigate(`/userPage/${index}`);
    }

  return (
    <div className={styles["ranking"]} onClick={handleClick(id)}>
      <span className={styles["ranking-rank"]}>{ranking}등</span>
      <span className={styles["ranking-name"]}>{name}</span>
      <span className={styles["ranking-score"]}>{score}점</span>
    </div>
  );
};

export default RankingList;
