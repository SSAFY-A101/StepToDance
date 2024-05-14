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
        // setFeedbackList(data.data.feedback_list.slice(0, 3) || []);
        // setShortsList(data.data.shorts_list.slice(0, 3) || []);
        const dummyFeedbackList = [
          {
            id: 1,
            thumbnail_img_url: "https://cdn.builder.io/api/v1/image/assets/TEMP/6d0d802c93619d330c11a6b36e3d6ff9e8575ab8dfa07e52cc8d66e9572f88d6?",
            guide_title: "Guide 1",
            guide_singer: "Singer 1",
            created_at: "2022-01-01"
          },
          {
            id: 2,
            thumbnail_img_url: "https://cdn.builder.io/api/v1/image/assets/TEMP/6d0d802c93619d330c11a6b36e3d6ff9e8575ab8dfa07e52cc8d66e9572f88d6?",
            guide_title: "Guide 2",
            guide_singer: "Singer 2",
            created_at: "2022-01-02"
          },
          {
            id: 3,
            thumbnail_img_url: "https://cdn.builder.io/api/v1/image/assets/TEMP/6d0d802c93619d330c11a6b36e3d6ff9e8575ab8dfa07e52cc8d66e9572f88d6?",
            guide_title: "Guide 3",
            guide_singer: "Singer 3",
            created_at: "2022-01-03"
          }
        ];
        
        const dummyShortsList = [
          {
            id: 1,
            video_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            song_title: "Song 1",
            singer: "Singer 1",
            uploader: "Uploader 1",
            created_at: "2022-01-01"
          },
          {
            id: 2,
            video_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            song_title: "Song 2",
            singer: "Singer 2",
            uploader: "Uploader 2",
            created_at: "2022-01-02"
          },
          {
            id: 3,
            video_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            song_title: "Song 3",
            singer: "Singer 3",
            uploader: "Uploader 3",
            created_at: "2022-01-03"
          }
        ];
        setFeedbackList(dummyFeedbackList);
        setShortsList(dummyShortsList);
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
          <div className={styles.username}>{profile.nickname || "No Name"}</div>
          <p className={styles.rankAndPoints}>
            RANK {profile.user_rank || 9999}
          </p>
        </div>
        {/* Feedback List */}
        <div className={styles.subtitle}>Feedbacks</div>
        <div className={styles.feedbackList}>
          {feedbackList.length > 0 ? (
            feedbackList.map((feedback) => (
              <div key={feedback.id} className={styles.feedbackItem}>
                <div className={styles.videoDate}>{new Date(feedback.created_at).toLocaleDateString()}</div>
                <img src={feedback.thumbnail_img_url} alt="Thumbnail" className={styles.thumbnailImage} />
                <div className={styles.guideDetail}>{feedback.guide_title} - {feedback.guide_singer}</div>
              </div>
            ))
          ) : (
            <p>피드백이 존재하지 않습니다.</p>
          )}
        </div>
        <div className={styles.subtitle_shorts}>Shorts</div>
        <div className={styles.shortsList}>
          {shortsList.length > 0 ? (
            shortsList.map((shorts) => (
              <div key={shorts.id} className={styles.shortsItem}>
                <div className={styles.videoDate}> {new Date(shorts.created_at).toLocaleDateString()}</div>
                <video src={shorts.video_url} controls className={styles.videoThumbnail} />
                <div className={styles.guideDetail}>{shorts.song_title} - {shorts.singer}</div>                
                {/* <p>Uploaded by: {shorts.uploader}</p> */}
              </div>
            ))
          ) : (
            <p>생성한 숏츠가 존재하지 않습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;