import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import RecordRTC from "recordrtc";
import ReactPlayer from "react-player";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import { guideResult } from "../../api/GuideApis";

const playbackRates = [1, 1.25, 1.5, 0.5, 0.75];

export const WebcamStreamCapture = () => {
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const webcamRef = useRef(null);
  const [recordRTC, setRecordRTC] = useState(null);
  const [playerOpacity, setPlayerOpacity] = useState(1);
  const [capturing, setCapturing] = useState(false);
  const [recordVideo, setRecordVideo] = useState("");
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const guideId = location.state?.guideId;
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rateIndex, setRateIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [version, setVersion] = useState("sideBySide");
  const [isMirrored, setIsMirrored] = useState(false); // State to manage mirrored mode

  const handleSliderChange = (e) => {
    const newOpacity = e.target.value;
    setPlayerOpacity(newOpacity);
  };

  const handlePlayPause = () => {
    if (ended) {
      videoRef.current.seekTo(0);
      setEnded(false);
    }
    setIsPlaying(!isPlaying);
  };

  const changePlaybackRate = () => {
    const nextRateIndex = (rateIndex + 1) % playbackRates.length;
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

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      setWidthSize(currentWidth);
      setHeightSize(currentHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    setIsRecording(true);
    setCapturing(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        const options = { type: "video", mimeType: "video/webm" };
        const recorder = new RecordRTC(stream, options);
        recorder.startRecording();
        setRecordRTC(recorder);
      })
      .catch((error) => {
        console.error("Error accessing the media devices.", error);
      });
  }, [setIsRecording]);

  const handleStopCaptureClick = useCallback(() => {
    if (recordRTC) {
      recordRTC.stopRecording(() => {
        const videoUrl = recordRTC.toURL();
        setRecordVideo(videoUrl);
        setCapturing(false);
        setIsRecording(false);
        recordRTC.destroy();
        setRecordRTC(null);
      });
    }
  }, [recordRTC, setIsRecording]);

  const reRecord = useCallback(() => {
    setRecordVideo("");
    setVersion("sideBySide");
  }, []);

  const resultHandler = async () => {
    const start = formatTime(new Date("00:00"));
    const end = formatTime(new Date("01:00"));
    setIsLoading(true);
    const res = await fetch(recordVideo)
      .then((response) => response.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("video", blob, "video.mp4");
        formData.append("start_at", start);
        formData.append("end_at", end);

        return formData;
      });

    try {
      const response = await guideResult(guideId, res);
      if (response.status === 201) {
        alert("피드백 채점 요청 성공! 마이페이지 피드백 페이지에서 해당 채점 결과를 확인하실 수 있습니다.");
        navigate("/home");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      alert("서버상 문제로 다시 요청 바랍니다.");
      console.error("Error fetching guide list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    const confirmBack = window.confirm(
      "해당 페이지에서 벗어나게 되면 녹화된 영상이 삭제됩니다.\n정말 나가시겠습니까?"
    );
    if (confirmBack) {
      navigate(-1);
    }
  };

  const renderVideoPlayer = (url, ref, opacity = 1) => (
    <>
      <ReactPlayer
        ref={ref}
        url={url}
        loop
        playing={isPlaying}
        onDuration={setDuration}
        playbackRate={playbackRate}
        onEnded={handleVideoEnded}
        onProgress={({ played, loadedSeconds }) => {
          setPlayed(played);
          setDuration(loadedSeconds);
        }}
        width={version === "sideBySide" ? widthSize / 2 : widthSize}
        height={heightSize * 0.7}
        autoPlay
        style={{
          objectFit: "cover",
          opacity: opacity,
          display: showVideo ? "block" : "none",
          zIndex: 3
        }}
        playsinline={true}
        type="video/mp4"
      />
      <div
        className={styles.controlsOverlay}
        style={{ opacity: showControls ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to parent
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
            ref.current.seekTo(fraction, "fraction");
          }}
        >
          <div
            className={styles.progress}
            style={{ width: `${played * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );

  const renderSideBySide = () => (
    <>
      <div className={styles.playerWrapper}>
        {renderVideoPlayer(videoUrl, videoRef)}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={widthSize / 2}
          height={heightSize * 0.75}
          mirrored={isMirrored} // Apply mirrored state
          videoConstraints={{
            facingMode: "user",
            aspectRatio: 1,
          }}
        />
      </div>
      <div
        className={`${styles.mirrorToggle} ${isMirrored ? styles.active : ""}`}
        onClick={() => setIsMirrored(!isMirrored)}
      >
        {isMirrored ? "미러 모드 On" : "미러 모드 Off"}
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={playerOpacity}
        onChange={handleSliderChange}
        className={styles.rangeSlider}
        style={{
          position: "absolute",
          zIndex: 2,
          left: "10px",
          top: "10px",
        }}
      />
    </>
  );

  const renderOverlay = () => (
    <>
      <div className={styles.overlayWrapper}>
        {renderVideoPlayer(videoUrl, videoRef, playerOpacity)}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={widthSize}
          height={heightSize * 0.75}
          mirrored={isMirrored} // Apply mirrored state
          videoConstraints={{
            facingMode: "user",
            aspectRatio: 1,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        />
      </div>
      <div
        className={`${styles.mirrorToggle} ${isMirrored ? styles.active : ""}`}
        onClick={() => setIsMirrored(!isMirrored)}
      >
        {isMirrored ? "미러 모드 On" : "미러 모드 Off"}
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={playerOpacity}
        onChange={handleSliderChange}
        className={styles.rangeSlider}
        style={{
          position: "absolute",
          zIndex: 3,
          left: "10px",
          top: "10px",
        }}
      />
    </>
  );

  return (
    <section className={styles["record-page"]}>
      <button
        className={`${styles.glowingBtn} ${isRecording ? styles.active : ""}`}
      >
        <span className={styles.glowingTxt}>ON AIR</span>
      </button>
      <ArrowBackIcon
        fontSize="large"
        className={styles.backButton}
        onClick={handleBackClick}
      />
      <div
        className={styles.playerWrapper}
        onMouseEnter={() => {
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setShowControls(false);
        }}
      >
        {recordVideo
          ? renderVideoPlayer(recordVideo, videoRef)
          : version === "sideBySide"
          ? renderSideBySide()
          : renderOverlay()}
      </div>
      {capturing ? (
        <article className={styles["record-btn"]}>
          <button
            className={styles["record-stop"]}
            onClick={() => {
              handleStopCaptureClick();
              setVersion(null); // Hide version buttons after stopping the recording
            }}
          >
            　
          </button>
        </article>
      ) : (
        <article className={styles["record-btn"]}>
          <button
            className={styles["record-start"]}
            onClick={handleStartCaptureClick}
          >
            　
          </button>
        </article>
      )}
      {recordVideo && (
        <article className={styles["record-button"]}>
          <div
            className={styles["record-button__cancle"]}
            onClick={reRecord}
            onTouchEnd={reRecord}
          >
            <VideocamIcon />
            다시촬영
          </div>
          <div
            className={styles["record-button__save"]}
            onClick={resultHandler}
          >
            {!isLoading && <CheckIcon />}
            {isLoading && <div className={styles.spinner}></div>}
            평가하기
          </div>
        </article>
      )}
      {!recordVideo && (
        <div className={styles.versionToggle}>
          <div
            className={`${styles.toggleButton} ${version === "sideBySide" ? styles.active : ""}`}
            onClick={() => setVersion("sideBySide")}
          >
            사이드
          </div>
          <div
            className={`${styles.toggleButton} ${version === "overlay" ? styles.active : ""}`}
            onClick={() => setVersion("overlay")}
          >
            오버레이
          </div>
        </div>
      )}
    </section>
  );
};
