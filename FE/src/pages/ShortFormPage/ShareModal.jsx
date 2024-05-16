import styles from "./ShareModal.module.css";
import FACEBOOK from "../../assets/facebook.png";
import KAKAO from "../../assets/kakao.png";
import TWITTER from "../../assets/twitter.png";
import THUMBNAIL from "../../assets/thumbnail.png";

const ShareModal = ({ infos }) => {
  const shareOnKaKao = () => {
    console.log(infos);
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: infos.song_title,
        description: infos.singer,
        imageUrl: THUMBNAIL,
        image_width: "300px",
        image_height: "300px",
        link: {
          webUrl: "https://www.steptodance.site/home",
          mobileWebUrl: "https://www.steptodance.site/home",
        },
      },
      buttons: [
        {
          title: "영상 이동",
          link: {
            webUrl: "http://www.steptodance.site/home",
            mobileWebUrl: "https://www.steptodance.site/home",
          },
        },
      ],
    });
    console.log("hi");
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
