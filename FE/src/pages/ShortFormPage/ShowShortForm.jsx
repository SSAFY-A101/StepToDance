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
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = outerDivRef.current.offsetHeight;
      setCurrentPos(pageHeight);
      if (deltaY > 0) {
        // 스크롤 내릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          outerDivRef.current.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + 5,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 3 + 6,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 3 && scrollTop < pageHeight * 4) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 4 + 11,
            left: 0,
            behavior: "smooth",
          });
        } else {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setFlag(!flag);
        }
      } else {
        // 스크롤 올릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setFlag(!flag);
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
          outerDivRef.current.scrollTo({
            top: pageHeight + 5,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 3 && scrollTop < pageHeight * 4) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + 6,
            left: 0,
            behavior: "smooth",
          });
        } else {
          outerDivRef.current.scrollTo({
            top: pageHeight * 3 + 11,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    };

    const touchHandler = (e) => {
      if (e.type === "touchmove" || e.type === "touchend") {
        e.preventDefault();
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    outerDivRefCurrent.addEventListener("touchmove", touchHandler, { passive: false });
    outerDivRefCurrent.addEventListener("touchend", touchHandler, { passive: false });

    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
      outerDivRefCurrent.removeEventListener("touchmove", touchHandler);
      outerDivRefCurrent.removeEventListener("touchend", touchHandler);
    };
  }, [flag]);

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
