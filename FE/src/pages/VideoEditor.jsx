import {useState,useEffect,useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { uploadShortform } from "../api/ShortformApis";

function VideoEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [guideId, setGuideId] = useState(state.guideId);
  const [videoUrl, setVideoUrl] = useState(state.videoUrl);
  const [highlightStartAt, setHighlightStartAt] = useState(state.highlightStartAt);
  const [highlightEndAt, setHighlightEndAt] = useState(state.highlightEndAt);
  const [played, setPlayed] = useState(0);
  const [startAt, setStartAt] = useState(highlightStartAt);
  const [endAt, setEndAt] = useState(highlightEndAt); 
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);

  const handlePlayPause = () => {
    if (ended) {
      playerRef.current.seekTo(0);
      setEnded(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setEnded(true);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    setWidthSize(window.innerWidth);
    setHeightSize(window.innerHeight);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const createShortform = async () => {
    console.log("시작:",startAt);
    console.log("끝:",endAt);
    const response = await uploadShortform(
      guideId,
      videoUrl,
      startAt,
      endAt
    );
    console.log('Shortform created successfully:', response);
    navigate(`/shortsShare?id=${response.data}`);
  }

  const handleInputChange = (index, newValue) => {
    if(index==="start") setStartAt(newValue);
    if(index==="end") setEndAt(newValue);
  };

  return (
    <div>
      <div>
        <button onClick={()=>{}}>
          원본으로 복원
        </button>
        <button onClick={createShortform}>
          완료
        </button>
      </div>
      <div>
        <ReactPlayer
          url={videoUrl}
          ref={playerRef}
          playing={isPlaying}
          width={widthSize}
          height={heightSize * 0.5}
          onDuration={setDuration}
          onEnded={handleVideoEnded}
          controls={false}
          onProgress={({ played, loadedSeconds }) => {
            setPlayed(played);
            setDuration(loadedSeconds);
          }}
          className={styles.player}
        />
      </div>
      <div>
        <div className={styles.playButton} onClick={handlePlayPause}>
          {ended ? (
            <PlayArrowIcon fontSize="large" />
          ) : isPlaying ? (
            <PauseIcon fontSize="large" />
          ) : (
            <PlayArrowIcon fontSize="large" />
          )}
        </div>
      </div>
      <div className={styles.timeDisplayOverlay}>
        {formatTime(played * duration)} / {formatTime(duration)}
      </div>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          onClick={(e) => {
            const rect = e.target.getBoundingClientRect();
            const fraction = (e.clientX - rect.left) / rect.width;
            playerRef.current.seekTo(fraction, "fraction");
          }}
        >
          <div
            className={styles.progress}
            style={{ width: `${played * 100}%` }}
          ></div>
        </div>
      </div>
      <div style={{marginTop:'5vw'}}>
        <p style={{color:'white'}}>시작 시간</p>
        <input type="text" value={startAt} onChange={(e) => handleInputChange('start', e.target.value)}/>
        <p style={{color:'white'}}>끝 시간</p>
        <input type="text" value={endAt} onChange={(e) => handleInputChange( 'end', e.target.value)}/>
      </div>
    </div>
  );
}

export default VideoEditor;
