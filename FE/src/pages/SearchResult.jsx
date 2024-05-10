import { useLocation } from "react-router-dom";
import SearchBar from "../components/guide/SearchBar";
import SearchResultList from "../components/guide/SearchResultList";
import styles from "../styles/Home.module.css";

function SearchResult() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");


  return (
    <div>
      <SearchBar params={searchQuery}/>
      <div className={styles.homeContainer}>
        <SearchResultList params={searchQuery}/>
      </div>
    </div>
  );
}

export default SearchResult;