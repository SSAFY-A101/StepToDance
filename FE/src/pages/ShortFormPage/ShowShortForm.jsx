import styles from "./ShowShortForm.module.css";
import testVideo from "../../assets/PerfectNight_르세라핌.mp4";
import { getShortformList } from "../../api/ShortformApis";
import { useEffect, useRef, useState } from "react";

const ShowShortForm = () => {
  const [showShortForm, setShowShortForm] = useState([]);
  const [renderVideo, setRenderVideo] = useState([]);

  const outerDivRef = useRef();
  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = outerDivRef.current.offsetHeight;

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

  useEffect(() => {
    const getData = async () => {
      const response = await getShortformList(5);
      setShowShortForm(response.data);
      return response.data;
    };
    getData();
  }, []);

  useEffect(() => {
    const videoList = showShortForm.map((short, index) => {
      return (
        <video
          className={styles["short-video"]}
          src={short.video_url}
          key={index}></video>
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
