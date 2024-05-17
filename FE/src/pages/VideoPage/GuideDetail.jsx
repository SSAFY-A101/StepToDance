import React, { useEffect, useRef, useState } from "react";
import styles from "./GuideDetail.module.css";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SpeedIcon from "@mui/icons-material/Speed";
import ReplayIcon from "@mui/icons-material/Replay";
import { useLocation, useNavigate } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the icon
import { getGuideDetail } from "../../api/GuideApis";

const VIDEODATA = {
  id: 1,
  video_url:
    "https://step-to-dance.s3.ap-northeast-2.amazonaws.com/blue_check.mp4",
  thumbnail_img_url: "src/assets/thumbnail.png",
  song_title: "노래 제목",
  singer: "가수",
  genre: "Kpop",
  rank: 1,
  uploader: "user123",
  count_feedback: 5,
  created_at: "2024-04-15T08:00:00Z",
};

const GuideDetail = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use the useNavigate hook
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const playerRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1); // 배속 상태 추가
  const [rateIndex, setRateIndex] = useState(0); // 현재 배속 인덱스
  const playbackRates = [1, 1.25, 1.5, 0.5, 0.75]; // 배속 설정 배열
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const [videoData, setVideoData] = useState(VIDEODATA);

  useEffect(() => {
    const guideIndex =
      location.pathname.split("/")[location.pathname.split("/").length - 1];
    (async () => {
      const response = await getGuideDetail(guideIndex);
      setVideoData(response.data);
    })();
  }, []);

  const handlePlayPause = () => {
    if (ended) {
      playerRef.current.seekTo(0);
      setEnded(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  const toggleVolumeControl = () => {
    setShowVolume(!showVolume);
  };

  const handleOnAirClick = () => {
    navigate("/record", { state: { videoUrl: videoData.video_url, guideId: videoData.id } });
  };

  const changePlaybackRate = () => {
    const nextRateIndex = (rateIndex + 1) % playbackRates.length; // 다음 인덱스 계산
    setPlaybackRate(playbackRates[nextRateIndex]);
    setRateIndex(nextRateIndex);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setEnded(true);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div className={styles.mainView}>
      <div className={styles.infoBar}>
        <ArrowBackIcon 
          fontSize="large" 
          className={styles.backButton}
          onClick={() => navigate(-1)} // Navigate back to the previous page
        />
        <h2>
          {videoData.song_title} - {videoData.singer}
        </h2>
      </div>
      <div
        className={styles.playerWrapper}
        onMouseEnter={() => {
          setShowControls(true);
          setShowVolume(true);
        }}
        onMouseLeave={() => {
          setShowControls(false);
          setShowVolume(false);
        }}
      >
        <ReactPlayer
          url={videoData.video_url}
          ref={playerRef}
          playing={isPlaying}
          width={widthSize}
          height={heightSize * 0.75}
          onDuration={setDuration}
          playbackRate={playbackRate}
          onEnded={handleVideoEnded}
          onProgress={({ played, loadedSeconds }) => {
            setPlayed(played);
            setDuration(loadedSeconds);
          }}
          volume={volume}
          playsinline
        />
        <div
          className={styles.controlsOverlay}
          style={{ opacity: showControls ? 1 : 0 }}
        >
          <div className={styles.playButton} onClick={handlePlayPause}>
            {ended ? (
              <ReplayIcon fontSize="large" />
            ) : isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </div>
          <div className={styles.timeDisplayOverlay}>
            {formatTime(played * duration)} / {formatTime(duration)}
          </div>
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
          <div
            className={styles.volumeControl}
            style={{ display: showVolume ? "flex" : "none" }}
          >
            <VolumeUpIcon
              style={{ color: "white" }}
              onClick={toggleVolumeControl}
            />
            {showVolume && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            )}
          </div>
          <div className={styles.speedControl} onClick={changePlaybackRate}>
            <SpeedIcon fontSize="small" />
            <span>{playbackRate.toFixed(2)}x</span> {/* 배속 표시 */}
          </div>
        </div>
      </div>
      <button className={styles.glowingBtn}>
        <span className={styles.glowingTxt}>
          <VideocamIcon fontSize="large" onClick={handleOnAirClick} />
        </span>
      </button>
    </div>
  );
};

export default GuideDetail;
