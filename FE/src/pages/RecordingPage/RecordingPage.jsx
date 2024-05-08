import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import { useLocation } from "react-router-dom";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs-backend-webgl";

export const WebcamStreamCapture = () => {
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordVideo, setRecordVideo] = useState("");
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  const handleResize = () => {
    setWidthSize(window.innerWidth);
    setHeightSize(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [widthSize, heightSize]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

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

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  return (
    <section className={styles["record-page"]}>
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
            <button className={styles["record-button__cancle"]}>
              다시촬영
            </button>
            <button className={styles["record-button__save"]}>평가하기</button>
          </article>
        </>
      ) : (
        <>
          <video
            src={videoUrl}
            loop
            muted
            controls
            autoPlay
            width={widthSize}
            height={heightSize}
            style={{ position: "absolute", zIndex: 1 }}
            type="video/mp4"
          />
          <Webcam
            audio={false}
            ref={webcamRef}
            width={widthSize}
            height={heightSize}
            videoConstraints={{ aspectRatio: 9 / 16 }}
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
