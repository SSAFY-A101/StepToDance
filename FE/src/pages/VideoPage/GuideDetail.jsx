import React, { useRef, useState } from "react";
import styles from "./GuideDetail.module.css";
import ReactPlayer from 'react-player';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const GuideDetail = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const playerRef = useRef(null);
  const [volume, setVolume] = useState(1);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  const toggleVolumeControl = () => {
    setShowVolume(!showVolume);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className={styles.mainView}>
      <div 
        className={styles.playerWrapper}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <ReactPlayer
          url='https://step-to-dance.s3.ap-northeast-2.amazonaws.com/blue_check.mp4'
          ref={playerRef}
          playing={isPlaying}
          width="100%"
          height="100%"
          onDuration={setDuration}
          onProgress={({ played, loadedSeconds }) => {
            setPlayed(played);
            setDuration(loadedSeconds);
          }}
          volume={volume}
        />
        <div className={styles.controlsOverlay} style={{opacity: showControls ? 1 : 0}}>
          <div className={styles.playButton} onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
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
        </div>
      </div>
    </div>
  );
}

export default GuideDetail;
