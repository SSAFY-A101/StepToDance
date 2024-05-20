-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: k10a101.p.ssafy.io    Database: steptodance
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feedback_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_tbl` (
  `feedback_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `score` double DEFAULT NULL,
  `thumbnail_img_url` varchar(3000) DEFAULT NULL,
  `video_url` varchar(3000) DEFAULT NULL,
  `guide_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `highlight_section_end_at` time(6) DEFAULT NULL,
  `highlight_section_start_at` time(6) DEFAULT NULL,
  PRIMARY KEY (`feedback_id`),
  KEY `FKrl4psblocirgs7t5akacd3l6c` (`guide_id`),
  KEY `FKt0y9auvm9x6oxqss78shecqui` (`user_id`),
  CONSTRAINT `FKrl4psblocirgs7t5akacd3l6c` FOREIGN KEY (`guide_id`) REFERENCES `guide_tbl` (`guide_id`),
  CONSTRAINT `FKt0y9auvm9x6oxqss78shecqui` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_tbl`
--

/*!40000 ALTER TABLE `feedback_tbl` DISABLE KEYS */;
INSERT INTO `feedback_tbl` VALUES (66,'2024-05-15 15:15:55.645699',94.9680237435898,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/66.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/66.mp4',213,2,NULL,NULL),(69,'2024-05-15 15:48:42.345030',90.06350376153847,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/69.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/69.mp4',214,3,NULL,NULL),(79,'2024-05-19 12:16:08.304721',63.405033076923075,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/79.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/79.mp4',215,2,NULL,NULL),(80,'2024-05-19 13:58:46.163826',91.78711376271187,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/80.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/80.mp4',248,8,NULL,NULL),(88,'2024-05-19 19:57:22.038880',97.84949308064517,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/88.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/88.mp4',248,2,NULL,NULL),(89,'2024-05-19 20:06:41.967077',86.15691047445256,'https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/thumbnail/89.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/feedback/89.mp4',214,2,NULL,NULL);
/*!40000 ALTER TABLE `feedback_tbl` ENABLE KEYS */;

--
-- Table structure for table `genre_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre_tbl` (
  `genre_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre_tbl`
--

/*!40000 ALTER TABLE `genre_tbl` DISABLE KEYS */;
INSERT INTO `genre_tbl` VALUES (1,'2024-04-24 13:58:32.000000','k-pop'),(2,'2024-05-13 10:28:58.000000','B-boying'),(3,'2024-05-13 10:29:00.000000','hip-hop'),(4,'2024-05-13 10:29:01.000000','popping'),(5,'2024-05-13 10:29:01.000000','korean traditional dance');
/*!40000 ALTER TABLE `genre_tbl` ENABLE KEYS */;

--
-- Table structure for table `guide_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide_tbl` (
  `guide_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `singer` varchar(255) DEFAULT NULL,
  `song_title` varchar(255) DEFAULT NULL,
  `thumbnail_img_url` varchar(3000) DEFAULT NULL,
  `video_url` varchar(3000) DEFAULT NULL,
  `genre_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `highlight_section_end_at` time(6) DEFAULT NULL,
  `highlight_section_start_at` time(6) DEFAULT NULL,
  PRIMARY KEY (`guide_id`),
  KEY `FKreks6l1ubyecf9vvig7nk4yst` (`genre_id`),
  KEY `FKhrisyuv6bibyokyg89xt54pal` (`user_id`),
  CONSTRAINT `FKhrisyuv6bibyokyg89xt54pal` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`user_id`),
  CONSTRAINT `FKreks6l1ubyecf9vvig7nk4yst` FOREIGN KEY (`genre_id`) REFERENCES `genre_tbl` (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide_tbl`
--

/*!40000 ALTER TABLE `guide_tbl` DISABLE KEYS */;
INSERT INTO `guide_tbl` VALUES (212,'2024-05-15 13:41:26.383383','black pink(블랙핑크)','lovesick girls','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/212.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/212.mp4',1,2,'00:01:07.000000','00:00:51.000000'),(213,'2024-05-15 13:53:41.280823','ive(아이브)','after like','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/213.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/213.mp4',1,2,'00:00:05.000000','00:00:00.000000'),(214,'2024-05-15 14:05:06.366049','Dinamic Duo, 이영지','smoke','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/214.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/214.mp4',1,2,'00:00:31.000000','00:00:00.000000'),(215,'2024-05-15 14:10:49.209391','KISS OF LIFE(키스오브라이프)','Midas Touch','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/215.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/215.mp4',1,2,'00:01:13.000000','00:00:55.000000'),(223,'2024-05-16 03:24:48.370179','아일릿','Magnetic','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/223.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/223.mp4',1,2,NULL,NULL),(225,'2024-05-16 03:55:08.436456','Justin Bieber','Intentions POPPIN','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/225.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/225.mp4',4,2,NULL,NULL),(242,'2024-05-19 06:42:07.305944','Will.I.Am','B Boyz (feat. MC Supernatural)','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/242.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/242.mp4',3,2,NULL,NULL),(243,'2024-05-19 06:53:34.549592','이선희','여우비 한국무용 버전','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/243.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/243.mp4',5,2,NULL,NULL),(244,'2024-05-19 08:56:21.129717','스우파_ygx','예리 비보잉 영상','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/244.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/244.mp4',2,2,NULL,NULL),(246,'2024-05-19 09:10:25.128763','Taufiq Akmal','IN THE CLUB','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/246.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/246.mp4',3,2,NULL,NULL),(247,'2024-05-19 09:33:04.778353','SKNUF','입문자를 위한 B-boying Beginner Class','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/247.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/247.mp4',2,2,NULL,NULL),(248,'2024-05-19 13:45:54.849328','𝐃𝐨𝐣𝐚 𝐂𝐚𝐭','𝐏𝐚𝐢𝐧𝐭 𝐓𝐡𝐞 𝐓𝐨𝐰𝐧 𝐑𝐞𝐝','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/248.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/248.mp4',3,2,'00:00:14.000000','00:00:00.000000'),(252,'2024-05-19 15:48:10.914043','STAYC(스테이씨)','Teddy Bear','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/252.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/252.mp4',1,8,'00:03:21.000000','00:00:00.000000'),(255,'2024-05-20 00:17:10.813185','','TEST.mp4','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/thumbnail/255.png','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/guide/255.mp4',1,8,'00:00:12.000000','00:00:00.000000');
/*!40000 ALTER TABLE `guide_tbl` ENABLE KEYS */;

--
-- Table structure for table `shortform_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shortform_tbl` (
  `shortform_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `video_url` varchar(3000) DEFAULT NULL,
  `guide_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`shortform_id`),
  KEY `FKim8j93qv3w0guss13g91ax0cj` (`guide_id`),
  KEY `FKreuhcgtl632g2xv998rxsgwgk` (`user_id`),
  CONSTRAINT `FKim8j93qv3w0guss13g91ax0cj` FOREIGN KEY (`guide_id`) REFERENCES `guide_tbl` (`guide_id`),
  CONSTRAINT `FKreuhcgtl632g2xv998rxsgwgk` FOREIGN KEY (`user_id`) REFERENCES `user_tbl` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shortform_tbl`
--

/*!40000 ALTER TABLE `shortform_tbl` DISABLE KEYS */;
INSERT INTO `shortform_tbl` VALUES (93,'2024-05-19 19:58:02.814389','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/shortform/93.mp4',248,8),(94,'2024-05-19 19:59:58.844344','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/shortform/94.mp4',248,2),(95,'2024-05-19 20:07:10.236809','https://step-to-dance.s3.ap-northeast-2.amazonaws.com/shortform/95.mp4',214,2);
/*!40000 ALTER TABLE `shortform_tbl` ENABLE KEYS */;

--
-- Table structure for table `timestamp_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timestamp_tbl` (
  `timestamp_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `start_at` time(6) DEFAULT NULL,
  `feedback_id` bigint DEFAULT NULL,
  PRIMARY KEY (`timestamp_id`),
  KEY `FK9j3blqba6udoe1wyplv77xufd` (`feedback_id`),
  CONSTRAINT `FK9j3blqba6udoe1wyplv77xufd` FOREIGN KEY (`feedback_id`) REFERENCES `feedback_tbl` (`feedback_id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timestamp_tbl`
--

/*!40000 ALTER TABLE `timestamp_tbl` DISABLE KEYS */;
INSERT INTO `timestamp_tbl` VALUES (12,'2024-05-15 15:16:20.563509','00:01:08.000000',66),(15,'2024-05-15 15:48:50.632969','00:00:14.000000',69),(16,'2024-05-15 15:48:50.638150','00:00:17.000000',69),(33,'2024-05-19 12:16:10.508691','00:00:00.000000',79),(34,'2024-05-19 13:58:53.153112','00:00:12.000000',80),(90,'2024-05-19 20:06:52.359233','00:00:11.000000',89),(91,'2024-05-19 20:06:52.366487','00:00:25.000000',89),(92,'2024-05-19 20:06:52.368202','00:00:28.000000',89),(93,'2024-05-19 20:06:52.369889','00:00:32.000000',89);
/*!40000 ALTER TABLE `timestamp_tbl` ENABLE KEYS */;

--
-- Table structure for table `user_tbl`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tbl` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `kakao_id` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `profile_img_url` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tbl`
--

/*!40000 ALTER TABLE `user_tbl` DISABLE KEYS */;
INSERT INTO `user_tbl` VALUES (2,'2024-04-24 06:56:07.873858','3451614139','백지윤','http://k.kakaocdn.net/dn/A4ndt/btsGEjkckZz/5QLRasfasorpYuXAPP3egk/img_640x640.jpg'),(3,'2024-04-24 07:38:44.808790','3438855909','진하','http://k.kakaocdn.net/dn/bL6w6m/btsCSaRyqnG/kb5HpSUkZ6Zgbn3KfRlywk/m1.jpg'),(4,'2024-04-24 07:38:48.820184','3451677525','근영','http://k.kakaocdn.net/dn/kAH0f/btsFofDOdWR/WAFYLUIp95QEPohGlKY9Nk/img_640x640.jpg'),(7,'2024-05-13 07:31:24.991709','3480044990','최웅렬','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640'),(8,'2024-05-14 01:08:50.547798','3453026429','이민지','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640'),(10,'2024-05-17 00:31:21.377774','3485435726','성준킴','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640'),(11,'2024-05-17 08:39:51.188622','3486119912','백지훈','http://k.kakaocdn.net/dn/bln8Ve/btr3GSsd25n/vgJ5KXmA5ac79lY8ZWWdV0/img_640x640.jpg');
/*!40000 ALTER TABLE `user_tbl` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-20  9:29:15
