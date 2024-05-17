import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { uploadShortform } from "../api/ShortformApis";
import Timeline from "../components/Timeline";

function VideoEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const guideId = useState(state.guideId);
  const videoUrl = useState(state.videoUrl);
  const [played, setPlayed] = useState(0);
  const [startAt, setStartAt] = useState(parseTime(state.highlightStartAt));
  const [endAt, setEndAt] = useState(parseTime(state.highlightEndAt));
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
    console.log("얍얍",seconds);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function parseTime(timeString) {
    // "HH:mm:ss" 형식과 "mm:ss" 형식을 모두 처리하기 위해 정규식을 사용합니다.
    const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
    const match = timeString.match(timeRegex);
  
    if (!match) {
      // 유효한 형식이 아닌 경우 0을 반환합니다.
      return 0;
    }
  
    // 시간, 분, 초를 추출합니다.
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
    // 시간을 초 단위로 변환하여 반환합니다.
    return hours * 3600 + minutes * 60 + seconds;
  }
  

  function formatLocalTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const createShortform = async () => {
    console.log("시작:", formatLocalTime(startAt));
    console.log("끝:", formatLocalTime(endAt));
    const response = await uploadShortform(
      guideId,
      videoUrl,
      formatLocalTime(startAt),
      formatLocalTime(endAt)
    );
    console.log("Shortform created successfully:", response);
    navigate(`/shortsShare?id=${response.data}`);
  };

  const reset = () => {
    setStartAt(parseTime(state.highlightStartAt));
    setEndAt(parseTime(state.highlightEndAt));
  };

  const handleTimelineChange = (start, end) => {
    setStartAt(start);
    setEndAt(end);
  };
  const handlePlaybarMove = (clickTime) => {
    playerRef.current.seekTo(clickTime);
    setPlayed(clickTime / duration);
  };

  return (
    <div className={styles.homeContainer}>
      <div>
        <button onClick={reset}>원본으로 복원</button>
        <button onClick={createShortform}>완료</button>
      </div>
      <div>
        <ReactPlayer
          url={videoUrl}
          ref={playerRef}
          playing={isPlaying}
          width={widthSize}
          height={heightSize * 0.5}
          onDuration={(duration) => setDuration(duration)}
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
      <div style={{ marginTop: '5vw' }}>
        <p style={{marginLeft:'5vw', color: 'white' }}>시작 {formatTime(startAt)} &nbsp; 끝 {formatTime(endAt)}</p>
      </div>
      <div className={styles.timelineContainer}>
        <Timeline 
          fixedMinTime={0} 
          fixedMaxTime={duration || 1} 
          rangeMin={4}
          rangeMax={10}
          timeGap={1} 
          onTimeChange={handleTimelineChange}
          onPlaybarMove={handlePlaybarMove}
        />
      </div>
    </div>
  );
}

export default VideoEditor;
