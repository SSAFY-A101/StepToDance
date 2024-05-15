import styles from "./ShowShortForm.module.css";
import testVideo from "../../assets/PerfectNight_르세라핌.mp4";
import { getShortformList } from "../../api/ShortformApis";
import { useEffect, useState } from "react";

const ShowShortForm = () => {
  const [showShortForm, setShowShortForm] = useState([]);
  const [renderVideo, setRenderVideo] = useState([]);

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

  return <section className={styles["short-page"]}>{renderVideo}</section>;
};

export default ShowShortForm;
