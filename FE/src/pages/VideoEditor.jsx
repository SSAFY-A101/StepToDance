import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { uploadShortform } from "../api/ShortformApis";
import Timeline from "../components/Timeline";

function VideoEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [guideId, setGuideId] = useState(state.guideId);
  const [videoUrl, setVideoUrl] = useState(state.videoUrl);  
  const [played, setPlayed] = useState(0);
  const [startAt, setStartAt] = useState(parseTime(state.highlightStartAt));
  const [endAt, setEndAt] = useState(parseTime(state.highlightEndAt));
  const [duration, setDuration] = useState(15);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const [loading, setLoading] = useState(false);
  const initialStartAt = parseTime(state.highlightStartAt);
  const initialEndAt = parseTime(state.highlightEndAt);

  const handlePlayPause = () => {
    if (ended) {
      videoRef.current.currentTime = 0;
      setEnded(false);
    }
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setEnded(true);
  };

  useEffect(() => {
    if (!isNaN(duration)) {
      setDuration(duration);
    }
  }, [duration]);
  

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

  const handleLoadedMetadata = () => {
    const videoDuration = videoRef.current.duration;
    if (!isNaN(videoDuration) && isFinite(videoDuration)) {
      setDuration(videoDuration);
      if (videoDuration < startAt) {
        setStartAt(0);
        setEndAt(videoDuration);
      } else if (videoDuration < endAt) {
        setEndAt(videoDuration);
      }
    } else {
      // 비디오의 duration이 유효하지 않은 경우 처리할 로직 추가
      console.log("duration이 유효하지 않은 값")
    }
  };
  

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    setPlayed(currentTime / duration);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function parseTime(timeString) {
    const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
    const match = timeString.match(timeRegex);
  
    if (!match) {
      return 0;
    }
  
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
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
    setLoading(true);
    console.log("시작:", formatLocalTime(startAt));
    console.log("끝:", formatLocalTime(endAt));
    const response = await uploadShortform(
      guideId,
      videoUrl,
      formatLocalTime(startAt),
      formatLocalTime(endAt)
    );
    console.log("Shortform created successfully:", response);
    navigate(`/showShortForm/${response.data}`);
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
    videoRef.current.currentTime = clickTime;
    setPlayed(clickTime / duration);
  };

  return (
    <div className={`${styles.recordPage} ${styles.mainView}`}>
      
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.arcReactor}>
            <div className={styles.caseContainer}>
              <div className={styles.e7}>
                <div className={`${styles.semiArc3} ${styles.e5_1}`}>
                  <div className={`${styles.semiArc3} ${styles.e5_2}`}>
                    <div className={`${styles.semiArc3} ${styles.e5_3}`}>
                      <div className={`${styles.semiArc3} ${styles.e5_4}`}></div>
                    </div>
                  </div>  
                </div>
                <div className={styles.core2}>
                편집중입니다
                </div>
              </div>
              <ul className={styles.marks}>
                {Array.from({ length: 60 }, (_, i) => (
                  <li key={i}></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    
      <div className={styles.playerWrapper}>
        <video
          ref={videoRef}
          src={videoUrl}
          width={widthSize}
          height={heightSize * 0.5}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          playsInline
        />
      </div>
      <div className={styles.playButton} onClick={handlePlayPause}>
        {ended ? (
          <PlayArrowIcon fontSize="large" />
        ) : isPlaying ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </div>
      <div className={styles.timeDisplayOverlay}>
        {formatTime(played * duration)} / {formatTime(duration)}
      </div>
      <div style={{ marginTop: '5vw' }}>
        <p style={{ marginLeft: '5vw', color: 'white' }}>
          시작 {formatTime(startAt)} &nbsp; 끝 {formatTime(endAt)}
        </p>
      </div>
      <div className={styles.timelineContainer}>
        <Timeline 
          fixedMinTime={0} 
          fixedMaxTime={duration} 
          rangeMin={startAt}
          rangeMax={endAt}
          initialStartAt={initialStartAt}
          initialEndAt={initialEndAt}
          timeGap={1} 
          onTimeChange={handleTimelineChange}
          onPlaybarMove={handlePlaybarMove}
          currentTime={played * duration}
        />
      </div>
      <div className={styles.playerWrapper}>
        <div className={`${styles.glowingBtn} ${styles.resetButton}`} onClick={reset}>
          원본으로 복원
        </div>
        <div className={`${styles.glowingBtn} ${styles.createButton}`} onClick={createShortform}>
          완료
        </div>
      </div>
    </div>
  );
}

export default VideoEditor;
