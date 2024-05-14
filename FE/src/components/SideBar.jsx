import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SideBar.module.css";
import { faBars, faL, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const SideBar = () => {
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false); // Boolean state to handle open/close
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    console.log("Sidebar isOpen:", isOpen); // Check if isOpen changes
    const handleOutsideClick = (event) => {
      if (!event.target.closest(`.${styles.sideMenu}`) && isOpen) {
        console.log("Clicked outside, closing sidebar");
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);
  console.log(user);

  const MenuList = [
    { name: "Home", path: "/home" },
    { name: "Video Editor", path: "/videoeditor" },
    { name: "ShortForm", path: "/showShortForm" },
    { name: "Ranking", path: "/ranking" },
    { name: "My Page", path: "/mypage" },
    { name: "Video List", path: "/guideDetail" },
    { name: "Upload Guide", path: "/guideUpload" },
  ];
  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleSidebar = (event) => {
    event.stopPropagation(); // Stop click event from propagating to window
    setIsOpen(!isOpen);
  };
  return (
    <div className={`${styles.mobileMenu} ${styles.hide}`}>
      <div
        className={styles.sideMenu}
        style={{ width: isOpen ? "220px" : "0px" }}
      >
        <div className={styles.toggleMenu} onClick={toggleSidebar}>
          <FontAwesomeIcon
            icon={isOpen ? faXmark : faBars}
            style={{ color: "black" }}
          />
        </div>
        <img
          src={user.profileImgUrl}
          alt="profile"
          style={{
            height: "10vh",
            width: "20vw",
            display: "flex",
            marginLeft: "5vw",
            marginBottom: "2.5vh",
            borderRadius: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <div className={styles.userName}>
          <span className={styles.userNickname}>"{user.nickname}"</span> 님
          안녕하세요!
        </div>
        <ul className={styles.mobileSide}>
          {MenuList.map((item, index) => (
            <li key={index} onClick={() => handleMenuItemClick(item.path)}>
              <a href="#">{item.name}</a>
            </li>
          ))}
        </ul>
        <div
          className={styles.withdrawLink}
          onClick={() => {
            navigate("/withdraw");
            setIsOpen(false);
          }}
        >
          회원 탈퇴
        </div>
      </div>
      <div className={styles.menuOpen} onClick={toggleSidebar}>
        {isOpen ? (
          ""
        ) : (
          <FontAwesomeIcon icon={faBars} style={{ color: "#f9f9f9" }} />
        )}
      </div>
      <div className={styles.loginButton}></div>
    </div>
  );
};

export default SideBar;
