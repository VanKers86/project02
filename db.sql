-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 03 jun 2013 om 17:24
-- Serverversie: 5.5.24-log
-- PHP-versie: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `dietapp`
--
DROP DATABASE `dietapp`;
CREATE DATABASE `dietapp` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dietapp`;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `communication`
--

DROP TABLE IF EXISTS `communication`;
CREATE TABLE IF NOT EXISTS `communication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_dietician_id` int(11) DEFAULT NULL,
  `from_customer_id` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `text` text,
  `to_dietician_id` int(11) DEFAULT NULL,
  `to_customer_id` int(11) DEFAULT NULL,
  `dietician_seen` enum('Y','N') DEFAULT 'N',
  `customer_seen` enum('Y','N') DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='	' AUTO_INCREMENT=20 ;

--
-- Gegevens worden uitgevoerd voor tabel `communication`
--

INSERT INTO `communication` (`id`, `from_dietician_id`, `from_customer_id`, `datetime`, `text`, `to_dietician_id`, `to_customer_id`, `dietician_seen`, `customer_seen`) VALUES
(13, NULL, 12, '2013-06-03 15:13:53', 'ik heb juist een nieuwe maaltijd toegevoegd', 1, NULL, 'Y', 'N'),
(14, 1, NULL, '2013-06-03 15:14:24', 'goed gedaan!', NULL, 12, 'N', 'N'),
(16, NULL, 12, '2013-06-03 17:21:07', 'Dag Alexandra, wanneer spreken we af voor de volgende consultatie? Ik kan donderdag 13 juni in de namiddag.', 1, NULL, 'Y', 'N'),
(17, 1, NULL, '2013-06-03 17:22:50', 'Dag Jasper. Donderdag 13 juni is goed voor mij. Gaat dit om 15u?', NULL, 12, 'N', 'N'),
(18, NULL, 12, '2013-06-03 17:23:10', '15u is perfect! Bedankt en tot dan!', 1, NULL, 'Y', 'N'),
(19, 1, NULL, '2013-06-03 17:23:28', 'Ok, staat genoteerd. Tot dan!', NULL, 12, 'N', 'N');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `customer_consultations`
--

DROP TABLE IF EXISTS `customer_consultations`;
CREATE TABLE IF NOT EXISTS `customer_consultations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `PAL` enum('Licht','Middelmatig','Zwaar') DEFAULT NULL,
  `bmi` double DEFAULT NULL,
  `kcal` int(11) DEFAULT NULL,
  `carbohydrates` double DEFAULT NULL,
  `sugars` double DEFAULT NULL,
  `fats` double DEFAULT NULL,
  `proteins` double DEFAULT NULL,
  `cholesterol` double DEFAULT NULL,
  `fibres` double DEFAULT NULL,
  `sodium` double DEFAULT NULL,
  `comments` text,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=37 ;

--
-- Gegevens worden uitgevoerd voor tabel `customer_consultations`
--

INSERT INTO `customer_consultations` (`id`, `customer_id`, `weight`, `height`, `PAL`, `bmi`, `kcal`, `carbohydrates`, `sugars`, `fats`, `proteins`, `cholesterol`, `fibres`, `sodium`, `comments`, `date`) VALUES
(26, 12, 105, 188, 'Licht', 29.7, 3543, 487.2, 88.6, 118.1, 97.4, 300, 30, 600, '', '2012-08-27 21:21:15'),
(27, 12, 101, 188, 'Licht', 28.6, 3448, 474.1, 86.2, 114.9, 94.8, 300, 30, 600, '', '2012-10-27 21:22:00'),
(28, 12, 98, 188, 'Licht', 27.7, 3377, 464.3, 84.4, 112.6, 92.9, 300, 30, 600, '', '2012-12-27 21:22:09'),
(29, 12, 94, 188, 'Licht', 26.6, 3282, 451.3, 82.1, 109.4, 90.3, 300, 30, 600, '', '2013-01-27 21:22:17'),
(30, 12, 99, 188, 'Licht', 28, 3400, 467.5, 85, 113.3, 93.5, 300, 30, 600, '', '2013-02-27 21:22:24'),
(31, 12, 92, 188, 'Licht', 26, 3234, 444.7, 80.9, 107.8, 88.9, 300, 30, 600, '', '2013-03-27 21:22:31'),
(32, 12, 87, 188, 'Licht', 24.6, 3116, 428.5, 77.9, 103.9, 85.7, 300, 30, 600, '', '2013-04-27 21:22:37'),
(33, 12, 83, 188, 'Licht', 23.5, 3021, 415.4, 75.5, 100.7, 83.1, 300, 30, 600, '', '2013-05-27 21:22:44'),
(35, 12, 83, 188, 'Licht', 23.5, 3021, 415.4, 72.5, 100.7, 83.1, 300, 30, 600, NULL, '2013-05-30 21:22:44');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(155) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `dietician_id` int(11) DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  `archive` enum('Y','N') DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;

