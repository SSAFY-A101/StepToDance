import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/guide/GuideList.module.css";
import { getGuideList } from "../../api/GuideApis";
import Button from "../CustomButton";

function GuideList() {
  const user = useSelector((state) => state.user);
  const [guideList, setGuideList] = useState([]);
  const [genre, setGenre] = useState('custom');
  const [krGenre, setKrGenre] = useState('');

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const data = await getGuideList(genre);
        console.log(data.data.guide_list);
        setGuideList(data.data.guide_list);
        // console.log(data.data.guide_list[0].genre)
        setGenre(data.data.guide_list[0].genre);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchGuideData();
  }, [genre]);

  useEffect(() => {
    if (genre === 'k-pop') {
      setKrGenre('케이팝');
    } else if (genre === 'B-boying') {
      setKrGenre('비보잉');
    } else if (genre === 'hip-hop') {
      setKrGenre('힙합');
    } else if (genre === 'popping') {
      setKrGenre('팝핀');
    } else if (genre === 'korean traditional dance') {
      setKrGenre('전통무용');
    }
  }, [genre]);

  const renderItem = ({ item }) => (
    <Link to={{ pathname: `/guideDetail/${item.id}` }} className={styles.link}>
      <div className={styles.guide}>
        <img className={styles.image} src={item.thumbnail_img_url} alt="thumbnail" />
        <p className={styles.text}>
          {item.song_title} - {item.singer}
        </p>
      </div>
    </Link>
  );

  const choiceGenre = (keyword) => {
    console.log(keyword);
    setGenre(keyword);
  }

  useEffect(() => {
    const nav = document.getElementById("js-nav");
    const pointer = document.getElementById("js-pointer");
    const links = nav.getElementsByTagName("a");

    pointer.style.width = `calc(100% / ${links.length} - 0.5em)`;
    pointer.style.height = `calc(60%)`;


    for (let i = 0; i < links.length; i++) {
      const current = links[i];
      current.dataset.order = i * 100 + "%";
      current.addEventListener("click", movePointer);
    }

    function movePointer(e) {
      const order = e.currentTarget.dataset.order;
      pointer.style.transform = `translate3d(${order},0,0)`;
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>{user.nickname}님이 좋아하는 {krGenre} 장르</div>
      <nav className={styles.nav} id="js-nav">
        <div id="js-pointer" className={styles.nav__pointer}></div>
        <ul className={styles.nav__list}>
          <li>
            <a href="#" onClick={() => choiceGenre('k-pop')} data-order="0%">케이팝</a>
          </li>
          <li>
            <a href="#" onClick={() => choiceGenre('B-boying')} data-order="100%">비보잉</a>
          </li>
          <li>
            <a href="#" onClick={() => choiceGenre('hip-hop')} data-order="200%">힙합</a>
          </li>
          <li>
            <a href="#" onClick={() => choiceGenre('popping')} data-order="300%">팝핀</a>
          </li>
          <li>
            <a href="#" onClick={() => choiceGenre('korean traditional dance')} data-order="400%">전통 무용</a>
          </li>
        </ul>
      </nav>
      <div className={styles.links}>
      {guideList.length === 0 ? (
          <div className={styles.noGuide}>아직 영상이 없어요</div>
        ):
        (
        guideList.map((item) => (
          <div key={`page_${item.id}`}>{renderItem({ item })}</div>
        )))}
      </div>
    </div>
  );
}

export default GuideList;
