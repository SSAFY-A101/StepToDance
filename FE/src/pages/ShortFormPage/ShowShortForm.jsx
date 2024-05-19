import styles from "./ShowShortForm.module.css";
import { getShortformList } from "../../api/ShortformApis";
import { useEffect, useRef, useState } from "react";
import FLY from "../../assets/images/fly.png"; // <a href="https://www.flaticon.com/kr/free-icons/-" title="종이 접기 아이콘">종이 접기 아이콘 제작자: Smashicons - Flaticon</a>
import ShareModal from "./ShareModal.jsx";

const ShowShortForm = () => {
  const [showShortForm, setShowShortForm] = useState([]);
  const [renderVideo, setRenderVideo] = useState([]);
  const [currentPos, setCurrentPos] = useState();
  const [isModal, setIsModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [flag, setFlag] = useState(false);
  const outerDivRef = useRef();

  // 스크롤 이벤트 막기
useEffect(() => {
  const scrollHandler = (e) => {
    const { deltaY } = e;
    const { scrollTop } = outerDivRef.current;
    const pageHeight = outerDivRef.current.offsetHeight;

    // 스크롤 이벤트의 기본 동작 막기
    e.preventDefault();

    // 현재 스크롤 위치에 따라 스크롤 위치를 조정
    if (deltaY > 0) {
      // 스크롤 내릴 때
      if (scrollTop < pageHeight * 3) {
        outerDivRef.current.scrollTo({
          top: scrollTop + pageHeight + 3,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // 마지막 페이지에 도달하면 첫 페이지로 이동
        outerDivRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    } else {
      // 스크롤 올릴 때
      if (scrollTop > 0) {
        // 스크롤을 이전 페이지로 이동
        outerDivRef.current.scrollTo({
          top: scrollTop - pageHeight - 3,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // 첫 페이지에서 더 올릴 수 없으면 마지막 페이지로 이동
        outerDivRef.current.scrollTo({
          top: pageHeight * 3,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  };

  let startY = 0;

  const touchMoveHandler = (e) => {
    const touch = e.touches[0];
    const { pageY } = touch;
    const { scrollTop } = outerDivRef.current;
    const pageHeight = outerDivRef.current.offsetHeight;
  
    // 터치 스크롤 이벤트의 기본 동작 막기
    e.preventDefault();
  
    // 터치 시작 지점과 현재 터치 위치의 차이 계산
    const deltaY = pageY - startY;
  
    // 현재 스크롤 위치에 따라 스크롤 위치를 조정
    if (deltaY > 0) {
      // 아래로 스크롤할 때
      if (scrollTop > 0) {
        outerDivRef.current.scrollTo({
          top: scrollTop - pageHeight,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // 첫 페이지에서 더 올릴 수 없으면 마지막 페이지로 이동
        outerDivRef.current.scrollTo({
          top: pageHeight * 3,
          left: 0,
          behavior: "smooth",
        });
      }
    } else {
      // 위로 스크롤할 때
      if (scrollTop < pageHeight * 3) {
        outerDivRef.current.scrollTo({
          top: scrollTop + pageHeight,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // 마지막 페이지에 도달하면 첫 페이지로 이동
        outerDivRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  
    // 터치 시작 지점 업데이트
    startY = pageY;
  };  

  // 스크롤 이벤트 리스너 등록
  outerDivRef.current.addEventListener("wheel", scrollHandler, { passive: false });

  // 터치 이벤트 리스너 등록
  outerDivRef.current.addEventListener("touchmove", touchMoveHandler, { passive: false });

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  return () => {
    outerDivRef.current.removeEventListener("wheel", scrollHandler);
    outerDivRef.current.removeEventListener("touchmove", touchMoveHandler);
  };
}, []);


  // 데이터 받아오는 api 요청
  useEffect(() => {
    const getData = async () => {
      const response = await getShortformList(5);
      setShowShortForm(response.data);
      return response.data;
    };
    getData();
  }, [flag]);

  // Intersection Observer for autoplay
  useEffect(() => {
    if (showShortForm.length > 0) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video
              .play()
              .catch((error) => console.error("Video play failed:", error));
          } else {
            video.pause();
          }
        });
      }, options);

      showShortForm.forEach((short, index) => {
        const videoElement = document.getElementById(`video_${index}`);
        if (videoElement) {
          observer.observe(videoElement);
        }
      });

      return () => {
        showShortForm.forEach((_, index) => {
          const videoElement = document.getElementById(`video_${index}`);
          if (videoElement) {
            observer.unobserve(videoElement);
          }
        });
        observer.disconnect();
      };
    }
  }, [currentPos, showShortForm]);

  // 비디오 렌더링
  useEffect(() => {
    const videoList = showShortForm.map((short, index) => {
      return (
        <article className={styles["vidoe-page"]} key={index}>
          {isModal && currentVideoId === index ? (
            <ShareModal infos={short} setIsModal={setIsModal} />
          ) : null}
          <video
            className={styles["short-video"]}
            src={short.video_url}
            id={`video_${index}`}
            loop
            muted
            playsInline
          ></video>
          <article className={styles["short-title"]}>
            <p>@{short.uploader}</p>
            <p>{short.song_title} - {short.singer}</p>
          </article>
          <img
            className={styles["short-share"]}
            onClick={() => {
              setIsModal(true);
              setCurrentVideoId(index);
            }}
            src={FLY}
            alt=""
          />
        </article>
      );
    });

    setRenderVideo(videoList);
  }, [showShortForm, isModal]);

  return (
    <section className={styles["short-page"]} ref={outerDivRef}>
      {renderVideo}
    </section>
  );
};

export default ShowShortForm;
