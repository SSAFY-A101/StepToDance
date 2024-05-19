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
        const data = await getUserDatas(limit, feedbackPage);
        setFeedbackList((prevFeedback) => {
          const newFeedbacks = data.data.feedback_list.filter(
            (newFeedback) => !prevFeedback.some((feedback) => feedback.id === newFeedback.id)
          );
          return [...prevFeedback, ...newFeedbacks];
        });
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

  const fetchMoreFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getUserDatas(limit, feedbackPage + 1);
      setFeedbackList((prevFeedback) => {
        const newFeedbacks = data.data.feedback_list.filter(
          (newFeedback) => !prevFeedback.some((feedback) => feedback.id === newFeedback.id)
        );
        return [...prevFeedback, ...newFeedbacks];
      });
      setLoading(false);
      setFeedbackPage((prevPage) => prevPage + 1); // feedbackPage를 업데이트하여 다음 페이지를 요청하도록 함
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
    }
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
              <div onClick={() => handleDelete(feedback.id)} className={styles.deleteButton}>
              삭제하기
            </div>
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
          </div>
        ))}
      </div>
      {loading && <p>Loading more feedbacks...</p>}
      <button onClick={fetchMoreFeedbacks} className={styles.loadMoreButton}>
        더보기
      </button>
      <button onClick={() => navigate("/mypage")} className={styles.backButton}>
        뒤로 가기
      </button>
    </div>
  );
};

export default FeedBackList;
