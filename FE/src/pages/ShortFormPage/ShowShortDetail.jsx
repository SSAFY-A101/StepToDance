import { useEffect, useState, useRef } from "react";
import styles from "./ShowShortForm.module.css";
import ShareModal from "./ShareModal";
import { getShortformDetail } from "../../api/ShortformApis";
import FLY from "../../assets/images/fly.png"; // <a href="https://www.flaticon.com/kr/free-icons/-" title="종이 접기 아이콘">종이 접기 아이콘 제작자: Smashicons - Flaticon</a>
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const ShowShortDetail = () => {
  const [showShortForm, setShowShortForm] = useState();
  const [renderVideo, setRenderVideo] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);

  useEffect(() => {
    const shortformId =
      location.pathname.split("/")[location.pathname.split("/").length - 1];
    const getData = async () => {
      const response = await getShortformDetail(shortformId);
      setShowShortForm(response.data);
    };
    getData();
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (showShortForm) {
      const videoList = () => {
        return (
          <article className={styles["vidoe-page"]}>
            {isModal ? (
              <ShareModal infos={showShortForm} setIsModal={setIsModal} />
            ) : null}
            <ReactPlayer
              url={showShortForm.video_url}
              ref={playerRef}
              playing={isPlaying}
              width={widthSize}
              height={heightSize * 0.75}
              onDuration={setDuration}
              loop={true}
              onProgress={({ played, loadedSeconds }) => {
                setPlayed(played);
                setDuration(loadedSeconds);
              }}
              playsinline
              />
            <article className={styles["short-title"]}>
              <p>@{showShortForm.uploader}</p>
              <p>{showShortForm.song_title} - {showShortForm.singer}</p>
            </article>
            <img
              className={styles["short-share"]}
              onClick={() => setIsModal(true)}
              src={FLY}
              alt=""
            />
            {/* <div className={styles.playButton} onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </div> */}
          </article>
        );
      };
      setRenderVideo(videoList);
    }
  }, [showShortForm, isModal]);
  return <section className={styles["short-page"]}>{renderVideo}</section>;
};

export default ShowShortDetail;
