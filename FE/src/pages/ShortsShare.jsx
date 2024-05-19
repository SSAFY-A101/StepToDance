import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getShortformDetail } from "../api/ShortformApis";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import styles from "../styles/ShortsShare.module.css";

function ShortsShare() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const location = useLocation();
  const [id, setId] = useState("");
  const [shortform, setShortform] = useState([]);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);

  // const handlePlayPause = () => {
  //     if (ended) {
  //       playerRef.current.seekTo(0);
  //       setEnded(false);
  //     }
  //     setIsPlaying(!isPlaying);
  //   };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setEnded(true);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idValue = searchParams.get("id");
    setId(idValue);
  }, [location]);

  useEffect(() => {
    const fetchShortformData = async () => {
      try {
        if (id) {
          const data = await getShortformDetail(id);
          console.log(data.data);
          setShortform(data.data);
        }
      } catch (error) {
        console.error("Error fetching shortform data:", error);
      }
    };
    fetchShortformData();
  }, [id]);

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      <div style={{ color: "white" }}>결과</div>
      <ReactPlayer
        url={shortform.video_url}
        ref={playerRef}
        playing={isPlaying}
        width={widthSize}
        height={heightSize * 0.75}
        onDuration={setDuration}
        loop={true}
        //   playbackRate={playbackRate}
        onEnded={handleVideoEnded}
        onProgress={({ played, loadedSeconds }) => {
          setPlayed(played);
          setDuration(loadedSeconds);
        }}
        //   volume={volume}
        playsinline
      />
      {/* <div className={styles.playButton} onClick={handlePlayPause}>
            {ended ? <ReplayIcon fontSize="large" /> : isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </div> */}
    </div>
  );
}

export default ShortsShare;
