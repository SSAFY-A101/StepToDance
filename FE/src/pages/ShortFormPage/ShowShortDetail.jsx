import { useEffect, useState } from "react";
import styles from "./ShowShortForm.module.css";
import ShareModal from "./ShareModal";
import { getShortformDetail } from "../../api/ShortformApis";
import FLY from "../../assets/images/fly.png"; // <a href="https://www.flaticon.com/kr/free-icons/-" title="종이 접기 아이콘">종이 접기 아이콘 제작자: Smashicons - Flaticon</a>

const ShowShortDetail = () => {
  const [showShortForm, setShowShortForm] = useState();
  const [renderVideo, setRenderVideo] = useState([]);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await getShortformDetail(70);
      setShowShortForm(response.data);
    };
    getData();
  }, []);

  useEffect(() => {
    if (showShortForm) {
      const videoList = () => {
        return (
          <article className={styles["vidoe-page"]}>
            {isModal ? (
              <ShareModal infos={showShortForm} setIsModal={setIsModal} />
            ) : null}
            <video
              className={styles["short-video"]}
              src={showShortForm.video_url}
              loop
              muted
              playsInline></video>
            <p className={styles["short-title"]}>
              {showShortForm.song_title} - {showShortForm.singer}
            </p>
            <img
              className={styles["short-share"]}
              onClick={() => setIsModal(true)}
              src={FLY}
              alt=""
            />
          </article>
        );
      };
      setRenderVideo(videoList);
    }
  }, [showShortForm, isModal]);
  return <section className={styles["short-page"]}>{renderVideo}</section>;
};

export default ShowShortDetail;
