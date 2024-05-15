import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailFeedback.module.css"; // Import CSS module
import { getFeedbackDetail } from "../../api/FeedbackApis";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

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
      guidePlayerRef.current.seekTo(0);
      uploadPlayerRef.current.seekTo(0);
      setEnded(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>피드백 상세 정보</h2>
      {feedbackDetail && (
        <div>
          <p className={styles.score}>Score: {feedbackDetail.feedback.score}</p>
          <div className={styles.playersWrapper}>
            <ReactPlayer
              url={feedbackDetail.feedback.guide_url}
              ref={guidePlayerRef}
              playing={isPlaying}
              width={widthSize}
              height={heightSize * 0.35}
              onEnded={handleVideoEnded}
              controls={false}
              className={styles.player}
              playsinline={true}
            />
            <ReactPlayer
              url={feedbackDetail.feedback.video_url}
              ref={uploadPlayerRef}
              playing={isPlaying}
              width={widthSize}
              muted={true}
              height={heightSize * 0.35}
              onEnded={handleVideoEnded}
              controls={false}
              className={styles.player}
              playsinline={true}
            />
            <div className={styles.controlsOverlay}>
              <div className={styles.playButton} onClick={handlePlayPause}>
                {ended ? (
                  <PlayArrowIcon fontSize="large" />
                ) : isPlaying ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayArrowIcon fontSize="large" />
                )}
              </div>
            </div>
          </div>
          <p>
            Highlight Section: {feedbackDetail.feedback.highlight_section_start_at} - {feedbackDetail.feedback.highlight_section_end_at}
          </p>
          <h3>Incorrect Sections</h3>
          <ul>
            {feedbackDetail.incorrect_section_list.length > 0 ? (
              feedbackDetail.incorrect_section_list.map((section, index) => (
                <li key={index}>Start at: {section.start_at}</li>
              ))
            ) : (
              <li>No incorrect sections</li>
            )}
          </ul>
          <button onClick={() => navigate("/feedbacks", { state: { initialFeedbacks } })} className={styles.backButton}>
            Back to Feedback List
          </button>
          <button onClick={()=> navigate("/videoeditor", {
            state: {
              guideId : feedbackDetail.feedback.guide_url.match(/\/(\d+)\.mp4$/)[1],
              videoUrl : feedbackDetail.feedback.video_url,
              highlightStartAt : feedbackDetail.feedback.highlight_section_start_at,
              highlightEndAt : feedbackDetail.feedback.highlight_section_end_at,
            }
            })} className={styles.editorButton}>
            편집하기
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailFeedback;