--
-- Gegevens worden uitgevoerd voor tabel `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `password`, `dietician_id`, `gender`, `birthdate`, `date_added`, `archive`) VALUES
(12, 'Jasper Van Kerschaver', 'vankers86@hotmail.com', '0479/775996', 'f5d1278e8109edd94e1e4197e04873b9', 1, 'M', '1986-04-04', '2013-05-18 17:18:41', 'N');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `dieticians`
--

DROP TABLE IF EXISTS `dieticians`;
CREATE TABLE IF NOT EXISTS `dieticians` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(155) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `dieticians`
--

INSERT INTO `dieticians` (`id`, `name`, `email`, `password`, `photo`) VALUES
(1, 'Alexandra De Jonghe', 'alexandradejonghe@hotmail.com', 'f5d1278e8109edd94e1e4197e04873b9', '1profilepicture.jpg');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `food_categories`
--

DROP TABLE IF EXISTS `food_categories`;
CREATE TABLE IF NOT EXISTS `food_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Gegevens worden uitgevoerd voor tabel `food_categories`
--

INSERT INTO `food_categories` (`id`, `name`) VALUES
(1, 'Aardappelen en Graanproducten'),
(2, 'Groenten en Fruit'),
(3, 'Vlees en Vis'),
(4, 'Kaas en Melkproducten'),
(5, 'Smeer- en Bereidingsvetten'),
(6, 'Dranken');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `foods`
--

