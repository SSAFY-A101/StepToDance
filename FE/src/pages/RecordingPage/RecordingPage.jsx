import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import RecordRTC from "recordrtc";
import ReactPlayer from "react-player";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { guideResult } from "../../api/GuideApis";

export const WebcamStreamCapture = () => {
  const [layout, setLayout] = useState("overlay");
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const webcamRef = useRef(null);
  const [recordRTC, setRecordRTC] = useState(null);
  const [playerOpacity, setPlayerOpacity] = useState(1);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordVideo, setRecordVideo] = useState("");
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const guideId = location.state?.guideId;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSliderChange = (e) => {
    const newOpacity = e.target.value;
    setPlayerOpacity(newOpacity);
    const hueRotation = newOpacity * 360;
    document.documentElement.style.setProperty("--slider-hue", `${hueRotation}deg`);
  };

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      setWidthSize(currentWidth);
      setHeightSize(currentHeight);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = currentWidth;
        canvas.height = currentHeight;
      }
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

  function formatTime(date) {
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      setRecordVideo(url);
    }
  }, [recordedChunks]);

  useEffect(() => {
    console.log("Video URL:", videoUrl);
  }, [videoUrl]);

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
    const confirmBack = window.confirm("해당 페이지에서 벗어나게 되면 녹화된 영상이 삭제됩니다.\n정말 나가시겠습니까?");
    if (confirmBack) {
      navigate(-1);
    }
  };

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
      {recordVideo ? (
        <>
          <ReactPlayer
            controls
            url={recordVideo}
            type="video/mp4"
            width={widthSize}
            height={heightSize * 0.9}
            autoPlay
            playsinline={true}
          />
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
        </>
      ) : (
        <>
          <div style={{ width: "100%" }}>
            <ReactPlayer
              ref={videoRef}
              url={videoUrl}
              loop
              muted
              controls
              width={widthSize}
              height={heightSize * 0.75}
              autoPlay
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: "75%",
                objectFit: "cover",
                opacity: playerOpacity,
                display: showVideo ? "block" : "none",
              }}
              playsinline={true}
              type="video/mp4"
            />
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={widthSize}
              height={heightSize * 0.75}
              mirrored={false}
              videoConstraints={{
                facingMode: "user",
                aspectRatio: 1
              }}
            />
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
                filter: `hue-rotate(${playerOpacity * 360}deg)`,
              }}
            />
            {capturing ? (
              <article className={styles["record-btn"]}>
                <button
                  className={styles["record-stop"]}
                  onClick={handleStopCaptureClick}
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
          </div>
        </>
      )}
    </section>
  );
};
