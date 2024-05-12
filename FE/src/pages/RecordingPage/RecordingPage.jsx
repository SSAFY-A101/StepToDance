import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import { useLocation } from "react-router-dom";
import RecordRTC from "recordrtc";
import ReactPlayer from "react-player";
import { AspectRatio } from "@mui/icons-material";

export const WebcamStreamCapture = () => {
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const webcamRef = useRef(null);
  const [recordRTC, setRecordRTC] = useState(null);
  const [playerOpacity, setPlayerOpacity] = useState(1);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordVideo, setRecordVideo] = useState("");
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true); // Set it true for testing
  const [isRecording, setIsRecording] = useState(false); // New state for recording status

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
    handleResize(); // 초기 로딩시에도 크기를 설정합니다.

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        const recorder = new RecordRTC(stream, {
          type: "video",
        });
        recorder.startRecording();
        setRecordRTC(recorder);
      })
      .catch(function (error) {
        console.error("Error accessing the media devices.", error);
      });
  };

  const handleStartCaptureClick = useCallback(() => {
    setIsRecording(true);
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      const videoStream = webcamRef.current.stream;
      const options = {
        type: "video",
        mimeType: "video/webm",
      };
      const recorder = new RecordRTC(videoStream, options);
      recorder.startRecording();
      setRecordRTC(recorder);
    }
  }, [webcamRef.current, setIsRecording]); // Added dependency to ensure it re-evaluates if necessary

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

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
    console.log("Video URL:", videoUrl); // Check if the URL is correct
  }, [videoUrl]);

  const handleStopCaptureClick = useCallback(() => {
    setIsRecording(false);
    if (recordRTC) {
      recordRTC.stopRecording(() => {
        const videoUrl = recordRTC.toURL();
        setRecordVideo(videoUrl);
        setCapturing(false);
        recordRTC.destroy();
        setRecordRTC(null);
      });
    }
  }, [recordRTC, setIsRecording]);

  const reRecord = () => {
    setRecordVideo("");
  };

  return (
    <section className={styles["record-page"]}>
      <button
        className={`${styles.glowingBtn} ${isRecording ? styles.active : ""}`}
      >
        <span className={styles.glowingTxt}>ON AIR</span>
      </button>
      {recordVideo ? (
        <>
          <video
            controls
            src={recordVideo}
            type="video/mp4"
            width={widthSize}
            height={heightSize * 0.9}
          />
          <article className={styles["record-button"]}>
            <button
              className={styles["record-button__cancle"]}
              onClick={() => reRecord()}
            >
              다시촬영
            </button>
            <button className={styles["record-button__save"]}>평가하기</button>
          </article>
        </>
      ) : (
        <>
          <ReactPlayer
            ref={videoRef}
            url={videoUrl}
            loop
            muted
            controls
            width={widthSize}
            height={heightSize * 0.8}
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
          {/* <canvas ref={canvasRef} style={{ width: '100%' }} /> */}
          <Webcam
            audio={true}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={widthSize}
            height={heightSize * 0.8}
            videoConstraints={{
              facingMode: "user",
              aspectRatio: widthSize / (heightSize * 0.8),
            }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={playerOpacity}
            onChange={(e) => setPlayerOpacity(e.target.value)}
            style={{
              position: "absolute",
              zIndex: 2,
              left: "10px",
              top: "10px",
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
        </>
      )}
    </section>
  );
};
