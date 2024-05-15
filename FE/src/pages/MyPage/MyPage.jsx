import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/UserSlice";
import { removeCookie, getCookie } from "../../cookie";
import styles from "./MyPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserDatas } from "../../api/UserApis";
import { getFeedbackDetail } from "../../api/FeedbackApis";
import ReactPlayer from "react-player";

const MyPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [shortsList, setShortsList] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const limit = 30;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDatas(limit, 0);
        console.log(data.data)
        setProfile(data.data.user || {});
        setFeedbackList(data.data.feedback_list || []);
        setShortsList(data.data.shortform_list.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchFeedbackDetail = async (feedbackId) => {
    try {
      const data = await getFeedbackDetail(feedbackId);
      setSelectedFeedback(data.data.feedback);
      console.log(data);
    } catch (error) {
      console.error("Error fetching feedback detail:", error);
    }
  };

  const signOut = async () => {
    try {
      const accessToken = getCookie("accessToken");
      const response = await axios.post(
        "https://k10a101.p.ssafy.io/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        console.log("Logout successful:");
        removeCookie("accessToken", { path: "/" });
        removeCookie("refreshToken", { path: "/" });
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  useEffect(() => {
    const nav = document.getElementById("js-nav");
    const pointer = document.getElementById("js-pointer");
    const links = nav.getElementsByTagName("a");

    pointer.style.width = `calc(100% / ${links.length} - 0.5em)`;

    for (let i = 0; i < links.length; i++) {
      const current = links[i];
      current.dataset.order = i * 100 + "%";
      current.addEventListener("click", movePointer);
    }

    function movePointer(e) {
      const order = e.currentTarget.dataset.order;
      pointer.style.transform = `translate3d(${order},0,0)`;
    }
  }, []);

  const handleFeedbackClick = (feedbackId) => {
    navigate(`/feedback/${feedbackId}`, { state: { initialFeedbacks: feedbackList } });
  };


  const totalScore = profile.score || 0;
  const feedbackCount = feedbackList.length;
  const averageScore = feedbackCount > 0 ? (totalScore / feedbackCount).toFixed(2) : 0;

  return (
    <div className={styles.safeArea}>
      <div className={styles.title}>MYPAGE</div>
      <div className={styles.profileView}>
        <img
          src={profile.profile_img_url}
          alt="Profile"
          className={styles.profileImage}
        />
        <button onClick={signOut} className={styles.logoutButton}>
          로그아웃
        </button>
        <div className={styles.headerView}>
          <div className={styles.username}>{profile.nickname || "No Name"}</div>
          <p className={styles.rankAndPoints}>
            RANK {profile.user_rank || 9999}
          </p>
        </div>
      </div>
      <nav className={styles.nav} id="js-nav">
        <div id="js-pointer" className={styles.nav__pointer}></div>
        <ul className={styles.nav__list}>
          <li>
            <a href="#" onClick={() => setActiveTab("home")}>
              Home
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveTab("feedback")}>
              Feedback
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveTab("shorts")}>
              Shorts
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.card}>
        <section className={styles.content}>
          {activeTab === "home" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabPrimary}`}>
                Home
              </h2>
              <p>Welcome to your profile!</p>
              <div>Rank: {profile.user_rank}위</div>
              <div>총점: {totalScore}</div>
              <div>평균 점수: {averageScore}</div>
            </div>
          )}
          {activeTab === "feedback" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabSuccess}`}>
                피드백 영상
              </h2>
              <div className={styles.feedbackContainer}>
                <button className={styles.arrowButton} onClick={() => document.getElementById('feedbackList').scrollBy({ left: -200, behavior: 'smooth' })}>{"<"}</button>
                <div className={styles.feedbackList} id="feedbackList">
                  {feedbackList.slice(0, limit).map((feedback) => (
                    <div key={feedback.id} className={styles.feedbackItem} onClick={() => handleFeedbackClick(feedback.id)}>
                      <div className={styles.videoDate}>
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </div>
                      <img
                        src={feedback.thumbnail_img_url}
                        alt="Thumbnail"
                        className={styles.thumbnailImage}
                      />
                      <div className={styles.guideDetail}>
                        {feedback.guide_title} - {feedback.guide_singer}
                      </div>
                    </div>
                  ))}
                </div>
                <button className={styles.arrowButton} onClick={() => document.getElementById('feedbackList').scrollBy({ left: 50, behavior: 'smooth' })}>{">"}</button>
              </div>
              <div
                onClick={() => navigate("/feedbacks", { state: { initialFeedbacks: feedbackList } })}
                className={styles.viewAllButton}
              >
                피드백 전체 리스트 보기
              </div>
            </div>
          )}
          {activeTab === "shorts" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabDefault}`}>
                Shorts
              </h2>
              <div className={styles.shortsList}>
                {shortsList.length > 0 ? (
                  shortsList.map((shorts) => (
                    <div key={shorts.id} className={styles.shortsItem}>
                      <div className={styles.videoDate}>
                        {new Date(shorts.created_at).toLocaleDateString()}
                      </div>
                      <ReactPlayer
                        className={styles.videoThumbnail}
                        url={shorts.video_url}
                        width="100%"
                        controls
                        playsinline
                      />
                      <div className={styles.guideDetail}>
                        {shorts.song_title} - {shorts.singer}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>생성한 숏츠가 존재하지 않습니다.</p>
                )}
              </div>
            </div>
          )}
        </section>
        {selectedFeedback && (
          <div className={styles.feedbackDetailModal}>
            <h2>피드백 상세 정보</h2>
            <p>Score: {selectedFeedback.score}</p>
            <ReactPlayer url={selectedFeedback.video_url} playsinline controls />
            <p>Guide Video:</p>
            <ReactPlayer url={selectedFeedback.guide_url} playsinline controls />
            <p>
              Highlight Section: {selectedFeedback.highlight_section_start_at} -{" "}
              {selectedFeedback.highlight_section_end_at}
            </p>
            <h3>Incorrect Sections</h3>
            <ul>
              {selectedFeedback.incorrect_section_list ? (
                selectedFeedback.incorrect_section_list.map((section, index) => (
                  <li key={index}>Start at: {section.start_at}</li>
                ))
              ) : (
                <li>No incorrect sections</li>
              )}
            </ul>
            <button onClick={() => setSelectedFeedback(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
