import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/UserPage.module.css"
import { getUser } from "../api/UserApis";

import { useLocation } from "react-router-dom";
function UserPage(){
    const [userData, setUserData] = useState([]);
    const [shortformList, setShortformList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const userId =
          location.pathname.split("/")[location.pathname.split("/").length - 1];
        (async () => {
          const response = await getUser(userId);
          setUserData(response.data.user);
          setShortformList(response.data.shortform_list);
        })();
      }, []);

    return (
        <div className={styles.safeArea}>
        <div className={styles.title}>MYPAGE</div>
        <div className={styles.mainView}>
            <img src={userData.profile_img_url} alt="Profile" className={styles.profileImage} />
            <div className={styles.headerView}>
            <h1 className={styles.username}>{userData.nickname || "No Name"}</h1>
            <p className={styles.rankAndPoints}>{userData.user_rank}{"\n"}{userData.score} point</p>
            </div>
        </div>
        </div>
    );
}

export default UserPage;