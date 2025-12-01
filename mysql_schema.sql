-- MySQL dump 10.13  Distrib 9.4.0, for macos26.0 (arm64)
--
-- Host: localhost    Database: partner_report
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `partner_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `join_date` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `tier` varchar(50) DEFAULT NULL,
  `country_manager` varchar(255) DEFAULT NULL,
  `country_manager_tel` varchar(50) DEFAULT NULL,
  `Country_Rank` int DEFAULT NULL,
  `global_rank` int DEFAULT NULL,
  `Alternate_Accounts` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `current_tier` varchar(20) DEFAULT 'Bronze',
  `three_month_avg_commission` decimal(10,2) DEFAULT '0.00',
  `tier_reward_percentage` decimal(5,2) DEFAULT '0.00',
  `tier_last_calculated` timestamp NULL DEFAULT NULL,
  `tier_status` varchar(20) DEFAULT 'stable',
  `previous_tier` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`partner_id`),
  KEY `idx_country_rank` (`Country_Rank`),
  KEY `idx_partner_tier` (`current_tier`),
  KEY `idx_partner_avg_commission` (`three_month_avg_commission`),
  KEY `idx_global_rank` (`global_rank`),
  CONSTRAINT `partners_ibfk_tier` FOREIGN KEY (`current_tier`) REFERENCES `partner_tier_config` (`tier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `binary_user_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `joinDate` date DEFAULT NULL,
  `partnerId` varchar(20) DEFAULT NULL,
  `tier` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `accountNumber` text,
  `sub_partner` tinyint(1) DEFAULT '0',
  `preferredLanguage` varchar(100) DEFAULT NULL,
  `commissionPlan` varchar(100) DEFAULT NULL,
  `trackingLinkUsed` varchar(255) DEFAULT NULL,
  `total_trades` int DEFAULT NULL,
  `lifetimeDeposits` decimal(15,2) DEFAULT NULL,
  `PNL` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`binary_user_id`),
  KEY `idx_partnerId` (`partnerId`),
  KEY `idx_country` (`country`),
  KEY `idx_tier` (`tier`),
  KEY `idx_joinDate` (`joinDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `binary_user_id_1` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `payment_id` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `transaction_time` datetime DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `payment_gateway_code` varchar(100) DEFAULT NULL,
  `payment_type_code` varchar(100) DEFAULT NULL,
  `account_id` varchar(50) DEFAULT NULL,
  `client_loginid` varchar(50) DEFAULT NULL,
  `remark` text,
  `transfer_fees` decimal(15,2) DEFAULT NULL,
  `is_pa` varchar(10) DEFAULT NULL,
  `amount_usd` decimal(15,2) DEFAULT NULL,
  `transfer_type` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `payment_processor` varchar(100) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `affiliate_id` varchar(50) DEFAULT NULL,
  `target_loginid` varchar(50) DEFAULT NULL,
  `target_is_pa` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_binary_user_id` (`binary_user_id_1`),
  KEY `idx_affiliate_id` (`affiliate_id`),
  KEY `idx_transaction_time` (`transaction_time`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=1625 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `binary_user_id` varchar(50) DEFAULT NULL,
  `loginid` varchar(50) DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `app_name` varchar(100) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `contract_type` varchar(100) DEFAULT NULL,
  `asset_type` varchar(100) DEFAULT NULL,
  `asset` varchar(255) DEFAULT NULL,
  `number_of_trades` int DEFAULT NULL,
  `closed_pnl_usd` decimal(15,2) DEFAULT NULL,
  `closed_pnl_usd_abook` decimal(15,2) DEFAULT NULL,
  `closed_pnl_usd_bbook` decimal(15,2) DEFAULT NULL,
  `floating_pnl_usd` decimal(15,2) DEFAULT NULL,
  `floating_pnl` decimal(15,2) DEFAULT NULL,
  `expected_revenue_usd` decimal(15,2) DEFAULT NULL,
  `closed_pnl` decimal(15,2) DEFAULT NULL,
  `swaps_usd` decimal(15,2) DEFAULT NULL,
  `volume_usd` decimal(15,2) DEFAULT NULL,
  `is_synthetic` tinyint(1) DEFAULT NULL,
  `is_financial` tinyint(1) DEFAULT NULL,
  `app_markup_usd` decimal(15,2) DEFAULT NULL,
  `affiliated_partner_id` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`),
  KEY `idx_binary_user_id` (`binary_user_id`),
  KEY `idx_affiliated_partner_id` (`affiliated_partner_id`),
  KEY `idx_platform` (`platform`),
  KEY `idx_contract_type` (`contract_type`),
  CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`binary_user_id`) REFERENCES `clients` (`binary_user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3788 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_links`
--

DROP TABLE IF EXISTS `partner_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_links` (
  `commission_id` int NOT NULL AUTO_INCREMENT,
  `partner_id` varchar(20) NOT NULL,
  `commission_plan` varchar(100) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `target` varchar(100) DEFAULT NULL,
  `language` varchar(10) DEFAULT 'en',
  `url` varchar(2048) NOT NULL,
  `landing_page` varchar(2048) DEFAULT NULL,
  `description` text,
  `click_count` int DEFAULT '0',
  `conversion_count` int DEFAULT '0',
  `status` enum('active','inactive','pending','archived') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`commission_id`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_commission_plan` (`commission_plan`),
  CONSTRAINT `partner_links_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`partner_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge_name` varchar(50) NOT NULL,
  `badge_criteria` varchar(50) NOT NULL,
  `badge_trigger` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `badge_name` (`badge_name`),
  KEY `idx_badge_criteria` (`badge_criteria`),
  KEY `idx_badge_name` (`badge_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_badges`
--

DROP TABLE IF EXISTS `partner_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_badges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partner_id` varchar(20) NOT NULL,
  `badge_name` varchar(50) NOT NULL,
  `earned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_partner_badge` (`partner_id`,`badge_name`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_badge_name` (`badge_name`),
  CONSTRAINT `partner_badges_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`partner_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_tier_config`
--

DROP TABLE IF EXISTS `partner_tier_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_tier_config` (
  `tier_name` varchar(20) NOT NULL,
  `min_avg_commission` decimal(10,2) NOT NULL,
  `max_avg_commission` decimal(10,2) DEFAULT NULL,
  `reward_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tier_order` int NOT NULL,
  `tier_color` varchar(20) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tier_name`),
  KEY `idx_tier_order` (`tier_order`),
  KEY `idx_avg_range` (`min_avg_commission`,`max_avg_commission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_tiers`
--

DROP TABLE IF EXISTS `partner_tiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_tiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tier` varchar(50) NOT NULL,
  `range_description` varchar(255) DEFAULT NULL,
  `reward` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_monthly_commissions`
--

DROP TABLE IF EXISTS `partner_monthly_commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_monthly_commissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partner_id` varchar(20) NOT NULL,
  `month_year` varchar(7) NOT NULL COMMENT 'Format: YYYY-MM',
  `year_val` int NOT NULL,
  `month_val` int NOT NULL,
  `base_commission` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tier_reward` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_commission` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tier_at_month_end` varchar(20) DEFAULT NULL,
  `three_month_average` decimal(15,2) DEFAULT NULL,
  `tier_reward_percentage` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_partner_month` (`partner_id`,`month_year`),
  KEY `tier_at_month_end` (`tier_at_month_end`),
  KEY `idx_partner_id` (`partner_id`),
  KEY `idx_month_year` (`month_year`),
  KEY `idx_partner_month_year` (`partner_id`,`month_year`),
  CONSTRAINT `partner_monthly_commissions_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`partner_id`) ON DELETE CASCADE,
  CONSTRAINT `partner_monthly_commissions_ibfk_2` FOREIGN KEY (`tier_at_month_end`) REFERENCES `partner_tier_config` (`tier_name`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-01 12:07:57
