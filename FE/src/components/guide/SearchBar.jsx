import {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/guide/SearchBar.module.css"
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Close"

function SearchBar(){
    
  const location = useLocation();


    const [search, setSearch] = useState("");
    const navigation = useNavigate();

    useEffect(()=> {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get("q");
        setSearch(searchQuery);
    },[location]);

    const onChange = (e) => {
        setSearch(e.target.value);
    }

    const onSubmit = () => {
        if(search===""){
            return;
        }
        navigation("/searchResult?q="+search, { state: { search } });
    };

    const onCancel = () => {
        setSearch("");
    };


    return (
        <div className={styles.container}>
             <input className={styles.searchBar} type="text" placeholder="노래 검색" value={search || ""} onChange={onChange} onKeyDown={(e) => { if(e.key === "Enter") onSubmit(); }}/>
             {search && ( 
                <CancelIcon
                    className={styles.cancelIcon}
                    onClick={onCancel}
                    style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", color:"gray"}}
                />
            )}
             <SearchIcon
          className={styles.searchIcon}
          onClick={onSubmit}
          style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)" }}
        />
        </div>
    )
}

export default SearchBar;