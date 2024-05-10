import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import { useLocation } from "react-router-dom";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs-backend-webgl";

export const WebcamStreamCapture = () => {
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);

  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const videoRef = useRef(null);
  const [opacity, setOpacity] = useState(100); // 상태로 opacity 관리
  const opacityRef = useRef(100); // useRef를 사용하여 opacity 값을 저장
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showVideo, setShowVideo] = useState("");

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.src = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
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
    startPreview();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    const mediaRef = new MediaRecorder(mediaStream, {
      mimeType: "video/webm",
    });

    mediaRef.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };

    mediaRef.start();
    setRecording(true);
  }, [mediaStream]);

  const stopRecording = () => {
    mediaStream.getTracks().forEach((track) => track.stop());
  };
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(recordedBlob);
      setMediaStream(null);
      setRecording(false);
      setRecordedChunks([]);
      setShowVideo(videoUrl);
    }
  }, [recordedChunks]);
  // return (
  //   <div>
  //     {/* {mediaStream && !recording && (
  //       <button onClick={handleStartCaptureClick}>녹화 시작</button>
  //     )}
  //     {mediaStream && recording && (
  //       <>
  //         <button onClick={stopRecording}>녹화 중지</button>
  //       </>
  //     )} */}
  //     {mediaStream && (
  //       <video autoPlay muted ref={videoRef} width="400" height="300" />
  //     )}
  //     {showVideo ? (
  //       <video autoPlay muted src={showVideo} width="400" height="300" />
  //     ) : null}
  //   </div>
  // );
  // const handleDataAvailable = useCallback(
  //   ({ data }) => {
  //     if (data.size > 0) {
  //       setRecordedChunks((prev) => prev.concat(data));
  //     }
  //   },
  //   [setRecordedChunks]
  // );

  // useEffect(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/mp4",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     setRecordVideo(url);
  //   }
  // }, [recordedChunks]);

  // const handleStopCaptureClick = useCallback(() => {
  //   mediaRecorderRef.current.stop();
  //   setCapturing(false);
  // }, [mediaRecorderRef]);

  // useEffect(() => {
  //   opacityRef.current = opacity; // 상태가 변경될 때마다 ref를 업데이트
  //   let animationFrameId;
  //   async function loadAndApplyModel() {
  //     const net = await bodyPix.load({
  //       architecture: "MobileNetV1",
  //       outputStride: 16,
  //       multiplier: 0.5,
  //       quantBytes: 2,
  //     });

  //     const video = videoRef.current;
  //     const canvas = canvasRef.current;
  //     let frameCount = 0;
  //     const skipFrames = 5;

  //     function updateCanvas() {
  //       if (video.paused || video.ended) return;
  //       if (++frameCount % skipFrames === 0) {
  //         net
  //           .segmentPerson(video, {
  //             flipHorizontal: false,
  //             internalResolution: "medium",
  //             segmentationThreshold: 0.5,
  //           })
  //           .then((segmentation) => {
  //             const foregroundColor = { r: 255, g: 255, b: 255, a: 0 }; // Foreground transparent
  //             const backgroundColor = { r: 255, g: 255, b: 255, a: 255 }; // Background white and opaque
  //             const mask = bodyPix.toMask(
  //               segmentation,
  //               foregroundColor,
  //               backgroundColor
  //             );
  //             canvas.width = video.videoWidth;
  //             canvas.height = video.videoHeight;
  //             // const mask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor);
  //             bodyPix.drawMask(canvas, video, mask, 1, 0, false);
  //           });
  //       }
  //       animationFrameId = requestAnimationFrame(updateCanvas);
  //     }

  //     video.addEventListener("loadeddata", () => {
  //       video.play();
  //       updateCanvas();
  //     });

  //     return () => {
  //       if (animationFrameId) {
  //         cancelAnimationFrame(animationFrameId);
  //       }
  //       video.removeEventListener("loadeddata", updateCanvas);
  //       net.dispose();
  //     };
  //   }

  //   if (videoRef.current && canvasRef.current) {
  //     loadAndApplyModel();
  //   }
  // }, [opacity, widthSize, heightSize]); // opacity를 의존성 배열에 포함시켜서 변경 감지

  return (
    <section className={styles["record-page"]}>
      {showVideo ? (
        <>
          <video
            controls
            src={showVideo}
            width={widthSize}
            height={heightSize * 0.8}
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
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            style={{
              zIndex: 3,
              position: "absolute",
              top: 50,
              right: 100,
            }}
          />
          {/* <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            controls
            autoPlay
            style={{
              position: "absolute",
              zIndex: 1,
              width: "100%",
              height: "75%",
              objectFit: "cover",
              opacity: opacity / 100,
              display: showVideo ? "block" : "none",
            }}
            type="video/mp4"
          /> */}
          {/* <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              zIndex: 2,
              width: "100%",
              height: "75%",
              objectFit: "cover",
              opacity: opacity / 100,
            }}
          /> */}
          {/* <canvas ref={canvasRef} style={{ width: '100%' }} /> */}
          <Webcam
            autoPlay
            ref={videoRef}
            width={widthSize}
            height={heightSize}
            videoConstraints={{ aspectRatio: 9 / 16 }}
          />
          {mediaStream && recording && (
            <article className={styles["record-btn"]}>
              <button
                className={styles["record-stop"]}
                onClick={stopRecording}
              ></button>
            </article>
          )}
          {mediaStream && !recording && (
            <article className={styles["record-btn"]}>
              <button
                className={styles["record-start"]}
                onClick={handleStartCaptureClick}
              ></button>
            </article>
          )}
        </>
      )}
    </section>
  );
};
