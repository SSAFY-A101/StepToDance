import SearchBar from "../components/guide/SearchBar";
import Test from "../components/guide/Test";
import Hot5Guides from "../components/guide/Hot5Guides";
import GuideList from "../components/guide/GuideList";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <div>
      <SearchBar />
      <div className={styles.homeContainer}>
        <Test />
        <Hot5Guides />
        <GuideList />
      </div>
    </div>
  );
}

export default Home;
