import React, { useEffect, useRef, useState } from 'react';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { uploadShortform } from '../api/ShortformApis';
import { useNavigate } from "react-router-dom";

let ffmpeg;
const VideoEditor = () => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');
  const [videoTrimmed, setVideoTrimmed] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();
  let initialSliderValue = 0;
  const navigate = useNavigate();

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);

  const reset = () => {
    setStartTime(0);
  }

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let loaded = false;
      script.async = true;
      script.defer = true;
      script.src = src;
      script.onload = script.onreadystatechange = () => {
        if (!loaded) {
          loaded = true;
          resolve(script);
        }
      };
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };

  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    loadScript('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js')
      .then(() => {
        if (typeof window !== 'undefined') {
          ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
          if (!ffmpeg.isLoaded()) {
            ffmpeg.load().then(() => {
              setIsScriptLoaded(true);
            });
          } else {
            setIsScriptLoaded(true);
          }
        }
      })
      .catch(error => {
        console.error('Error loading ffmpeg script:', error);
      });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setVideoDuration(videoRef.current.duration);
        setEndTime(videoRef.current.duration);
      };
    }
  }, [videoSrc]);

  const updateOnSliderChange = (values, handle) => {
    setVideoTrimmedUrl('');
    const readValue = values[handle] | 0;
    if (handle) {
      if (endTime !== readValue) setEndTime(readValue);
    } else {
      if (initialSliderValue !== readValue) {
        initialSliderValue = readValue;
        if (videoRef.current) {
          videoRef.current.currentTime = readValue;
          setStartTime(readValue);
        }
      }
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);
    setPlayTime(currentTime);
    if (currentTime === endTime) e.currentTarget.pause();
  };

  const handleTrim = async () => {
    if (isScriptLoaded) {
      const { name, type } = videoFileValue;
      try {
        ffmpeg.FS('writeFile', name, await window.FFmpeg.fetchFile(videoFileValue));
        const videoFileType = type.split('/')[1];
        await ffmpeg.run(
          '-i', name,
          '-ss', `${convertToHHMMSS(startTime)}`,
          '-to', `${convertToHHMMSS(endTime)}`,
          '-acodec', 'copy',
          '-vcodec', 'copy',
          `out.${videoFileType}`
        );

        const data = ffmpeg.FS('readFile', `out.${videoFileType}`);
        const blob = new Blob([data.buffer], { type: `video/${videoFileType}` });

        setVideoTrimmed(blob);
        setVideoTrimmedUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error trimming video:', error);
      }
    }
  };

  const createShortform = async () => {
    try {
      const response = await uploadShortform(1, videoTrimmed);
      console.log('Shortform created successfully:', response);
      localStorage.removeItem('hasReloaded'); // Reset the flag before navigating away
      navigate(`/shortsShare?id=${response.data}`);
      window.location.reload();
    } catch (error) {
      console.error('Error creating shortform:', error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <button onClick={reset}>원본으로 돌아가기</button>
      <button onClick={handleTrim}>완성</button>
      <input style={{ color: "white" }} type="file" onChange={handleFileUpload} />
      <br />
      {videoSrc.length ? (
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <video style={{ maxWidth: '60%', height: 'auto' }} src={videoSrc} ref={videoRef} onTimeUpdate={handlePauseVideo}>
              <source src={videoSrc} type={videoFileValue.type} />
            </video>
          </div>
          <Nouislider
            behaviour="tap-drag"
            step={1}
            margin={3}
            limit={60}
            range={{ min: 0, max: videoDuration || 2 }}
            start={[0, videoDuration || 2]}
            connect
            onUpdate={updateOnSliderChange}
          />
          <br />
          <div style={{ color: "white" }}>
            Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration: {convertToHHMMSS(endTime)} <br /> 현재 시간: {convertToHHMMSS(playTime)}
          </div>
          <br />
          <div className={styles.playButton}>
            {!isPlaying && (<PlayArrowIcon onClick={handlePlay} />)}
            {isPlaying && (<PauseIcon onClick={handlePlay} />)} &nbsp;
          </div>
          <br />
          {videoTrimmedUrl && (
            <div>
              <video style={{ maxWidth: '100%', height: 'auto' }} controls>
                <source src={videoTrimmedUrl} type={videoFileValue.type} />
              </video>
              <div style={{ color: "white" }} onClick={createShortform}>완성</div>
            </div>
          )}
        </React.Fragment>
      ) : (
        ''
      )}
    </div>
  );
}

export default VideoEditor;
