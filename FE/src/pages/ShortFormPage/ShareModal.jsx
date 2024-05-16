import styles from "./ShareModal.module.css";
import FACEBOOK from "../../assets/facebook.png";
import KAKAO from "../../assets/kakao.png";
import TWITTER from "../../assets/twitter.png";
import THUMBNAIL from "../../assets/thumbnail.png";

const ShareModal = ({ infos }) => {
  console.log(infos);
  const shareOnKaKao = () => {
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: infos.song_title,
        description: infos.singer,
        imageUrl: THUMBNAIL,
      },
      link: {
        webUrl: "https://k10a101.p.ssafy.io/home",
        mobileWeburl: "https://k10a101.p.ssafy.io/home",
      },
    });
  };
  return (
    <section className={styles["modal-page"]}>
      <article className={styles["modal-content"]}>
        <img
          className={styles["modal-image"]}
          src={KAKAO}
          onClick={shareOnKaKao}
          alt=""
        />
        <img className={styles["modal-image"]} src={FACEBOOK} alt="" />
        <img className={styles["modal-image"]} src={TWITTER} alt="" />
      </article>
    </section>
  );
};

export default ShareModal;
