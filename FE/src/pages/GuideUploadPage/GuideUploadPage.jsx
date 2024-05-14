import { useRef, useState } from "react";
import { guideUpload } from "../../api/GuideApis";
import styles from "./GuideUploadPage.module.css";
import UploadIcon from "@mui/icons-material/Upload";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';

const GuideUploadPage = () => {
  const [selectVideo, setSelectVideo] = useState(null);
  const [selectTitle, setSelectTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState('00:00');
  const [artistName, setArtistName] = useState("");
  const [selectedOption, setSelectedOption] = useState('1');  
  const [highlights, setHighlights] = useState([{ start: '00:00', end: '00:00' }]);
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

  const addHighlightSection = () => {
    setHighlights([...highlights, { start: '00:00', end: videoDuration }]);
  };


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
    formData.append("genre_id", selectedOption);
    formData.append("song_title", selectTitle);
    formData.append("singer", artistName);
    highlights.forEach((highlight, index) => {
      formData.append(`highlight_${index}_start`, highlight.start);
      formData.append(`highlight_${index}_end`, highlight.end);
    });
    formData.append("video", selectVideo);
    const response = await guideUpload(formData);
    console.log(response);
  };

  return (
    <section className={styles["guide_upload-page"]}>
      <form>
        <label><input className={styles["bar"]} type="radio" name="genre" value="1" checked={selectedOption === '1'} onChange={handleOptionChange} /><span>K-pop</span></label>
        <label><input className={styles["bar"]} type="radio" name="genre" value="2" checked={selectedOption === '2'} onChange={handleOptionChange}/><span>B-boying</span></label>
        <label><input className={styles["bar"]} type="radio" name="genre" value="3" checked={selectedOption === '3'} onChange={handleOptionChange}/><span>Hip-hop</span></label>
        <label><input className={styles["bar"]} type="radio" name="genre" value="4" checked={selectedOption === '4'} onChange={handleOptionChange}/><span>Popping</span></label>
        <label><input className={styles["bar"]} type="radio" name="genre" value="5" checked={selectedOption === '5'} onChange={handleOptionChange}/><span>Traditional</span></label>
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
              onLoadedMetadata={handleLoadedMetadata}  // Get video duration when metadata is loaded
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
      <IconButton onClick={addHighlightSection} style={{ color: 'green' }}>
        <AddCircleOutlineIcon />
      </IconButton>
      <button className={styles["guide-submit"]} onClick={() => sendApi()}>
        <UploadIcon 
        style={{ color: "white" }}
        />
      </button>
    </section>
  );
};

export default GuideUploadPage;
