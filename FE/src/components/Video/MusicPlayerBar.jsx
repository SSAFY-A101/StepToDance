export default MusicPlayerBar(props) {
    const {isPlaying, setIsPlaying} = props
    const [isModalOpen, setIsModalOpen] = useState(false);

}


const handlePlayBtn = () => {
    if (playing === false) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  return (
    <PlayBarWrap>
      //...
      <PlayBtn onClick={handlePlayBtn}>
        <img
          src={playing === true ? PauseIcon : PlayIcon}
          alt='재생/멈춤 버튼'
        />
      </PlayBtn>
     //...
    </PlayBarWrap>
  );
}