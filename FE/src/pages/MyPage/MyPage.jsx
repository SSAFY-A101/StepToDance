import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/UserSlice";
import { removeCookie, getCookie } from "../../cookie";
import styles from "./MyPage.module.css"; // Import CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserDatas } from "../../api/UserApis";
import ReactPlayer from "react-player";

const MyPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [shortsList, setShortsList] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  const limit = 5;
  const offset = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDatas(limit, offset);
        setProfile(data.data.user || {});
        setFeedbackList(data.data.feedback_list.slice(0, 3) || []);
        setShortsList(data.data.shortform_list.slice(0, 3) || []);
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
          <li><a href="#" onClick={() => setActiveTab("home")}>Home</a></li>
          <li><a href="#" onClick={() => setActiveTab("feedback")}>Feedback</a></li>
          <li><a href="#" onClick={() => setActiveTab("shorts")}>Shorts</a></li>
        </ul>
      </nav>
      <div className={styles.card}>
        <section className={styles.content}>
          {activeTab === "home" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabPrimary}`}>Home</h2>
              <p>Welcome to your profile!</p>
            </div>
          )}
          {activeTab === "feedback" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabSuccess}`}>Feedbacks</h2>
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
            </div>
          )}
          {activeTab === "shorts" && (
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabDefault}`}>Shorts</h2>
              <div className={styles.shortsList}>
                {shortsList.length > 0 ? (
                  shortsList.map((shorts) => (
                    <div key={shorts.id} className={styles.shortsItem}>
                      <div className={styles.videoDate}>{new Date(shorts.created_at).toLocaleDateString()}</div>
                      <ReactPlayer 
                        className={styles.videoThumbnail} 
                        url={shorts.video_url} 
                        controls 
                      />
                      <div className={styles.guideDetail}>{shorts.song_title} - {shorts.singer}</div>
                    </div>
                  ))
                ) : (
                  <p>생성한 숏츠가 존재하지 않습니다.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyPage;
