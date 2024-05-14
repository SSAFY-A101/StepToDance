import React, { useEffect, useRef, useState } from 'react';
import Nouislider from 'nouislider-react';
import { Link } from 'react-router-dom';
import { stepLabelClasses } from '@mui/material';
import 'nouislider/distribute/nouislider.css';
import styles from "../styles/VideoEditor.module.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { uploadShortform } from '../api/ShortformApis';
import { useNavigate } from "react-router-dom"
import { bool } from 'prop-types';

let ffmpeg; 
function VideoEditor() {
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

  const reset = () => {
    setStartTime(0);
  }

  const loadScript = (src) => {
    return new Promise((onFulfilled, _) => {
      const script = document.createElement('script');
      let loaded;
      script.async = 'async';
      script.defer = 'defer';
      script.setAttribute('src', src);
      script.onreadystatechange = script.onload = () => {
        if (!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log('Script failed to load');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };

  // HHMMSS 형태로 바꾸기
  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    if (hours === '00') {
      time = minutes + ':' + seconds;
    } else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    return time;
  };

  useEffect(() => {
    loadScript(
      'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js',
    ).then(() => {
      if (typeof window !== 'undefined') {
        ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
        ffmpeg.load();
        setIsScriptLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);

  const updateOnSliderChange = (values, handle) => {
    setVideoTrimmedUrl('');
    let readValue;
    if (handle) {
      readValue = values[handle] | 0;
      if (endTime !== readValue) {
        setEndTime(readValue);
      }
    } else {
      readValue = values[handle] | 0;
      if (initialSliderValue !== readValue) {
        initialSliderValue = readValue;
        if (videoRef && videoRef.current) {
          videoRef.current.currentTime = readValue;
          setStartTime(readValue);
        }
      }
    }
  };

  //영상 재생
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
        if(isPlaying){
            videoRef.current.pause();
            setIsPlaying(false);
        }
        else{
            videoRef.current.play();
            setIsPlaying(true);
        }
    }
  };

  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);
    setPlayTime(currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };

  const handleTrim = async () => {
    if (isScriptLoaded) {
      const { name, type } = videoFileValue;
      ffmpeg.FS(
        'writeFile',
        name,
        await window.FFmpeg.fetchFile(videoFileValue),
      );
      const videoFileType = type.split('/')[1];
      console.log("비디오타입:",videoFileType);
      await ffmpeg.run(
        '-i',
        name,
        '-ss',
        `${convertToHHMMSS(startTime)}`,
        '-to',
        `${convertToHHMMSS(endTime)}`,
        '-acodec',
        'copy',
        '-vcodec',
        'copy',
        `out.${videoFileType}`,
      );

      const data = ffmpeg.FS('readFile', `out.${videoFileType}`);
      const blob = new Blob([data.buffer], { type: `video/${videoFileType}` });

      setVideoTrimmed(blob);
      setVideoTrimmedUrl(URL.createObjectURL(blob));

      // console.log("data", data);
      // console.log("videoTrimmed",videoTrimmed);
      // console.log("videoTrimmedUrl",videoTrimmedUrl,"아아");
    }
  };

  // const createShortform = () => {
  //   // videoTrimmedUrl이 존재하는지 확인
  //   if (videoTrimmedUrl) {
  //     // <a> 엘리먼트를 생성하여 다운로드
  //     const a = document.createElement('a');
  //     a.href = videoTrimmedUrl;
  //     a.download = 'test.mp4'; // 파일명 설정
  //     document.body.appendChild(a);
  //     a.click(); // 클릭 이벤트를 발생시켜 다운로드
  //     // <a> 엘리먼트 제거
  //     document.body.removeChild(a);
  //   }
  // };
  
  

  const createShortform = async () => {
    try {
      
      const response = await uploadShortform(1,videoTrimmed);
      console.log('Shortform created successfully:', response);
      navigate(`/shortsShare?id=${response.data}`);

      console.log("videoTrimmed",videoTrimmed);
      console.log("videoTrimmedUrl",videoTrimmedUrl);
    } catch (error) {
      // 업로드 과정에서 발생한 에러를 처리합니다.
      console.error('Error creating shortform:', error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <button onClick={reset}>원본으로 돌아가기</button>
      <button onClick={handleTrim}>완성</button>
      <input style={{color:"white"}} type="file" onChange={handleFileUpload} />
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
          <div style={{color:"white"}}>
          Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration: {convertToHHMMSS(endTime)} <br/> 현재 시간: {convertToHHMMSS(playTime)}
          </div>
          <br />
          <div className={styles.playButton}>
          {!isPlaying && (<PlayArrowIcon onClick={handlePlay}/>)}
          {isPlaying && (<PauseIcon onClick={handlePlay}/>)} &nbsp;
          </div>
          
          <br />
          {videoTrimmedUrl && (
            <div>
              <video style={{maxWidth:'100%', height:'auto'}} controls>
                <source src={videoTrimmedUrl} type={videoFileValue.type} />
              </video>
                <div style={{color:"white"}} onClick={createShortform}>완성</div>

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

stepLabelClasses