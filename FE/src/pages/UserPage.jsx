import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/UserPage.module.css"
import { getUser } from "../api/UserApis";
import ReactPlayer from "react-player";

import { useLocation } from "react-router-dom";
function UserPage(){
    const [userData, setUserData] = useState([]);
    const [shortsList, setShortsList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const userId =
          location.pathname.split("/")[location.pathname.split("/").length - 1];
        (async () => {
          const response = await getUser(userId);
          setUserData(response.data.user);
          setShortsList(response.data.shortform_list);
          console.log(response.data.shortform_list);
        })();
      }, []); 

    return (
        <div className={styles.safeArea}>
        <div className={styles.title}>USERPAGE</div>
        <div className={styles.mainView}>
            <img src={userData.profile_img_url} alt="Profile" className={styles.profileImage} />
            <div className={styles.headerView}>
            <h1 className={styles.username}>{userData.nickname || "No Name"}</h1>
            <p className={styles.rankAndPoints}> RANK {userData.user_rank}<br/>{userData && userData.score && userData.score.toFixed(2)} point</p>
            </div>
            <div className={styles.item}>
              <h2 className={`${styles.tabTitle} ${styles.tabDefault}`}>
                Shorts {shortsList.length}개
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
                  <p style={{color:'white'}}>올린 쇼츠가 없습니다.</p>
                )}
              </div>
            </div>
        </div>
        </div>
    );
}

export default UserPage;