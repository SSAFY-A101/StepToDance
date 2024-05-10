import { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import Models from "../../components/Models/Models";
import { useNavigate } from "react-router";
import { getCookie } from "../../cookie";
import Kakaologo from "../../assets/images/kakao_login_medium_narrow.png";

const LandingPage = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentBox, setCurrentBox] = useState(1);
  const [playVideo, setPlayVideo] = useState(false);

  // 카카오 로그인

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

  useEffect(() => {
    let timeout;
    if (isClicked) {
      timeout = setTimeout(() => {
        if (currentBox < 10) {
          setCurrentBox((prev) => prev + 1);
        } else if (currentBox === 10) {
          // After the last box animation, wait for its duration before playing the video
          setTimeout(() => {
            setPlayVideo(true);
          }, 400); // Adjust this time to match the end of the box10 animation
        }
        const select = document.querySelector(`#box${currentBox}`);
        select.style.display = "none";
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [isClicked, currentBox]);

  const clickHandler = () => {
    setIsClicked(true);
  };
  return (
    <section
      className={
        isClicked ? styles["landing-page-click"] : styles["landing-page"]
      }
      onClick={clickHandler}
    >
      <div className={styles["landingpage-title"]}>
        <span>STEP</span>
        <span>To</span>
        <span>Dance</span>
      </div>
      <div className={styles.first}>
        <div
          id="box1"
          className={isClicked ? styles["box1"] : styles["first-box"]}
        ></div>
        <div
          id="box2"
          className={isClicked ? styles["box2"] : styles["second-box"]}
        ></div>
        <div
          id="box3"
          className={isClicked ? styles["box3"] : styles["third-box"]}
        ></div>
        <div
          id="box4"
          className={isClicked ? styles["box4"] : styles["fourth-box"]}
        ></div>
        <div
          id="box5"
          className={isClicked ? styles["box5"] : styles["fifth-box"]}
        ></div>
        <div
          id="box6"
          className={isClicked ? styles["box6"] : styles["sixth-box"]}
        ></div>
        <div
          id="box7"
          className={isClicked ? styles["box7"] : styles["seventh-box"]}
        ></div>
        <div
          id="box8"
          className={isClicked ? styles["box8"] : styles["eighth-box"]}
        ></div>
        <div
          id="box9"
          className={isClicked ? styles["box9"] : styles["ninth-box"]}
        ></div>
        <div
          id="box10"
          className={isClicked ? styles["box10"] : styles["tenth-box"]}
        ></div>
      </div>
      {isClicked ? (
        <div className={styles["login"]} onClick={handleKakaoLogin}>
          <img src={Kakaologo} alt="Log in with Kakao" />{" "}
          {/* Add style as needed */}
        </div>
      ) : (
        <span className={styles["intro"]}>Click Anywhere</span>
      )}
      {playVideo && (
        <div className={styles["character"]}>
          <Models />
          {/* <div className={styles["introText"]}>Welcome To StepDance</div> */}
        </div>
      )}
    </section>
  );
};

export default LandingPage;
