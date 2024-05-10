import {useState, useEffect} from "react";
import styles from "../../styles/guide/Hot5Guides.module.css"
import Carousel from "./Carousel";
import { getHotGuideList } from "../../api/GuideApis";

const screenWidth = window.innerWidth;

function Hot5Guides(){
    const [currentPage, setCurrentPage] = useState(0);
    const [guideList, setGuideList] = useState([]);

    useEffect(() => {
        const fetchGuideData = async () => {
          try {
            const data = await getHotGuideList();
            console.log(data.data.guide_list);
            setGuideList(data.data.guide_list);
          } catch (error) {
            console.error('Error fetching guide data:', error);
          }
        };
    
        fetchGuideData();
      }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>HOT 5</div>
            <Carousel gap={16} offset={36} pages={guideList}
        pageWidth={screenWidth - (16 + 36) * 2} onPageChange={handlePageChange}/>
        {guideList.length > 0 && currentPage < guideList.length && (
            <div className={styles.text}>
                {guideList[currentPage].rank}위 {guideList[currentPage].song_title} - {guideList[currentPage].singer}
            </div>
        )}
        </div>
    );
}

export default Hot5Guides;