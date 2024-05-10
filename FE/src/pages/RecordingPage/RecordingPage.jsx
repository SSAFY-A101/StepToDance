import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./RecordingPage.module.css";
import { useLocation } from "react-router-dom";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs-backend-webgl";

export const WebcamStreamCapture = () => {
  // const [widthSize, setWidthSize] = useState(window.innerWidth);
  // const [heightSize, setHeightSize] = useState(window.innerHeight);
  // const webcamRef = useRef(null);
  // const mediaRecorderRef = useRef(null);
  // const [capturing, setCapturing] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState([]);
  // const [recordVideo, setRecordVideo] = useState("");
  // const location = useLocation();
  // const videoUrl = location.state?.videoUrl;
  // const videoRef = useRef(null);
  // const [opacity, setOpacity] = useState(100); // 상태로 opacity 관리
  // const opacityRef = useRef(100); // useRef를 사용하여 opacity 값을 저장
  // const canvasRef = useRef(null);

  // const [showVideo, setShowVideo] = useState(false); // 비디오 표시 상태

  // useEffect(() => {
  //   const handleResize = () => {
  //     const currentWidth = window.innerWidth;
  //     const currentHeight = window.innerHeight;
  //     setWidthSize(currentWidth);
  //     setHeightSize(currentHeight);

  //     const canvas = canvasRef.current;
  //     if (canvas) {
  //       canvas.width = currentWidth;
  //       canvas.height = currentHeight;
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // 초기 로딩시에도 크기를 설정합니다.

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // const handleStartCaptureClick = useCallback(() => {
  //   setCapturing(true);
  //   mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
  //     mimeType: "video/webm",
  //   });
  //   mediaRecorderRef.current.addEventListener(
  //     "dataavailable",
  //     handleDataAvailable
  //   );
  //   mediaRecorderRef.current.start();
  // }, [webcamRef, mediaRecorderRef]);

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

  // return (
  //   <section className={styles["record-page"]}>
  //     {recordVideo ? (
  //       <>
  //         <video
  //           controls
  //           src={recordVideo}
  //           width={widthSize}
  //           height={heightSize * 0.9}
  //         />
  //         <article className={styles["record-button"]}>
  //           <button className={styles["record-button__cancle"]}>
  //             다시촬영
  //           </button>
  //           <button className={styles["record-button__save"]}>평가하기</button>
  //         </article>
  //       </>
  //     ) : (
  //       <>
  //         <input
  //           type="range"
  //           min="0"
  //           max="100"
  //           value={opacity}
  //           onChange={(e) => setOpacity(parseInt(e.target.value))}
  //           style={{
  //             zIndex: 3,
  //             position: "absolute",
  //             top: 50,
  //             right: 100,
  //           }}
  //         />
  //         <video
  //           ref={videoRef}
  //           src={videoUrl}
  //           loop
  //           muted
  //           controls
  //           autoPlay
  //           style={{
  //             position: "absolute",
  //             zIndex: 1,
  //             width: "100%",
  //             height: "75%",
  //             objectFit: "cover",
  //             opacity: opacity / 100,
  //             display: showVideo ? "block" : "none",
  //           }}
  //           type="video/mp4"
  //         />
  //         <canvas
  //           ref={canvasRef}
  //           style={{
  //             position: "absolute",
  //             zIndex: 2,
  //             width: "100%",
  //             height: "75%",
  //             objectFit: "cover",
  //             opacity: opacity / 100,
  //           }}
  //         />
  //         {/* <canvas ref={canvasRef} style={{ width: '100%' }} /> */}
  //         <Webcam
  //           className={styles.video}
  //           audio={false}
  //           ref={webcamRef}
  //           width={widthSize}
  //           height={heightSize * 0.8}
  //           videoConstraints={{
  //             // { exact: "environment" }
  //             facingMode: "user",
  //             aspectRatio: 9 / 16,
  //           }}
  //         />
  //         {capturing ? (
  //           <article className={styles["record-btn"]}>
  //             <button
  //               className={styles["record-stop"]}
  //               onClick={handleStopCaptureClick}
  //             >
  //
  //             </button>
  //           </article>
  //         ) : (
  //           <article className={styles["record-btn"]}>
  //             <button
  //               className={styles["record-start"]}
  //               onClick={handleStartCaptureClick}
  //             >
  //
  //             </button>
  //           </article>
  //         )}
  //       </>
  //     )}
  //   </section>
  // );
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showVideo, setShowVideo] = useState();
  const mediaRef = useRef(null);
  const videoRef = useRef(null);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  useEffect(() => {
    startPreview();
  }, []);

  const startRecording = () => {
    mediaRef.current = new MediaRecorder(videoRef, {
      mimeType: "video/webm",
    });
    console.log(mediaRef);
    mediaRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };

    mediaRef.current.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
      console.log(recordedBlob, recordedChunks);
      const videoUrl = URL.createObjectURL(recordedBlob);

      setMediaStream(null);
      setRecording(false);
      setRecordedChunks([]);
      setShowVideo(videoUrl);
    };

    mediaRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  return (
    <div>
      {!mediaStream && (
        <button onClick={startPreview}>카메라 미리 보기 시작</button>
      )}
      {mediaStream && !recording && (
        <button onClick={startRecording}>녹화 시작</button>
      )}
      {mediaStream && recording && (
        <>
          <button onClick={stopRecording}>녹화 중지</button>
        </>
      )}
      {mediaStream && (
        <video autoPlay muted ref={videoRef} width="400" height="300" />
      )}
      {showVideo && (
        <video autoPlay muted src={showVideo} width="400" height="300" />
      )}
    </div>
  );
};
