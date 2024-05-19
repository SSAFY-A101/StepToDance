import React, { useRef, useState } from "react";
import { guideUpload } from "../../api/GuideApis";
import LoadingPage from '../LoadingPage/LoadingPage';
import styles from "./GuideUploadPage.module.css";
import UploadIcon from "@mui/icons-material/Upload";
import Timeline from "../../components/Timeline";

const GuideUploadPage = () => {
  const [selectVideo, setSelectVideo] = useState(null);
  const [selectTitle, setSelectTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [artistName, setArtistName] = useState("");
  const [selectedOption, setSelectedOption] = useState('1');  
  const [highlights, setHighlights] = useState([{ start: 0, end: 0 }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectTitle(file.name);
      setSelectVideo(file);
      const reader = new FileReader();
      reader.onload = event => videoRef.current.src = event.target.result;
      reader.readAsDataURL(file);
      setVideoDuration(0); 
    }
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current.duration;
    setVideoDuration(duration);
    setHighlights([{ start: 0, end: duration }]);
  };

  const handleHighlightChange = (start, end) => {
    setHighlights([{ start, end }]);
  };

  const handlePlaybarMove = (clickTime) => {
    videoRef.current.currentTime = clickTime;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const sendApi = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("genre_id", selectedOption);
    formData.append("song_title", selectTitle);
    formData.append("singer", artistName);
    highlights.forEach((highlight) => {
      formData.append("highlight_section_start_at", formatTime(highlight.start));
      formData.append("highlight_section_end_at", formatTime(highlight.end));
    });
    formData.append("video", selectVideo);

    try {
      const response = await guideUpload(formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      console.log(response);
      if (response.status === 201) {
        alert("가이드 업로드 성공!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading guide:", error);
      alert("가이드 업로드 실패!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className={styles["guide_upload-page"]}>
      {isUploading && <LoadingPage progress={uploadProgress} />}
      <form>
        <label>
          <input
            className={styles["bar"]}
            type="radio"
            name="genre"
            value="1"
            checked={selectedOption === '1'}
            onChange={handleOptionChange}
          />
          <span>케이팝</span>
        </label>
        <label>
          <input
            className={styles["bar"]}
            type="radio"
            name="genre"
            value="2"
            checked={selectedOption === '2'}
            onChange={handleOptionChange}
          />
          <span>비보잉</span>
        </label>
        <label>
          <input
            className={styles["bar"]}
            type="radio"
            name="genre"
            value="3"
            checked={selectedOption === '3'}
            onChange={handleOptionChange}
          />
          <span>힙합</span>
        </label>
        <label>
          <input
            className={styles["bar"]}
            type="radio"
            name="genre"
            value="4"
            checked={selectedOption === '4'}
            onChange={handleOptionChange}
          />
          <span>팝핀</span>
        </label>
        <label>
          <input
            className={styles["bar"]}
            type="radio"
            name="genre"
            value="5"
            checked={selectedOption === '5'}
            onChange={handleOptionChange}
          />
          <span>전통무용</span>
        </label>
      </form>
      <div className={styles["input-section"]}>
        <input
          type="text"
          placeholder="노래 제목"
          value={selectTitle}
          onChange={e => setSelectTitle(e.target.value)}
          className={styles["text-input"]}
        />
        <input
          type="text"
          placeholder="가수 이름"
          value={artistName}
          onChange={e => setArtistName(e.target.value)}
          className={styles["text-input"]}
        />
      </div>
      <article className={styles["guide-video"]}>
        {selectVideo ? (
          <>
            <video
              className={styles["guide-play"]}
              ref={videoRef}
              controls
              autoPlay
              onLoadedMetadata={handleLoadedMetadata}
              playsInline={true}
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
      <div className={styles.timelineContainer}>
        {selectVideo && videoDuration > 0 && (
          <Timeline
            fixedMinTime={0}
            fixedMaxTime={videoDuration}
            rangeMin={highlights[0].start}
            rangeMax={highlights[0].end}
            initialStartAt={0}
            initialEndAt={videoDuration}
            timeGap={1}
            onTimeChange={handleHighlightChange}
            onPlaybarMove={handlePlaybarMove}
            currentTime={videoRef.current ? videoRef.current.currentTime : 0}
          />
        )}
      </div>
      <button
        type="button"
        className={styles["guide-submit"]}
        onClick={sendApi}
        disabled={isUploading}
      >
        <UploadIcon style={{ color: "white" }} />
      </button>
      {isUploading && <div className={styles.spinner}></div>}
    </section>
  );
};

export default GuideUploadPage;
