import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import { useLocation } from "react-router-dom";
import RecordRTC from "recordrtc";
import ReactPlayer from "react-player";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckIcon from "@mui/icons-material/Check";
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true); // Set it true for testing
  const [isRecording, setIsRecording] = useState(false); // New state for recording status
  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (e) => {
    const newOpacity = e.target.value;
    setPlayerOpacity(newOpacity);
    const hueRotation = newOpacity * 360; // Adjust the rotation scale if necessary
    document.documentElement.style.setProperty(
      "--slider-hue",
      `${hueRotation}deg`
    );
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
    handleResize(); // 초기 로딩시에도 크기를 설정합니다.

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const startRecording = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then(function (stream) {
  //       if (webcamRef.current) {
  //         webcamRef.current.srcObject = stream;
  //       }
  //       const recorder = new RecordRTC(stream, {
  //         type: "video",
  //       });
  //       recorder.startRecording();
  //       setRecordRTC(recorder);
  //     })
  //     .catch(function (error) {
  //       console.error("Error accessing the media devices.", error);
  //     });
  // };

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

  // const handleDataAvailable = useCallback(
  //   ({ data }) => {
  //     if (data.size > 0) {
  //       setRecordedChunks((prev) => prev.concat(data));
  //     }
  //   },
  //   [setRecordedChunks]
  // );

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
    console.log("Video URL:", videoUrl); // Check if the URL is correct
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
    const res = await fetch(recordVideo)
      .then((response) => response.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("video", blob, "video.mp4");
        formData.append("start_at", start);
        formData.append("end_at", end);

        return formData;
      });

    const response = await guideResult(res);
    console.log(response);

    setIsLoading(!isLoading);
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
            autoPlay
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
            {/* <canvas ref={canvasRef} style={{ width: '100%' }} /> */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={widthSize}
              height={heightSize * 0.75}
              mirrored={false}
              videoConstraints={{
                facingMode: "user",
                aspectRatio: 1.77778,
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
