import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import VideoEditor from "./pages/VideoEditor";
import GuideDetail from "./pages/VideoPage/GuideDetail";
import MyPage from "./pages/MyPage/MyPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import KakaoLogin from "./pages/LoginPage/KakaoLogin";
import { WebcamStreamCapture } from "./pages/RecordingPage/RecordingPage";
import { userLoggedInSelector } from "./stores/UserSlice";
import { getCookie } from "./cookie";
import { useEffect } from "react";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage/LandingPage";
import RankingPage from "./pages/Ranking/RankingPage";
import SearchResult from "./pages/SearchResult";
import ShortsShare from "./pages/ShortsShare";
import GuideUploadPage from "./pages/GuideUploadPage/GuideUploadPage";
import WithDrawPage from "./pages/MyPage/WithDrawPage";
import ShowShortForm from "./pages/ShortFormPage/ShowShortForm";

function App() {
  const user = useSelector(userLoggedInSelector);
  const cookie = getCookie("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    // if (cookie && user) {
    //   navigate("/home");
    // }
    // if (!cookie) {
    //   navigate("/login");
    // }
  }, [cookie, user]);

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  return (
    <div className="App">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/guideUpload" element={<GuideUploadPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/videoEditor" element={<VideoEditor />} />
          <Route path="/searchResult" element={<SearchResult />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/shortsShare" element={<ShortsShare />} />
          <Route path="/withdraw" element={<WithDrawPage />} />
          <Route path="/showShortForm" element={<ShowShortForm />} />
        </Route>
        <Route path="/guideDetail/:id" element={<GuideDetail />} />
        <Route path="/record" element={<WebcamStreamCapture />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<KakaoLogin />} />
      </Routes>
    </div>
  );
}

export default App;
