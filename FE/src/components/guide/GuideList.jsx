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
  const [genre, setGenre] = useState('케이팝');

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const data = await getGuideList();
        console.log(data.data.guide_list);
        setGuideList(data.data.guide_list);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchGuideData();
  }, []);

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
        <Button variant="success" size="sm" onClick={() => choiceGenre('케이팝')}>케이팝</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('비보잉')}>비보잉</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('힙합')}>힙합</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('팝핑')}>팝핑</Button>
        <Button variant="success" size="sm" onClick={() => choiceGenre('전통무용')}>전통무용</Button>
      </div>
      <div className={styles.title}>{user.nickname}님이 좋아하는 {genre} 장르</div>
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
