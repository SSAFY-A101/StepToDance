import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Card from "./Card";
import CarouselCustom from "./CarouselCustom";
import { getHotGuideList } from "../../api/GuideApis";
import styles from "../../styles/guide/Hot5Guides.module.css";

function Test() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const data = await getHotGuideList();
        console.log("data:", data.data.guide_list);
        setCards(
          data.data.guide_list.map((guide) => ({
            key: guide.id,
            content: <Card item={guide} />,
          }))
        );
        console.log("cards:", cards);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchGuideData();
  }, []);

  useEffect(() => {
    console.log("cards:", cards);
  }, [cards]);

  return (
    <div className="">
      <div className={styles.title}>HOT 5</div>
      {cards.length > 0 && (
        <CarouselCustom
          cards={cards}
          height="70vw"
          width="100%"
          margin="0 auto"
          offset={2}
          showArrows={true}
        />
      )}
    </div>
  );
}

export default Test;
