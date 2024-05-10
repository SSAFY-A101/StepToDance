import React, { useRef, useEffect, useState } from "react";
import styles from './PoseVisualizer.module.css'; // 스타일 시트 불러오기

const PoseVisualizer = ({ poseData }) => {
  const canvasRef = useRef(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const drawPose = (frameData) => {
    const canvas = canvasRef.current;
    if (canvas && frameData) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(frameData)
      frameData.forEach((point) => {
        const [x, y] = point;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFrameIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % poseData.length;
        if (poseData[nextIndex]) {
          drawPose(poseData[nextIndex]);
        }
        return nextIndex;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, [poseData]);

  return (
    <div className={styles.canvasContainer}>
      <canvas ref={canvasRef} width={1600} height={900} />
    </div>
  );
};

export default PoseVisualizer;
