import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../../stores/UserSlice";
import { setCookie } from "../../cookie";
import styles from "../../styles/Layout.module.css";
import Models from "../../components/Models/Models";

const KakaoLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const [error, setError] = useState(""); // State to hold any error messages

  useEffect(() => {
    const kakaoLogin = async () => {
      if (code) {
        console.log(code);
        try {
          const response = await axios({
            method: "GET",
            url: `https://www.steptodance.site/api/v1/auth/login?code=${code}`,
          });

          if (response.status === 201) {
            const { access_token, nickname, profile_img_url } =
              response.data.data;
            const refresh_token = response.headers["refresh_token"];

            // localStorage.setItem("accessToken", access_token);
            // localStorage.setItem("refreshToken", refresh_token);

            dispatch(
              setUserData({
                accessToken: access_token,
                nickname: nickname,
                profileImgUrl: profile_img_url,
                isLoggedIn: true,
              })
            );
            setCookie("accessToken", access_token);
            setCookie("refreshToken", refresh_token);

            navigate("/home");
          } else {
            throw new Error("Failed to login with Kakao");
          }
        } catch (error) {
          console.error("Error during Kakao login: ", error);
          setError("Login failed due to server error. Please try again.");
          navigate("/login");
        }
      }
    };

    kakaoLogin();
  }, [code, dispatch, navigate]);

  return (
    <section className={styles.layout}>
      <div className="loginHandler">
        <div className="notice">
          {error && <p className="error">{error}</p>}
          <p>로그인 중입니다. 잠시만 기다려주세요.</p>
          <div className="spinner">
            <Models />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KakaoLogin;
