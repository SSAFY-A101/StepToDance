import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailFeedback.module.css"; // Import CSS module
import { getFeedbackDetail } from "../../api/FeedbackApis";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";

const DetailFeedback = () => {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialFeedbacks = location.state?.initialFeedbacks || [];
  const [feedbackDetail, setFeedbackDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const guidePlayerRef = useRef(null);
  const uploadPlayerRef = useRef(null);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [heightSize, setHeightSize] = useState(window.innerHeight);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // State to store duration
  const [highlightStyle, setHighlightStyle] = useState({});

  useEffect(() => {
    const fetchFeedbackDetail = async () => {
      try {
        const data = await getFeedbackDetail(feedbackId);
        setFeedbackDetail(data.data);
        console.log(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback detail:", error);
        setLoading(false);
      }
    };

    fetchFeedbackDetail();
  }, [feedbackId]);

  const handlePlayPause = () => {
    if (ended) {
      guidePlayerRef.current.currentTime = 0;
      uploadPlayerRef.current.currentTime = 0;
      setEnded(false);
    }
    if (isPlaying) {
      guidePlayerRef.current.pause();
      uploadPlayerRef.current.pause();
    } else {
      guidePlayerRef.current.play();
      uploadPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setEnded(true);
  };

  const handleWindowResize = () => {
    setWidthSize(window.innerWidth);
    setHeightSize(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const parseTime = (time) => {
    if (!time) return null;
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const addSeconds = (time, secondsToAdd) => {
    const timeInSeconds = parseTime(time);
    const newTimeInSeconds = timeInSeconds + secondsToAdd;
    const hours = Math.floor(newTimeInSeconds / 3600);
    const minutes = Math.floor((newTimeInSeconds % 3600) / 60);
    const seconds = newTimeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgress = () => {
    const currentTime = guidePlayerRef.current.currentTime;
    const duration = guidePlayerRef.current.duration;
    const progress = currentTime / duration;
    setProgress(progress);
    setCurrentTime(currentTime);

    if (feedbackDetail) {
      const incorrectSection = feedbackDetail.incorrect_section_list.some((section) => {
        const startAt = parseTime(section.start_at);
        const endAt = section.end_at ? parseTime(section.end_at) : startAt + 3;
        return currentTime >= startAt && currentTime <= endAt;
      });
      setHighlightStyle(incorrectSection ? { border: "2px solid red" } : { border: "1px solid #ddd" });
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(guidePlayerRef.current.duration);
  };

  const handleSeek = (event) => {
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newProgress = clickX / rect.width;
    const newTime = newProgress * guidePlayerRef.current.duration;
    guidePlayerRef.current.currentTime = newTime;
    uploadPlayerRef.current.currentTime = newTime;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>피드백 상세 정보</h2>
      {feedbackDetail && (
        <div>
          <p className={styles.score}>AI 채점 점수: {feedbackDetail.feedback.score.toFixed(2)}</p>
          <div className={styles.playersWrapper}>
            <video
              ref={guidePlayerRef}
              src={feedbackDetail.feedback.guide_url}
              width={widthSize}
              height={heightSize * 0.35}
              onEnded={handleVideoEnded}
              onTimeUpdate={handleProgress}
              onLoadedMetadata={handleLoadedMetadata}
              controls={false}
              className={styles.player}
              style={highlightStyle}
            />
            <video
              ref={uploadPlayerRef}
              src={feedbackDetail.feedback.video_url}
              width={widthSize}
              height={heightSize * 0.35}
              onEnded={handleVideoEnded}
              onTimeUpdate={handleProgress}
              onLoadedMetadata={handleLoadedMetadata}
              muted
              controls={false}
              className={styles.player}
              style={highlightStyle}
            />
            <div className={styles.controlsOverlay}>
              <div className={styles.playButton} onClick={handlePlayPause}>
                {ended ? (
                  <ReplayIcon fontSize="large" />
                ) : isPlaying ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayArrowIcon fontSize="large" />
                )}
              </div>
            </div>
          </div>
          <div className={styles.progressBarWrapper} onClick={handleSeek}>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
          <div className={styles.progressTime}>{formatTime(currentTime)}/{formatTime(duration)}</div>
          <h3 className={styles.infoTitle1}>하이라이트 구간</h3>
          <p className={styles.info}>
            {feedbackDetail.feedback.highlight_section_start_at} - {feedbackDetail.feedback.highlight_section_end_at}
          </p>
          <h3 className={styles.infoTitle2}>틀린 구간</h3>
          <ul className={styles.info}>
            {feedbackDetail.incorrect_section_list.length > 0 ? (
              feedbackDetail.incorrect_section_list.map((section, index) => (
                <li key={index}>
                  {section.start_at} ~ {addSeconds(section.start_at, 3)}
                </li>
              ))
            ) : (
              <li>No incorrect sections</li>
            )}
          </ul>
          <div className={styles.buttonWrapper}>
            <div onClick={() => navigate("/feedbacks", { state: { initialFeedbacks } })} className={styles.backButton}>
              피드백 목록
            </div>
            <div onClick={() => navigate("/videoeditor", {
              state: {
                guideId: feedbackDetail.feedback.guide_url.match(/\/(\d+)\.mp4$/)[1],
                videoUrl: feedbackDetail.feedback.video_url,
                highlightStartAt: feedbackDetail.feedback.highlight_section_start_at,
                highlightEndAt: feedbackDetail.feedback.highlight_section_end_at,
              }
            })} className={styles.editorButton}>
              편집하기
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFeedback;
