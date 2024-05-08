import React, { useEffect, useRef, useState } from 'react';
import Nouislider from 'nouislider-react';
import { Link } from 'react-router-dom';
import { stepLabelClasses } from '@mui/material';
import 'nouislider/distribute/nouislider.css';
// import KakaoShareButton from '../components/KakaoShareButton';

let ffmpeg; 
function VideoEditor() {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();
  let initialSliderValue = 0;

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
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: videoFileValue.type }),
      );
      setVideoTrimmedUrl(url);
      console.log(videoTrimmedUrl);
    }
  };

  return (
    <div className="App">
      <input style={{color:"white"}} type="file" onChange={handleFileUpload} />
      <br />
      {videoSrc.length ? (
        <React.Fragment>
          <video style={{maxWidth:'100%', height:'auto'}} src={videoSrc} ref={videoRef} onTimeUpdate={handlePauseVideo}>
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
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
          Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{' '}
          
          {convertToHHMMSS(endTime)}
          </div>
          <br />
          <button onClick={handlePlay}>{isPlaying ? "정지":"재생"}</button> &nbsp;
          <button onClick={handleTrim}>Trim</button>
          <br />
          {videoTrimmedUrl && (
            <div>
              <video style={{maxWidth:'100%', height:'auto'}} controls>
                <source src={videoTrimmedUrl} type={videoFileValue.type} />
              </video>
              {/* <Link to={{ pathname:'/shortsShare', state:[{videourl: videoTrimmedUrl},{videoFileValue: videoFileValue.type}]}}>
                <div style={{color:"white"}}>완성</div>
              </Link> */}
              {/* <KakaoShareButton videoUrl={videoTrimmedUrl} /> */}
<q className="om"></q>
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