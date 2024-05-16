import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/guide/GuideList.module.css";
import { getGuideList } from "../../api/GuideApis";
import styled from "styled-components";
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
        setGenre(data.data.guide_list[0].genre);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchGuideData();
  }, [genre]);

  useEffect(()=> {
    if(genre==='k-pop'){
      setKrGenre('케이팝');
    }
    else if(genre==='B-boying'){
      setKrGenre('비보잉');
    }
    else if(genre==='hip-hop'){
      setKrGenre('힙합');
    }
    else if(genre==='popping'){
      setKrGenre('팝핀');
    }
    else if(genre==='korean traditional dance'){
      setKrGenre('전통무용');
    }
  },[genre]);

  const renderItem = ({ item }) => (
    <Link to={{ pathname: `/guideDetail/${item.id}` }}>
      <div className={styles.guide}>
        <img className={styles.image} src={item.thumbnail_img_url} />
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

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button variant="success" size="sm" onClick={() => choiceGenre('k-pop')} selected={genre === 'k-pop'}>케이팝</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('B-boying')} selected={genre === 'B-boying'}>비보잉</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('hip-hop')} selected={genre === 'hip-hop'}>힙합</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('popping')} selected={genre === 'popping'}>팝핀</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('korean traditional dance', '전통무용')} selected={genre === 'korean traditional dance'}>전통무용</Button>
      </div>
      <div className={styles.title}>{user.nickname}님이 좋아하는 {krGenre} 장르</div>
      <Links>
        {guideList.map((item) => (
          <div key={`page_${item.id}`}>{renderItem({ item })}</div>
        ))}
      </Links>
    </div>
  );
}

const Links = styled.div`
  a {
    text-decoration: none;
  }
`;

export default GuideList;
