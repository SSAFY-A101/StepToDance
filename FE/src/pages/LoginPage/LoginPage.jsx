import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { getCookie } from "../../cookie";
import Kakaologo from "../../assets/images/kakao_login_medium_narrow.png";
const LoginPage = () => {
  const KAKAO_KEY = import.meta.env.VITE_APP_KAKAO_KEY;
  const KAKAO_REDIRECT_URL = import.meta.env.VITE_APP_KAKAO_REDIRECT_URL;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = getCookie("accessToken");
    setIsLoggedIn(!!token);
  };

  const handleKakaoLogin = () => {
    console.log("Navigating to:", KAKAO_AUTH_URL); // Log the URL to check its correctness
    window.location.href = KAKAO_AUTH_URL;
    console.log(KAKAO_KEY);
    console.log("l");
    console.log(KAKAO_REDIRECT_URL);
  };

  return (
    <div className={styles.mainView}>
      <div className={styles.gradientView}>
        <h1 className={styles.appTitle}>STEP</h1>
      </div>
      <div className={styles.middleView}>
        <h2 className={styles.appSubtitle}>TO</h2>
      </div>
      <div className={styles.gradientView}>
        <h1 className={styles.appTitle}>DANCE</h1>
      </div>
      <div className={styles.bottomView}>
        {isLoggedIn ? (
          <div>
            <h1 className={styles.heading}>Welcome!</h1>
            <button
              className={styles.button2}
              onClick={() => navigate("/home")}
            >
              Enter Home
            </button>
          </div>
        ) : (
          <div className={styles.formView}>
            <p className={styles.infoText}>Please log in.</p>
            <div className={styles.button} onClick={handleKakaoLogin}>
              <img src={Kakaologo} alt="Log in with Kakao" />{" "}
              {/* Add style as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
