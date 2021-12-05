-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: collegeDB
-- ------------------------------------------------------
-- Server version	8.0.25

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

DROP DATABASE IF EXISTS `collegeDB`;
CREATE DATABASE `collegeDB`;
USE `collegeDB`;

--
-- Table structure for table `dept`
--

DROP TABLE IF EXISTS `dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dept` (
  `did` varchar(3) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dept`
--

LOCK TABLES `dept` WRITE;
/*!40000 ALTER TABLE `dept` DISABLE KEYS */;
INSERT INTO `dept` VALUES ('ART','Arts Department'),('CIV','Department of Civil Engineering'),('COM','Department of Computing'),('ENG','English Department'),('MAT','Department of Mathematics'),('MEC','Department of Mechanical Engineering'),('SOC','Department of Social Studies');
/*!40000 ALTER TABLE `dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `mid` varchar(3) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `credits` ENUM('5','10','15'),
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES ('ALG','Algebra','5'),('CRW','Creative Writing','10'),('DB','Database Technology','5'),('JAV','Java Programming','10'),('LNG','Long Division','5'),('MFL','Mechanics of Fluids','5'),('MOB','Mobile Applications Development','5'),('MSO','Mechanics of Solids','5'),('POT','Poetry','5'),('SHA','Shakespeare','5'),('TTB','Times Tables','10');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `sid` varchar(4) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `gpa` double(2,1) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('G001','Sean Smith',3.2),('G002','Alison Conners',3.3),('G003','Thomas Murphy',2.9),('G004','Anne Greene',2.3),('G005','Tom Riddle',3.2),('G006','Brian Collins',3.8),('G007','Fiona O\'Hehir',3.0),('G008','George Johnson',2.3),('G009','Albert Newton',3.2),('G010','Marie Yeats',2.1),('G011','Jonathon Small',2.2),('G012','Barbara Harris',2.3),('G013','Oliver J. Flanagan',2.1),('G014','Neil Blaney',3.4),('G015','Nigel Delaney',1.9),('G016','Johnny Connors',2.9),('G017','Bill Turpin',1.7),('G018','Amanda Knox',2.8),('G019','James Joyce',3.9),('G020','Alice L\'Estrange',3.3);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_module`
--

DROP TABLE IF EXISTS `student_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_module` (
  `sid` varchar(4) NOT NULL,
  `mid` varchar(3) NOT NULL,
  PRIMARY KEY (`sid`,`mid`),
  KEY `mid` (`mid`),
  CONSTRAINT `student_module_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`),
  CONSTRAINT `student_module_ibfk_2` FOREIGN KEY (`mid`) REFERENCES `module` (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_module`
--

LOCK TABLES `student_module` WRITE;
/*!40000 ALTER TABLE `student_module` DISABLE KEYS */;
INSERT INTO `student_module` VALUES ('G006','ALG'),('G009','ALG'),('G018','ALG'),('G004','CRW'),('G007','CRW'),('G008','CRW'),('G014','CRW'),('G001','JAV'),('G015','JAV'),('G003','LNG'),('G006','LNG'),('G016','LNG'),('G018','LNG'),('G002','MFL'),('G003','MFL'),('G009','MFL'),('G016','MFL'),('G001','MOB'),('G015','MOB'),('G019','MOB'),('G002','MSO'),('G016','MSO'),('G004','POT'),('G008','POT'),('G014','POT'),('G004','SHA'),('G017','SHA'),('G005','TTB'),('G006','TTB'),('G018','TTB');
/*!40000 ALTER TABLE `student_module` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-12 12:49:40
