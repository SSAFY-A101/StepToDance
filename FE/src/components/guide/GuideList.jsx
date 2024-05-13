import React, {useEffect, useState} from "react";
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";
import styles from "../../styles/guide/GuideList.module.css";
import { getGuideList } from "../../api/GuideApis";
import styled from "styled-components";

function GuideList(){
    const user = useSelector(state=> state.user);
    const [guideList, setGuideList] = useState([]);

    useEffect(() => {
        const fetchGuideData = async () => {
          try {
            const data = await getGuideList();
            console.log(data.data.guide_list);
            setGuideList(data.data.guide_list);
          } catch (error) {
            console.error('Error fetching guide data:', error);
          }
        };
    
        fetchGuideData();
      }, []);
    
    const renderItem = ({item}) => (
        <Link to={{ pathname: '/guideDetail', search: `?id=${item.id}`, state: { id: item.id } }}>
            <div className={styles.guide}>
                <img className={styles.image} src={item.thumbnail_img_url}/>
                <p className={styles.text}>{item.song_title} - {item.singer}</p>
            </div>
        </Link>
    );
    return (
        <div className={styles.container}>
            <div className={styles.title}>{user.nickname}님이 좋아하는 장르</div>
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