import React, { useRef, useState } from "react";
import styles from "./GuideDetail.module.css";
import ReactPlayer from 'react-player';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import ReplayIcon from '@mui/icons-material/Replay';


const GuideDetail = () => {
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
  
  // 더미 데이터
  const videoData = {
    id: 1,
    video_url: 'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/blue_check.mp4',
    thumbnail_img_url: 'src/assets/thumbnail.png',
    song_title: '노래 제목',
    singer: '가수',
    genre: 'Kpop',
    rank: 1,
    uploader: 'user123',
    count_feedback: 5,
    created_at: '2024-04-15T08:00:00Z',
  };

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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className={styles.mainView}>
      <div className={styles.infoBar}>
        <h2>{videoData.song_title} - {videoData.singer}</h2> {/* 노래 제목과 가수 이름 표시 */}
      </div>
          <button className={styles.glowingBtn} onClick={handlePlayPause}>
            <span className={styles.glowingTxt}>ON AIR</span>
          </button>
      <div 
        className={styles.playerWrapper}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
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
        <div className={styles.controlsOverlay} style={{opacity: showControls ? 1 : 0}}>
          <div className={styles.playButton} onClick={handlePlayPause}>
            {ended ? <ReplayIcon fontSize="large" /> : isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </div>
          <div className={styles.timeDisplayOverlay}>
            {formatTime(played * duration)} / {formatTime(duration)}
          </div>
          <div className={styles.progressBar} onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const fraction = (e.clientX - rect.left) / rect.width;
              playerRef.current.seekTo(fraction, 'fraction');
            }}>
            <div className={styles.progress} style={{ width: `${played * 100}%` }}></div>
          </div>
          <div className={styles.volumeControl} style={{ display: showVolume ? 'flex' : 'none' }}>
          <VolumeUpIcon onClick={toggleVolumeControl} />
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
            <SpeedIcon fontSize="small"/>
            <span>{playbackRate.toFixed(2)}x</span> {/* 배속 표시 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
