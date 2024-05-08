import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import SideBar from "./SideBar";
import logo from "../assets/images/LOGO.png";
import ShootingStar from "./ShootingStar";

const Layout = () => {
  return (
    <section className={styles.layout}>
      <ShootingStar />
      <div className={styles.header}>
        <img src={logo} className={styles.logoimg} />
        <div className={styles.sidebar}>
          <SideBar />
        </div>
      </div>
      <div className={styles.mainContent}>
        <Outlet />
        <Footer />
      </div>
    </section>
  );
};

export default Layout;
