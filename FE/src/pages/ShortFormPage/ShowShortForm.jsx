import styles from "./ShowShortForm.module.css";
import testVideo from "../../assets/PerfectNight_르세라핌.mp4";
import { getShortformList } from "../../api/ShortformApis";
import { useEffect, useRef, useState } from "react";

const ShowShortForm = () => {
  const [showShortForm, setShowShortForm] = useState([]);
  const [renderVideo, setRenderVideo] = useState([]);
  const [currentPos, setCurrentPos] = useState();
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
        } else {
          outerDivRef.current.scrollTo({
            top: pageHeight * 4 + 11,
            left: 0,
            behavior: "smooth",
          });
        }
      } else {
        // 스크롤 올릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
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
    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
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
  }, []);
  useEffect(() => {
    if (showShortForm) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play();
            }
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
        observer.disconnect();
      };
    }
  }, [currentPos, showShortForm]);
  // 비디오 렌더링
  useEffect(() => {
    const videoList = showShortForm.map((short, index) => {
      return (
        <>
          <video
            className={styles["short-video"]}
            id={`video_${index}`}
            poster="영상썸네일"
            src={short.video_url}
            loop
            muted
            playsInline
            type="video/mp4"
            key={index}
          ></video>
        </>
      );
    });

    setRenderVideo(videoList);
  }, [showShortForm]);

  return (
    <section className={styles["short-page"]} ref={outerDivRef}>
      {renderVideo}
    </section>
  );
};

export default ShowShortForm;
