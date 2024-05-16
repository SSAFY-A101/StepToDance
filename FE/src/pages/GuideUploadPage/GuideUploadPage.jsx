import { useRef, useState } from "react";
import { guideUpload } from "../../api/GuideApis";
import LoadingPage from '../LoadingPage/LoadingPage'; // Import LoadingPage
import styles from "./GuideUploadPage.module.css";
import UploadIcon from "@mui/icons-material/Upload";

const GuideUploadPage = () => {
  const [selectVideo, setSelectVideo] = useState(null);
  const [selectTitle, setSelectTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState('00:00');
  const [artistName, setArtistName] = useState("");
  const [selectedOption, setSelectedOption] = useState('1');  
  const [highlights, setHighlights] = useState([{ start: '00:00', end: '00:00' }]);
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state
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
      setVideoDuration('00:00'); 
    }
  };

  const handleLoadedMetadata = () => {
    const duration = formatTime(new Date(videoRef.current.duration * 1000));
    setVideoDuration(duration);
    setHighlights([{ start: '00:00', end: duration }]);
  };

  function formatTime(date) {
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = highlights.map((highlight, i) => {
      if (i === index) {
        return { ...highlight, [field]: value };
      }
      return highlight;
    });
    setHighlights(newHighlights);
  };

  const sendApi = async () => {
    setIsUploading(true); // Start uploading
    const formData = new FormData();
    formData.append("genre_id", selectedOption);
    formData.append("song_title", selectTitle);
    formData.append("singer", artistName);
    highlights.forEach((highlight) => {
      formData.append(`highlight_section_start`, highlight.start);
      formData.append(`highlight_section_end`, highlight.end);
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
        window.location.reload(); // Reload the page
      }
    } catch (error) {
      console.error("Error uploading guide:", error);
      alert("가이드 업로드 실패!");
    } finally {
      setIsUploading(false); // Finish uploading
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
      {highlights.map((highlight, index) => (
        <div key={index} className={styles["input-section"]}>
          <input
            type="text"
            placeholder="Highlight start (default 00:00)"
            value={highlight.start}
            onChange={(e) => handleHighlightChange(index, 'start', e.target.value)}
            className={styles["text-input"]}
          />
          <input
            type="text"
            placeholder="Highlight end (video end time)"
            value={highlight.end}
            onChange={(e) => handleHighlightChange(index, 'end', e.target.value)}
            className={styles["text-input"]}
          />
        </div>
      ))}
      <button
        type="button"
        className={styles["guide-submit"]}
        onClick={sendApi}
        disabled={isUploading} // Disable button during upload
      >
        <UploadIcon style={{ color: "white" }} />
      </button>
      {isUploading && <div className={styles.spinner}></div>} {/* Spinner */}
    </section>
  );
};

export default GuideUploadPage;
