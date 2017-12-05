-- phpMyAdmin SQL Dump
-- version 4.7.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 29-Nov-2017 às 22:02
-- Versão do servidor: 5.5.58-0ubuntu0.14.04.1
-- PHP Version: 7.1.11-1+ubuntu14.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movierentaldb`
--
CREATE DATABASE IF NOT EXISTS `movierentaldb_test` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `movierentaldb_test`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `movie`
--

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `movie_rental_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `director` varchar(100) NOT NULL,
  `number_of_copies` smallint(5) UNSIGNED NOT NULL,
  `located_copies` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `movie`
--

INSERT INTO `movie` (`id`, `movie_rental_id`, `title`, `director`, `number_of_copies`, `located_copies`) VALUES
(1, 1, 'The Shawshank Redemption', 'Frank Darabont', 3, 0),
(2, 1, 'The Godfather', 'Francis Ford Coppola', 2, 0),
(3, 1, 'The Dark Knight', 'Christopher Nolan', 1, 0),
(4, 1, '12 Angry Men', 'Sidney Lumet', 4, 0),
(5, 1, 'Schindler\'s List', 'Steven Spielberg', 6, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `movie_rental`
--

CREATE TABLE `movie_rental` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `movie_rental`
--

INSERT INTO `movie_rental` (`id`, `name`) VALUES
(1, 'blockbuster');

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_rented_movie`
--

CREATE TABLE `user_rented_movie` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `movie_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movie_movie_rental1_idx` (`movie_rental_id`);

--
-- Indexes for table `movie_rental`
--
ALTER TABLE `movie_rental`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Indexes for table `user_rented_movie`
--
ALTER TABLE `user_rented_movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_has_movie_movie1_idx` (`movie_id`),
  ADD KEY `fk_user_has_movie_user_idx` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `movie_rental`
--
ALTER TABLE `movie_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_rented_movie`
--
ALTER TABLE `user_rented_movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `fk_movie_movie_rental1` FOREIGN KEY (`movie_rental_id`) REFERENCES `movie_rental` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `user_rented_movie`
--
ALTER TABLE `user_rented_movie`
  ADD CONSTRAINT `fk_user_has_movie_movie1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_has_movie_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
