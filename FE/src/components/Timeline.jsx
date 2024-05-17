import { useState, useEffect } from "react";
import styled from "styled-components";

function Timeline({ fixedMinTime, fixedMaxTime, rangeMin, rangeMax, initialStartAt, initialEndAt, timeGap, onTimeChange, onPlaybarMove, currentTime }) {
  const [rangeMinValue, setRangeMinValue] = useState(rangeMin); 
  const [rangeMaxValue, setRangeMaxValue] = useState(rangeMax);
  const [rangeMinPercent, setRangeMinPercent] = useState(0);
  const [rangeMaxPercent, setRangeMaxPercent] = useState(100);

  useEffect(() => {
    setRangeMinValue(rangeMin);
    setRangeMaxValue(rangeMax);
  }, [rangeMin, rangeMax]);

  useEffect(() => {
    setRangeMinValue(initialStartAt);
    setRangeMaxValue(initialEndAt);
  }, [initialStartAt, initialEndAt]);

  // 슬라이더 핸들러 함수
  const timeRangeMinValueHandler = (e) => {
    const minValue = parseInt(e.target.value);
    setRangeMinValue(minValue);
    setRangeMaxValue(Math.max(minValue + timeGap, rangeMaxValue)); // 범위가 최소 값보다 작아지지 않도록 설정
    onTimeChange(minValue, rangeMaxValue);
  };

  const timeRangeMaxValueHandler = (e) => {
    const maxValue = parseInt(e.target.value);
    setRangeMaxValue(maxValue);
    setRangeMinValue(Math.min(maxValue - timeGap, rangeMinValue)); // 범위가 최대 값보다 커지지 않도록 설정
    onTimeChange(rangeMinValue, maxValue);
  };

  useEffect(() => {
    const minPercent = (rangeMinValue / fixedMaxTime) * 100;
    const maxPercent = 100 - (rangeMaxValue / fixedMaxTime) * 100
    setRangeMinPercent(minPercent);
    setRangeMaxPercent(maxPercent);
  }, [rangeMinValue, rangeMaxValue, fixedMaxTime]);

  const handlePlaybarMove = (e) => {
    const timelineRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - timelineRect.left;
    const clickPercent = (clickX / timelineRect.width) * 100;
    const clickTime = (clickPercent / 100) * fixedMaxTime;
    onPlaybarMove(clickTime);
  };
  
  return (
      <FilterTimeSlide onClick={handlePlaybarMove}>
        <FilterTimeSlideInner
          rangeminpercent={rangeMinPercent}
          rangemaxpercent={rangeMaxPercent}
        />
        <Playbar playbarposition={(currentTime / fixedMaxTime) * 100} currenttime={currentTime}/>
        <FilterTimeRangeWrap>
        <FilterTimeRangeMin
          type="range"
          min={fixedMinTime}
          max={fixedMaxTime - timeGap}
          step="1"
          value={rangeMinValue}
          onChange={timeRangeMinValueHandler}
        />
        <FilterTimeRangeMax
          type="range"
          min={fixedMinTime + timeGap}
          max={fixedMaxTime}
          step="1"
          value={rangeMaxValue}
          onChange={timeRangeMaxValueHandler}
        />
      </FilterTimeRangeWrap>
      </FilterTimeSlide>
  );
}

// 스타일 정의
const FilterTimeSlide = styled.div`
  position: relative;
  height: 10vw;
  width: 85vw;
  background-color: #dddddd;
`;

const FilterTimeSlideInner = styled.div`
  position: absolute;
  left: ${(props) => props.rangeminpercent+2>100?(props.rangeminpercent):(props.rangeminpercent+2)}%;
  right: ${(props) => props.rangemaxpercent+2>100?(props.rangemaxpercent):(props.rangemaxpercent+2)}%;
  height: 10vw;
  background: linear-gradient(to right, #00f260, #0575e6);
`;

const FilterTimeRangeWrap = styled.div`
  position: relative;
`;

// 시작 시간 버튼
const FilterTimeRangeMin = styled.input`
  pointer-events: none;
  position: absolute;
  height: 9vw;
  width: 100%;

  -webkit-appearance: none;
  background: none;

  &::-webkit-slider-thumb {
    pointer-events: auto;
    height: 15vw;
    width: 4vw;
    background-color: white;
    border: 0.7vw solid black;
    -webkit-appearance: none;
  }
`;

// 끝 시간 버튼
const FilterTimeRangeMax = styled.input`
pointer-events: none;
position: absolute;
height: 9vw;
width: 100%;
-webkit-appearance: none;
background: none;

&::-webkit-slider-thumb {
  pointer-events: auto;
  height: 15vw;
  width: 4vw;
  background-color: white;
  border: 0.7vw solid black;
  -webkit-appearance: none;
}
`;

const Playbar = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => props.playbarposition}%;
  bottom: 0;
  width: 4px;
  background-color: blueviolet;
  cursor: pointer;
`;

export default Timeline;
