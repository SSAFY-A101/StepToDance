import React from 'react';
import styles from './LoadingPage.module.css'; // Import your CSS module
import Models from '../../components/Models/Models';

const LoadingPage = () => {
  return (
    <div className={styles.loadingPage}>
      <Models/>
      <p>업로드중</p>
    </div>
  );
};

export default LoadingPage;
