import styles from "./ShareModal.module.css";
import FACEBOOK from "../../assets/facebook.png";
import KAKAO from "../../assets/kakao.png";
import TWITTER from "../../assets/twitter.png";

const ShareModal = () => {
  return (
    <section className={styles["modal-page"]}>
      <article className={styles["modal-content"]}>
        <img className={styles["modal-image"]} src={KAKAO} alt="" />
        <img className={styles["modal-image"]} src={FACEBOOK} alt="" />
        <img className={styles["modal-image"]} src={TWITTER} alt="" />
      </article>
    </section>
  );
};

export default ShareModal;
