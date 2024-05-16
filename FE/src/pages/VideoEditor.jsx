import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { uploadShortform } from "../api/ShortformApis";
import TimeRange from "react-timeline-range-slider";
import { format } from "date-fns";

function VideoEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [guideId, setGuideId] = useState(state.guideId);
  const [videoUrl, setVideoUrl] = useState(state.videoUrl);
  const [highlightStartAt, setHighlightStartAt] = useState(
    state.highlightStartAt
  );
  const [highlightEndAt, setHighlightEndAt] = useState(state.highlightEndAt);
  const [played, setPlayed] = useState(0);
  // const [startAt, setStartAt] = useState(convertTimeFormat(state.highlightStartAt));
  // const [endAt, setEndAt] = useState(convertTimeFormat(state.highlightEndAt));
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const [timelineScrubberError, setTimelineScrubberError] = useState(false);

  const [selectedInterval, setSelectedInterval] = useState([
    new Date(convertTimeFormat(highlightStartAt)),
    new Date(convertTimeFormat(highlightEndAt)),
  ]);

  const timeline = [new Date(0), new Date(67 * 1000)];

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

  function convertTimeFormat(input) {
    // 문자열인 경우 ms 객체로 변환
    if (typeof input === "string") {
      const [hours, minutes, seconds] = input.split(":");
      const milliseconds =
        (parseInt(hours, 10) * 3600 +
          parseInt(minutes, 10) * 60 +
          parseInt(seconds, 10)) *
        1000;
      return milliseconds;
    }
    // Date 객체인 경우 문자열로 변환
    else if (input instanceof Date) {
      const hours = ("0" + input.getHours()).slice(-2);
      const minutes = ("0" + input.getMinutes()).slice(-2);
      const seconds = ("0" + input.getSeconds()).slice(-2);
      return `${hours}:${minutes}:${seconds}`;
    }
    // 다른 형식인 경우 에러 반환
    else {
      throw new Error("Unsupported input format");
    }
  }

  const createShortform = async () => {
    console.log("시작:", convertTimeFormat(selectedInterval[0]));
    console.log("끝:", convertTimeFormat(selectedInterval[1]));
    const response = await uploadShortform(
      guideId,
      videoUrl,
      convertTimeFormat(selectedInterval[0]),
      convertTimeFormat(selectedInterval[1])
    );
    console.log("Shortform created successfully:", response);
    navigate(`/shortsShare?id=${response.data}`);
  };

  // const handleInputChange = (index, newValue) => {
  //   if(index==="start") setStartAt(newValue);
  //   if(index==="end") setEndAt(newValue);
  // };

  const reset = () => {
    setSelectedInterval([
      new Date(convertTimeFormat(highlightStartAt)),
      new Date(convertTimeFormat(highlightEndAt)),
    ]);
  };

  const timelineScrubberErrorHandler = ({ error }) => {
    setTimelineScrubberError(error);
  };

  const onChangeCallback = (selectedInterval) => {
    console.log(selectedInterval);
    setSelectedInterval(selectedInterval);
  };

  return (
    <div className={styles.homeContainer}>
      <div>
        <button onClick={() => reset}>원본으로 복원</button>
        <button onClick={createShortform}>완료</button>
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
      {/* <div style={{marginTop:'5vw'}}>
        <p style={{color:'white'}}>시작 시간</p>
        <input type="text" value={startAt} onChange={(e) => handleInputChange('start', e.target.value)}/>
        <p style={{color:'white'}}>끝 시간</p>
        <input type="text" value={endAt} onChange={(e) => handleInputChange( 'end', e.target.value)}/>
      </div> */}
      <div>
        <TimeRange
          showNow
          error={timelineScrubberError}
          ticksNumber={4}
          selectedInterval={selectedInterval}
          timelineInterval={timeline}
          onUpdateCallback={timelineScrubberErrorHandler}
          onChangeCallback={onChangeCallback}
          // disabledIntervals={gap}
          step={1}
          formatTick={(ms) => format(new Date(ms), "HH:mm:ss")}
        />
      </div>
    </div>
  );
}

export default VideoEditor;