DROP TABLE IF EXISTS `foods`;
CREATE TABLE IF NOT EXISTS `foods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `calories` int(3) DEFAULT NULL,
  `proteins` varchar(4) DEFAULT NULL,
  `fats` varchar(4) DEFAULT NULL,
  `cholesterol` int(3) DEFAULT NULL,
  `carbohydrates` varchar(4) DEFAULT NULL,
  `sugars` varchar(4) DEFAULT NULL,
  `fibres` varchar(3) DEFAULT NULL,
  `sodium` int(4) DEFAULT NULL,
  `category_id` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=71 ;

--
-- Gegevens worden uitgevoerd voor tabel `foods`
--

INSERT INTO `foods` (`id`, `name`, `calories`, `proteins`, `fats`, `cholesterol`, `carbohydrates`, `sugars`, `fibres`, `sodium`, `category_id`) VALUES
(1, 'brood, wit', 271, '8,7', '2,9', 24, '52,5', '0,0', '1,0', 624, 1),
(2, 'brood, bruin', 242, '7,0', '3,6', 30, '45,6', '0,0', '5,7', 520, 1),
(3, 'brood, volkoren', 241, '11,1', '2,3', 35, '44,0', '0,0', '6,4', 575, 1),
(4, 'cake, boter', 444, '6,5', '24,2', 191, '50,0', '0,0', '0,7', 396, 1),
(5, 'koek, droog', 452, '7,5', '12,6', 3, '77,4', '0,0', '0,2', 268, 1),
(6, 'cornflakes', 368, '7,6', '1,0', 0, '82,3', '8,5', '2,5', 727, 1),
(7, 'muesli', 369, '10,5', '7,5', 0, '65,0', '20,0', '7,4', 41, 1),
(8, 'deegwaren, gekookt', 121, '4,0', '1,0', 22, '24,2', '0,0', '1,1', 15, 1),
(9, 'deegwaren, bruin, gekookt', 125, '5,4', '0,2', 2, '25,7', '0,5', '2,7', 17, 1),
(10, 'rijst, wit gekookt', 122, '2,8', '0,4', 0, '26,8', '0,1', '0,9', 2, 1),
(11, 'rijst, bruin, gekookt', 141, '2,6', '1,1', 0, '30,2', '0,8', '4,4', 8, 1),
(12, 'aardappelen, gekookt', 76, '2,3', '0,0', 0, '16,8', '1,1', '3,1', 2, 1),
(13, 'frieten', 249, '4,5', '8,6', 0, '38,3', '0,0', '0,0', 0, 1),
(14, 'chips', 542, '6,3', '34,0', 4, '52,6', '1,3', '3,6', 662, 1),
(15, 'bloemkool', 17, '2,0', '0,0', 0, '2,2', '2,0', '2,9', 10, 2),
(16, 'broccoli', 20, '3,0', '0,0', 0, '2,0', '2,0', '3,1', 12, 2),
(17, 'champignon', 11, '2,3', '0,0', 0, '0,4', '0,2', '1,5', 5, 2),
(18, 'courgette', 13, '1,2', '0,0', 0, '1,8', '1,7', '1,1', 3, 2),
(19, 'komkommer', 8, '0,8', '0,0', 0, '1,2', '1,2', '0,7', 5, 2),
(20, 'paprika', 28, '1,0', '0,0', 0, '6,0', '5,0', '1,8', 6, 2),
(21, 'sla', 7, '1,3', '0,0', 0, '0,4', '0,4', '1,3', 15, 2),
(22, 'tomaat', 11, '0,9', '0,0', 0, '1,9', '1,9', '1,3', 10, 2),
(23, 'wortel', 28, '0,4', '0,0', 0, '6,7', '6,5', '3,2', 38, 2),
(24, 'aardbei', 24, '0,7', '0,0', 0, '5,2', '4,7', '1,3', 0, 2),
(25, 'appel', 43, '0,3', '0,0', 0, '10,4', '9,7', '2,3', 1, 2),
(26, 'druif', 51, '0,9', '0,0', 0, '11,8', '11,3', '1,3', 0, 2),
(27, 'kiwi', 58, '1,0', '0,2', 0, '12,4', '8,5', '3,0', 3, 2),
(28, 'peer', 40, '0,6', '0,0', 0, '9,4', '8,9', '2,4', 1, 2),
(29, 'sinaasappel', 38, '1,1', '0,0', 0, '8,5', '8,5', '1,6', 1, 2),
(30, 'kip zonder vel, rauw', 132, '18,9', '6,2', 81, '0,0', '0,0', '0,0', 96, 3),
(31, 'konijn, rauw', 169, '19,2', '10,3', 64, '0,0', '0,0', '0,0', 63, 3),
(32, 'lamsvlees, rauw', 285, '15,0', '25,0', 80, '0,0', '0,0', '0,0', 69, 3),
(33, 'rundsvlees, biefstuk mager, rauw', 98, '22,8', '0,8', 64, '0,0', '0,0', '0,0', 52, 3),
(34, 'varkenshaas, rauw', 100, '19,8', '2,3', 51, '0,0', '0,0', '0,0', 54, 3),
(35, 'filet de sax', 119, '24,7', '2,0', 101, '0,6', '0,4', '0,2', 1409, 3),
(36, 'gehakt, varken-rund, rauw', 186, '17,9', '12,7', 62, '0,0', '0,0', '0,0', 558, 3),
(37, 'ham, gekookt', 113, '20,7', '2,9', 40, '0,9', '0,8', '0,0', 714, 3),
(38, 'kip curry', 350, '7,5', '31,7', 277, '8,7', '8,5', '0,0', 466, 3),
(39, 'salami', 352, '21,1', '29,7', 100, '0,3', '0,3', '0,0', 1422, 3),
(40, 'worst, varken, rauw', 236, '16,3', '19,0', 65, '0,0', '0,0', '0,0', 711, 3),
(41, 'haring', 216, '18,0', '16,0', 80, '0,0', '0,0', '0,0', 594, 3),
(42, 'koolvis', 73, '17,2', '0,5', 24, '0,0', '0,0', '0,0', 81, 3),
(43, 'oester', 73, '10,2', '1,8', 45, '4,2', '0,0', '0,0', 290, 3),
(44, 'tonijn', 114, '27,4', '0,5', 44, '0,0', '0,0', '0,0', 46, 3),
(45, 'zalm', 222, '18,4', '16,5', 45, '0,0', '0,0', '0,0', 63, 3),
(46, 'melk, mager', 34, '3,3', '0,1', 1, '4,9', '4,9', '0,0', 159, 4),
(47, 'mekl, halfvolle', 46, '3,3', '1,6', 6, '4,8', '4,8', '0,0', 42, 4),
(48, 'melk, volle', 63, '3,3', '3,5', 11, '4,7', '4,7', '0,0', 44, 4),
(49, 'kaas, 30+', 225, '26,4', '13,2', 42, '0,0', '0,0', '0,0', 57, 4),
(50, 'geitenkaas', 308, '17,1', '26,2', 76, '1,0', '1,0', '0,0', 381, 4),
(51, 'mozarella', 279, '22,9', '20,8', 59, '0,0', '0,0', '0,0', 169, 4),
(52, 'magere platte kaas 0%', 48, '8,2', '0,1', 0, '3,7', '3,7', '0,0', 35, 4),
(53, 'magere yoghurt 0%', 31, '3,5', '0,1', 0, '4,0', '4,0', '0,0', 68, 4),
(54, 'pudding, vanille', 121, '2,6', '3,5', 6, '19,8', '17,7', '0,0', 69, 4),
(55, 'ijs, vanille', 175, '3,3', '8,2', 6, '21,4', '20,4', '0,0', 76, 4),
(56, 'kippenei', 154, '12,6', '11,2', 352, '0,8', '0,8', '0,0', 116, 4),
(57, 'olijfolie', 899, '0,0', '99,8', 0, '0,0', '0,0', '0,0', 0, 5),
(58, 'boter, ongezouten', 743, '0,6', '82,1', 240, '0,6', '0,6', '0,0', 5, 5),
(59, 'margarine, 35% vet', 330, '0,1', '35,0', 0, '0,0', '0,0', '0,0', 30, 5),
(60, 'minarine 15% vet', 145, '0,0', '15,0', 0, '0,0', '0,0', '0,0', 100, 5),
(61, 'mosterd', 120, '5,9', '9,1', 0, '3,6', '0,0', '1,0', 2189, 5),
(62, 'mayonaise', 738, '1,3', '81,1', 61, '1,0', '0,0', '0,0', 324, 5),
(63, 'tomatenketchup', 101, '1,2', '0,4', 0, '23,6', '20,1', '1,8', 1174, 5),
(64, 'cola', 44, '0,0', '0,0', 0, '11,0', '11,0', '0,0', 6, 6),
(65, 'cola light', 1, '0,0', '0,0', 0, '0,0', '0,0', '0,0', 3, 6),
(66, 'koffie', 0, '0,0', '0,0', 0, '0,0', '0,0', '0,0', 1, 6),
(67, 'sinaasappelsap, ongezoet', 42, '0,5', '0,0', 0, '9,8', '9,5', '0,0', 11, 6),
(68, 'water', 0, '0,0', '0,0', 0, '0,0', '0,0', '0,0', 4, 6),
(69, 'bier, pils', 45, '0,4', '0,0', 0, '3,3', '3,3', '0,0', 0, 6),
(70, 'witte wijn, zoet', 67, '0,1', '0,0', 0, '0,6', '0,6', '0,0', 4, 6);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `meal_types`
--

DROP TABLE IF EXISTS `meal_types`;
CREATE TABLE IF NOT EXISTS `meal_types` (
  `id` int(11) NOT NULL,
  `name` varchar(155) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Gegevens worden uitgevoerd voor tabel `meal_types`
--

INSERT INTO `meal_types` (`id`, `name`) VALUES
(1, 'Ontbijt'),
(2, 'Middagmaal'),
(3, 'Avondmaal'),
(4, 'Tussendoortje');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `meals`
--

DROP TABLE IF EXISTS `meals`;
CREATE TABLE IF NOT EXISTS `meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `seen` enum('Y','N') DEFAULT 'N',
  `consultation_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=40 ;

--
-- Gegevens worden uitgevoerd voor tabel `meals`
--

INSERT INTO `meals` (`id`, `customer_id`, `type_id`, `date`, `seen`, `consultation_id`) VALUES
(17, 12, 1, '2013-05-29', 'Y', 33),
(18, 12, 2, '2013-05-29', 'Y', 33),
(19, 12, 4, '2013-05-29', 'Y', 33),
(20, 12, 4, '2013-05-28', 'Y', 33),
(21, 12, 3, '2013-05-29', 'Y', 33),
(22, 12, 1, '2013-05-30', 'Y', 33),
(23, 12, 1, '2013-05-31', 'Y', 35),
(24, 12, 4, '2013-05-31', 'Y', 35),
(25, 12, 1, '2013-06-01', 'Y', 35),
(26, 12, 2, '2013-06-01', 'Y', 35),
(27, 12, 3, '2013-06-01', 'Y', 35),
(28, 12, 4, '2013-06-01', 'Y', 35),
(29, 12, 4, '2013-06-01', 'Y', 35),
(30, 12, 1, '2013-06-02', 'Y', 35),
(31, 12, 2, '2013-06-02', 'Y', 35),
(32, 12, 3, '2013-06-02', 'Y', 35),
(33, 12, 4, '2013-06-02', 'Y', 35),
(38, 12, 1, '2013-06-03', 'Y', 35),
(39, 12, 2, '2013-06-03', 'Y', 35);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `meals_food`
--

DROP TABLE IF EXISTS `meals_food`;
CREATE TABLE IF NOT EXISTS `meals_food` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meals_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `gram` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

--
-- Gegevens worden uitgevoerd voor tabel `meals_food`
--

INSERT INTO `meals_food` (`id`, `meals_id`, `food_id`, `gram`) VALUES
(10, 17, 6, 250),
(11, 17, 65, 330),
(12, 18, 12, 300),
(13, 18, 30, 300),
(14, 18, 23, 300),
(15, 18, 65, 300),
(16, 19, 14, 100),
(17, 20, 25, 100),
(18, 21, 2, 200),
(19, 21, 49, 150),
(20, 21, 65, 170),
(21, 22, 12, 100),
(22, 23, 4, 100),
(23, 24, 64, 310),
(24, 25, 68, 300),
(25, 25, 59, 15),
(26, 25, 2, 200),
(27, 26, 12, 245),
(28, 26, 65, 400),
(29, 26, 36, 300),
(30, 26, 22, 60),
(31, 27, 11, 200),
(32, 27, 65, 340),
(33, 27, 40, 300),
(34, 27, 20, 100),
(35, 28, 14, 230),
(36, 29, 14, 130),
(37, 30, 2, 200),
(38, 30, 49, 130),
(39, 30, 65, 330),
(40, 31, 64, 400),
(41, 31, 37, 135),
(42, 31, 2, 135),
(43, 31, 4, 135),
(44, 32, 33, 180),
(45, 32, 58, 20),
(46, 32, 65, 355),
(47, 32, 16, 120),
(48, 33, 14, 100),
(52, 38, 20, 100),
(53, 39, 12, 190),
(54, 39, 64, 190),
(55, 39, 20, 190),
(56, 39, 60, 15);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
