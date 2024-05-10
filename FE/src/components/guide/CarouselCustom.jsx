import Carousel from "react-spring-3d-carousel";
import { useState, useEffect } from "react";
import { config } from "react-spring";
import styles from "../../styles/CarouselCustom.module.css";
import { useNavigate } from "react-router";

export default function CarouselCustom(props) {
  const navigate = useNavigate();
  const table = props.cards.map((element, index) => {
    return { ...element, onClick: () => movieEdit(index) };
  });

  const movieEdit = (index) => {
    navigate(`/guideDetail?id=${index}`);
  };

  const [offsetRadius, setOffsetRadius] = useState(2);
  const [showArrows, setShowArrows] = useState(false);
  const [goToSlide, setGoToSlide] = useState(null);
  const [cards] = useState(table);

  useEffect(() => {
    setOffsetRadius(props.offset);
    setShowArrows(props.showArrows);
  }, [props.offset, props.showArrows]);

  return (
    <div
      className={styles["carousel"]}
      style={{ width: props.width, height: props.height, margin: props.margin }}
    >
      <Carousel
        slides={cards}
        goToSlide={goToSlide}
        offsetRadius={offsetRadius}
        showNavigation={showArrows}
        animationConfig={config.gentle}
      />
      <h2></h2>
    </div>
  );
}
