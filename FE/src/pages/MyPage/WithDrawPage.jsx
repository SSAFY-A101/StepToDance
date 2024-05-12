import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/UserSlice";
import { removeCookie } from "../../cookie";
import styles from "./WithDrawPage.module.css";
import axios from "axios";
import { getCookie } from "../../cookie";
import { useNavigate } from "react-router-dom";

const WithDrawPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(user);
  const withdraw = async () => {
    try {
      const accessToken = getCookie("accessToken");
      const response = await axios.delete(
        "https://k10a101.p.ssafy.io/api/v1/users", // 엔드포인트 변경
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        console.log("Account withdrawal successful:");
        removeCookie("accessToken", { path: "/" });
        removeCookie("refreshToken", { path: "/" });
        dispatch(logout());
        navigate("/login"); // 탈퇴 후 로그인 페이지로 이동
      }
    } catch (error) {
      console.error(
        "Error during account withdrawal:",
        error.response ? error.response.data.message : error.message
      );
    }
  };
  

  return (
    <div className={styles.safeArea}>
      <div className={styles.title}>회원 탈퇴</div>
      <div className={styles.mainView}>
        <img src={user.profileImgUrl} alt="Profile" className={styles.profileImage} />
        <div className={styles.headerView}>
          <h1 className={styles.username}>{user.nickname || "No Name"}</h1>
          <p className={styles.rankAndPoints}>RANK 9999{"\n"}1 point</p>
        </div>
        <button onClick={withdraw} className={styles.withdrawButton}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
  
};

export default WithDrawPage;
