import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchGuide } from "../../api/GuideApis";
import styles from "../../styles/guide/SearchGuideList.module.css";
import styled from "styled-components";

function SearchResultList(params) {
  const location = useLocation();
  const [guideList, setGuideList] = useState([]);
  const [word, setWord] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");
    setWord(searchQuery);

    const fetchGuideData = async () => {
      try {
        console.log(params);
        const data = await searchGuide(searchQuery);
        setGuideList(data.data.guide_list);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchGuideData();
  }, [location]);

  const renderItem = ({ item }) => (
    <Link to={{ pathname: "/guideDetail", search: `?id=${item.id}` }}>
      <div className={styles.guide}>
        <img className={styles.image} src={item.thumbnail_img_url} />
        <p className={styles.text}>
          {item.song_title} - {item.singer}
        </p>
      </div>
    </Link>
  );

  return (
    <div className={styles.container}>
      <Links>
        {guideList.length === 0 ? (
          <div className={styles.noResult}>
            {word} <br /> 검색 결과가 없습니다.
          </div>
        ) : (
          guideList.map((item) => (
            <div key={`page_${item.id}`}>{renderItem({ item })}</div>
          ))
        )}
      </Links>
    </div>
  );
}

const Links = styled.div`
  a {
    text-decoration: none;
  }
`;

export default SearchResultList;
