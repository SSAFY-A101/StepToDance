import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/UserSlice";
import { removeCookie, getCookie } from "../../cookie";
import styles from "./MyPage.module.css"; // Import CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserDatas } from "../../api/UserApis";

const MyPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [shortsList, setShortsList] = useState([]);

  const limit = 5;
  const offset = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDatas(limit, offset);
        setProfile(data.data.user || {});
        console.log(data.data);
        setFeedbackList(data.data.feedback_list || []);
        setShortsList(data.data.shorts_list || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

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
  
  return (
    <div className={styles.safeArea}>
      <div className={styles.title}>MYPAGE</div>
      <div className={styles.mainView}>
          <img
            src={profile.profile_img_url}
            alt="Profile"
            className={styles.profileImage}
          />
        <button onClick={signOut} className={styles.logoutButton}>
          로그아웃
        </button>
        <div className={styles.headerView}>
          <h1 className={styles.username}>{profile.nickname || "No Name"}</h1>
          <p className={styles.rankAndPoints}>
            RANK {profile.user_rank || 9999}
          </p>
        </div>
        {/* Feedback List */}
        <div className={styles.feedbackList}>
          <h2>Feedbacks</h2>
          {feedbackList.length > 0 ? (
            feedbackList.map((feedback) => (
              <div key={feedback.id} className={styles.feedbackItem}>
                <img src={feedback.thumbnail_img_url} alt="Thumbnail" />
                <p>{feedback.guide_title} - {feedback.guide_singer}</p>
                <p>Created at: {new Date(feedback.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No feedbacks available</p>
          )}
        </div>
        {/* Shorts List */}
        <div className={styles.shortsList}>
          <h2>Shorts</h2>
          {shortsList.length > 0 ? (
            shortsList.map((shorts) => (
              <div key={shorts.id} className={styles.shortsItem}>
                <video src={shorts.video_url} controls />
                <p>{shorts.song_title} - {shorts.singer}</p>
                <p>Uploaded by: {shorts.uploader}</p>
                <p>Created at: {new Date(shorts.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No shorts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
