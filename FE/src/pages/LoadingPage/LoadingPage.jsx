import React from 'react';
import styles from './LoadingPage.module.css'; // Import your CSS module
import Models from '../../components/Models/Models';

const LoadingPage = ({ progress }) => {
  return (
    <div className={styles.loadingPage}>
      <Models/>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>
      <p>Uploading... {progress}%</p>
    </div>
  );
};

export default LoadingPage;
