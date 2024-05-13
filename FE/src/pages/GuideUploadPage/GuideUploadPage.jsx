import { useRef, useState } from "react";
import { guideUpload } from "../../api/GuideApis";
import styles from "./GuideUploadPage.module.css";

const GuideUploadPage = () => {
  const [selectVideo, setSelectVideo] = useState(null);
  const [selectTitle, setSelectTitle] = useState("");
  const videoRef = useRef(null);

  const changeHandler = (e) => {
    setSelectTitle(e.target.files[0].name);
    setSelectVideo(e.target.files[0]);
    const reader = new FileReader();

    reader.onload = function (event) {
      console.log(event.target);
      videoRef.current.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  function formatTime(date) {
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  const sendApi = async () => {
    let start_time_str = "11:22";
    let end_time_str = "12:22";

    // 시간을 포함한 현재 날짜를 생성
    let current_date = new Date();

    // 시작 시간 설정
    let start_time_parts = start_time_str.split(":");
    current_date.setHours(parseInt(start_time_parts[0]));
    current_date.setMinutes(parseInt(start_time_parts[1]));
    let start_time = current_date;

    // 종료 시간 설정
    let end_time_parts = end_time_str.split(":");
    current_date.setHours(parseInt(end_time_parts[0]));
    current_date.setMinutes(parseInt(end_time_parts[1]));
    let end_time = current_date;

    const formData = new FormData();
    formData.append("genre_id", 1);
    formData.append("song_title", selectTitle);
    formData.append("singer", "엄정화");
    formData.append("highlight_section_start_at", formatTime(start_time));
    formData.append("highlight_section_end_at", formatTime(end_time));
    formData.append("video", selectVideo);
    const response = await guideUpload(formData);
    console.log(response);
  };

  return (
    <section className={styles["guide_upload-page"]}>
      <select className={styles["guide-select"]} name="gen" id="">
        <option value="1">K-pop</option>
        <option value="2">B-boying</option>
        <option value="3">Hip-hop</option>
        <option value="4">Popping</option>
        <option value="5">Korean dance</option>
      </select>
      <article className={styles["guide-video"]}>
        {selectVideo ? (
          <>
            <video
              className={styles["guide-play"]}
              ref={videoRef}
              controls
              autoPlay
            ></video>
          </>
        ) : (
          <>
            <label htmlFor="videoSelect">비디오 선택</label>
            <input
              id="videoSelect"
              type="file"
              accept="video/*"
              onChange={(e) => changeHandler(e)}
            />
          </>
        )}
      </article>
      <button className={styles["guide-submit"]} onClick={() => sendApi()}>
        테스트
      </button>
    </section>
  );
};

export default GuideUploadPage;
