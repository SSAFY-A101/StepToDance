import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FeedbackList.module.css"; // Import CSS module
import { getUserDatas } from "../../api/UserApis"; // import deleteFeedback
import { deleteFeedback } from "../../api/FeedbackApis";

const FeedBackList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialFeedbacks = location.state?.initialFeedbacks || [];
  const [feedbackList, setFeedbackList] = useState(initialFeedbacks);
  const [loading, setLoading] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(initialFeedbacks.length > 0 ? 1 : 0);
  const [initialLoad, setInitialLoad] = useState(initialFeedbacks.length === 0);

  const limit = 10;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getUserDatas(limit, feedbackPage * limit);
        setFeedbackList((prevFeedback) => [...prevFeedback, ...data.data.feedback_list]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
      }
    };

    if (initialLoad) {
      fetchFeedbacks();
    }
  }, [feedbackPage, initialLoad]);

  const fetchMoreFeedbacks = () => {
    setFeedbackPage((prevPage) => prevPage + 1);
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      setFeedbackList((prevFeedback) => prevFeedback.filter((feedback) => feedback.id !== feedbackId));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleDetail = (feedbackId) => {
    navigate(`/feedback/${feedbackId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>피드백 전체 리스트</h2>
      <div className={styles.feedbackList}>
        {feedbackList.map((feedback) => (
          <div key={feedback.id} className={styles.feedbackItem}>
            <div className={styles.videoDate}>
              {new Date(feedback.created_at).toLocaleDateString()}
            </div>
            <img
              src={feedback.thumbnail_img_url}
              alt="Thumbnail"
              className={styles.thumbnailImage}
              onClick={() => handleDetail(feedback.id)}
            />
            <div className={styles.guideDetail}>
              {feedback.guide_title} - {feedback.guide_singer}
            </div>
            <button onClick={() => handleDelete(feedback.id)} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {loading && <p>Loading more feedbacks...</p>}
      <button onClick={fetchMoreFeedbacks} className={styles.loadMoreButton}>
        Load More
      </button>
      <button onClick={() => navigate("/mypage")} className={styles.backButton}>
        Back to MyPage
      </button>
    </div>
  );
};

export default FeedBackList;
