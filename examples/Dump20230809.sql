-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: 54.215.204.22    Database: team1_db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `list`
--

DROP TABLE IF EXISTS `list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list` (
  `list_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `list_name` varchar(255) NOT NULL,
  PRIMARY KEY (`list_id`),
  KEY `fk_list_user1_idx` (`user_id`),
  CONSTRAINT `fk_list_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list`
--

LOCK TABLES `list` WRITE;
/*!40000 ALTER TABLE `list` DISABLE KEYS */;
INSERT INTO `list` VALUES (2,2,'Favorites'),(3,3,'Favorites'),(4,4,'Favorites'),(5,5,'Favorites'),(6,6,'Favorites'),(11,10,'Favorites'),(20,20,'Favorites'),(48,48,'Favorites');
/*!40000 ALTER TABLE `list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `list_entry`
--

DROP TABLE IF EXISTS `list_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list_entry` (
  `entry_id` int NOT NULL AUTO_INCREMENT,
  `list_id` int NOT NULL,
  `id` varchar(255) NOT NULL,
  `backdrop_path` varchar(255) NOT NULL,
  `original_title` varchar(255) NOT NULL,
  `media_type` varchar(255) NOT NULL,
  `overview` text NOT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `fk_list_entry_list1_idx` (`list_id`),
  CONSTRAINT `fk_list_entry_list1` FOREIGN KEY (`list_id`) REFERENCES `list` (`list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list_entry`
--

LOCK TABLES `list_entry` WRITE;
/*!40000 ALTER TABLE `list_entry` DISABLE KEYS */;
INSERT INTO `list_entry` VALUES (51,11,'884605','/ol3y1SYMNgzo7bdunSODMTcEbyQ.jpg','No Hard Feelings','movie','On the brink of losing her childhood home, Maddie discovers an intriguing job listing: wealthy helicopter parents looking for someone to “date” their introverted 19-year-old son, Percy, before he leaves for college. To her surprise, Maddie soon discovers the awkward Percy is no sure thing.'),(92,11,'439079','/fgsHxz21B27hOOqQBiw9L6yWcM7.jpg','The Nun','movie','When a young nun at a cloistered abbey in Romania takes her own life, a priest with a haunted past and a novitiate on the threshold of her final vows are sent by the Vatican to investigate. Together they uncover the order’s unholy secret. Risking not only their lives but their faith and their very souls, they confront a malevolent force in the form of the same demonic nun that first terrorized audiences in “The Conjuring 2” as the abbey becomes a horrific battleground between the living and the damned.'),(93,11,'663712','/cRdA9xjHBbobw4LJFsQ3j1CgpVq.jpg','Terrifier 2','movie','After being resurrected by a sinister entity, Art the Clown returns to Miles County where he must hunt down and destroy a teenage girl and her younger brother on Halloween night.  As the body count rises, the siblings fight to stay alive while uncovering the true nature of Art\'s evil intent.'),(94,11,'4929','/z1mGshfVVUNyjeLaqSzO56ROGk6.jpg','Hang \'em High','movie','Marshall Jed Cooper survives a hanging, vowing revenge on the lynch mob that left him dangling. To carry out his oath for vengeance, he returns to his former job as a lawman. Before long, he\'s caught up with the nine men on his hit list and starts dispensing his own brand of Wild West justice.'),(95,11,'615656','/zN41DPmPhwmgJjHwezALdrdvD0h.jpg','Meg 2: The Trench','movie','An exploratory dive into the deepest depths of the ocean of a daring research team spirals into chaos when a malevolent mining operation threatens their mission and forces them into a high-stakes battle for survival.'),(96,11,'569094','/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg','Spider-Man: Across the Spider-Verse','movie','After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most.'),(97,48,'298618','/yF1eOkaYvwiORauRCPWznV9xVvi.jpg','The Flash','movie','When his attempt to save his family inadvertently alters the future, Barry Allen becomes trapped in a reality in which General Zod has returned and there are no Super Heroes to turn to. In order to save the world that he is in and return to the future that he knows, Barrys only hope is to race for his life. But will making the ultimate sacrifice be enough to reset the universe?'),(98,48,'667538','/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg','Transformers: Rise of the Beasts','movie','When a new threat capable of destroying the entire planet emerges, Optimus Prime and the Autobots must team up with a powerful faction known as the Maximals. With the fate of humanity hanging in the balance, humans Noah and Elena will do whatever it takes to help the Transformers as they engage in the ultimate battle to save Earth.'),(99,48,'457332','/dWvDlTkt9VEGCDww6IzNRgm8fRQ.jpg','Hidden Strike','movie','Two elite soldiers must escort civilians through a gauntlet of gunfire and explosions.'),(100,48,'1070514','/aEVYGOIrhWDrNoZxVhhSazmRjeR.jpg','Zom 100: Bucket List of the Dead','movie','Bullied by his boss, worked around the clock, he\'s nothing more than a corporate drone. All it takes is a zombie outbreak for him to finally feel alive!'),(101,48,'887767','/upOi9aVqPPky7Ba4GsiyFdjc82I.jpg','Last Shoot Out','movie','Soon after a newlywed learns that her husband had her father shot down, she flees from the Callahan ranch in fear. She\'s rescued by a gunman who safeguards her at a remote outpost as he staves off her husband\'s attempts to reclaim his bride.'),(102,48,'4929','/z1mGshfVVUNyjeLaqSzO56ROGk6.jpg','Hang \'em High','movie','Marshall Jed Cooper survives a hanging, vowing revenge on the lynch mob that left him dangling. To carry out his oath for vengeance, he returns to his former job as a lawman. Before long, he\'s caught up with the nine men on his hit list and starts dispensing his own brand of Wild West justice.'),(103,48,'982752','/2R1TrLu42l70oGPmYx38HSbrdzh.jpg','American Carnage','movie','After a governor issues an executive order to arrest the children of undocumented immigrants, the detained youth are offered an opportunity to have their charges dropped by volunteering to provide care to the elderly. Once inside the elder care facility, however, they discover more twisted secrets than they could have possibly imagined.'),(104,48,'84958','/rzGcehSDAon8Y1zV2TGQkKM76Y6.jpg','undefined','tv','After stealing the Tesseract during the events of “Avengers: Endgame,” an alternate version of Loki is brought to the mysterious Time Variance Authority, a bureaucratic organization that exists outside of time and space and monitors the timeline. They give Loki a choice: face being erased from existence due to being a “time variant” or help fix the timeline and stop a greater threat.');
/*!40000 ALTER TABLE `list_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first` varchar(255) NOT NULL,
  `last` varchar(255) NOT NULL,
  `pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'MikeWill','$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6','Mike','Will','default'),(3,'test12345','$2b$10$cIXalSJNwlX3B.KSSKe7/elEjaErIxDhLk/x0Jn12Tt7eO82lw.X.','Tom','Delonge','3ea8c5df-f176-4704-b88a-bcde02e03eb0'),(4,'imissyou182','$2b$10$ZBDPG.2bHMesK1jFJujadOC4Ttn1vuoIlFKsr/M4UMLyP3EHD3Ftm','Travis','Barker','default'),(5,'markh182','$2b$10$m3L/wUZYFVPY8G9BDv8AqOhkeA9gojqucdOeo51hQM03L5ttzK6T6','Mark','Hoppus','default'),(6,'greenday','$2b$10$Pg6idVkZ27hsUuCGkNtGEOmmbaDDjUKNUCJNUpGmNPfNzBt51MDCe','Billie','Armstrong','9362c670-fc86-43e9-9b63-956308d86457'),(9,'username','password','John','Smith',NULL),(10,'SiteAdmin','$2b$10$g.g3myZ.Irxk43YFWub0wOqVr6mM8Xzjc.B7OH.9ar3WerCoQz7o.','Super','Admin','fb0401d3-6e84-4d8f-9e0b-5ecf3503acae'),(11,'username','password','John','Smith',NULL),(20,'asdfasdf','$2b$10$FhGM8GaWYAQF.fe/vRc3luuAplI6anMmF5SmWOJ26xwoVfxHXlFSS','asdfsdaf','asdfasdf','default'),(48,'pass12345','$2b$10$IXPmjE.rf.A8MN7H4oZQbudnrqyarqbLVWZOA7ZYByAyVevUNauv6','Stacy','Kirchner','default');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-09 23:47:08
