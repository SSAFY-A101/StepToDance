import styles from "./ShareModal.module.css";
import FACEBOOK from "../../assets/facebook.png";
import KAKAO from "../../assets/kakao.png";
import TWITTER from "../../assets/twitter.png";
import THUMBNAIL from "../../assets/thumbnail.png";
import { Facebook } from "@mui/icons-material";

const ShareModal = ({ infos, setIsModal }) => {
  const shareUrl = `https://www.steptodance.site/showShortForm/${infos.id}`;
  const shareOnKaKao = () => {
    console.log(infos);
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: infos.song_title,
        description: infos.singer,
        imageUrl:
          "https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/213.png",
        imageWidth: 300,
        imageHeight: 300,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "영상 이동",
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
      ],
    });
  };

  const faceBook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank");
  };

  const twitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(infos.song_title + " - " + infos.singer)}`;
    window.open(url, "_blank");
  };

  return (
    <section className={styles["modal-page"]} onClick={() => setIsModal(false)}>
      <article className={styles["modal-content"]}>
        <img
          className={styles["modal-image"]}
          src={KAKAO}
          onClick={shareOnKaKao}
          alt=""
        />
        <img
          className={styles["modal-image"]}
          onClick={faceBook}
          src={FACEBOOK}
          alt=""
        />
        <img
          className={styles["modal-image"]}
          onClick={twitter}
          src={TWITTER}
          alt=""
        />
      </article>
    </section>
  );
};

export default ShareModal;
