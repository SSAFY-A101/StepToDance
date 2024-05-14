import styles from "./RankingList.module.css";
import { useNavigate } from "react-router-dom";

const RankingList = ({ id, ranking, name, score }) => {
  const navigate = useNavigate();

  const handleClick = (index) => {
    navigate(`/userPage/${index}`);
  };

  return (
    <div className={styles["ranking"]} onClick={() => handleClick(id)}>
      <p className={styles["ranking-rank"]}>{ranking}등</p>
      <p className={styles["ranking-name"]}>{name}</p>
      <p className={styles["ranking-score"]}>
        <p className={styles["ranking-point"]}>{score}</p>점
      </p>
    </div>
  );
};

export default RankingList;
