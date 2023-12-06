-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2023 at 07:33 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `admin_email` varchar(100) NOT NULL,
  `admin_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_email`, `admin_password`) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin'),
(2, 'Aswin', 'aswin22@gmail.com', 'aswin22@');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `userId` int(15) DEFAULT NULL,
  `eventdate` varchar(255) DEFAULT NULL,
  `participants` int(11) DEFAULT NULL,
  `eventType` varchar(255) NOT NULL,
  `eventMode` varchar(255) NOT NULL,
  `venueId` int(11) DEFAULT NULL,
  `decorId` int(11) DEFAULT NULL,
  `photoId` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `username` varchar(60) NOT NULL,
  `userPhone` bigint(20) NOT NULL,
  `cateringId` int(11) NOT NULL,
  `cuisineId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `userId`, `eventdate`, `participants`, `eventType`, `eventMode`, `venueId`, `decorId`, `photoId`, `status`, `created_at`, `updated_at`, `username`, `userPhone`, `cateringId`, `cuisineId`) VALUES
(5, 2, '2024-01-05', 120, 'weddings', 'indoor', 8, 2, 3, 'accepted', '2023-12-05 08:56:37', '2023-12-05 08:57:35', 'asw', 2222, 0, 3),
(6, 2, '2024-01-06', 777, 'weddings', 'indoor', 13, 5, 3, 'requsted', '2023-12-05 09:17:05', '2023-12-05 09:17:05', 'asw', 2222, 0, 5),
(7, 2, '2024-01-03', 400, 'weddings', 'indoor', 11, 5, 3, 'requsted', '2023-12-05 10:23:34', '2023-12-05 10:23:34', 'asw', 2222, 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `catering`
--

CREATE TABLE `catering` (
  `catering_id` int(11) NOT NULL,
  `catering_name` varchar(100) DEFAULT NULL,
  `catering_location` varchar(100) NOT NULL,
  `catering_desc` varchar(100) NOT NULL,
  `catering_username` varchar(100) NOT NULL,
  `catering_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catering`
--

INSERT INTO `catering` (`catering_id`, `catering_name`, `catering_location`, `catering_desc`, `catering_username`, `catering_password`) VALUES
(1, 'paragon', 'Kozhikode', 'paragon', 'paragon', 'paragon'),
(4, 'Foodwey Caterers', ' near maniyambalam masjid, anakkuzhikkara, Kuttikattoor-Mundupalam Rd, Kozhikode', ' Foodwey Caterers Kozhikode', 'foodwey', 'foodwey@123');

-- --------------------------------------------------------

--
-- Table structure for table `cuisine`
--

CREATE TABLE `cuisine` (
  `cuisine_id` int(11) NOT NULL,
  `catetring_id` int(11) NOT NULL,
  `cuisine_name` varchar(100) NOT NULL,
  `cuisine_category` varchar(100) NOT NULL,
  `cuisine_price` int(11) NOT NULL,
  `cuisine_image` varchar(100) NOT NULL,
  `cuisine_desc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cuisine`
--

INSERT INTO `cuisine` (`cuisine_id`, `catetring_id`, `cuisine_name`, `cuisine_category`, `cuisine_price`, `cuisine_image`, `cuisine_desc`) VALUES
(3, 2, 'just edit', 'Indian-Veg', 579, '3.png', 'hkk'),
(5, 1, 'gdfg', 'Indian-Veg', 215, '', 'bhk');

-- --------------------------------------------------------

--
-- Table structure for table `decor`
--

CREATE TABLE `decor` (
  `decor_id` int(11) NOT NULL,
  `decor_name` varchar(100) NOT NULL,
  `decor_category` varchar(100) NOT NULL,
  `decor_price` varchar(100) NOT NULL,
  `decor_image` varchar(100) NOT NULL,
  `decor_desc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `decor`
--

INSERT INTO `decor` (`decor_id`, `decor_name`, `decor_category`, `decor_price`, `decor_image`, `decor_desc`) VALUES
(4, 'Floral', 'Indoor', '600', '4.png', 'Floral'),
(5, 'Floral Arch', 'Indoor', '2600', '5.png', 'Floral Arch');

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `photo_id` int(11) NOT NULL,
  `photo_name` varchar(100) NOT NULL,
  `photo_location` varchar(100) NOT NULL,
  `photo_amount` int(11) NOT NULL,
  `video_amount` int(11) NOT NULL,
  `photo_desc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`photo_id`, `photo_name`, `photo_location`, `photo_amount`, `video_amount`, `photo_desc`) VALUES
(3, 'Prakash Photography', 'Kozhikode', 6000, 7000, 'Prakash Photography Kozhikode');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `staff_name` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `staff_phone` bigint(20) NOT NULL,
  `staff_address` varchar(100) NOT NULL,
  `staff_username` varchar(100) NOT NULL,
  `staff_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `staff_name`, `dob`, `staff_phone`, `staff_address`, `staff_username`, `staff_password`) VALUES
(2, 'Aswin Das f', '2023-11-12', 9656600778, 'Dreamsvilla,near Alphonsa school, Thamarasserry, Kozhikode', 'aa', '1234567a');

-- --------------------------------------------------------

--
-- Table structure for table `staff_allocation`
--

CREATE TABLE `staff_allocation` (
  `staff_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_phone` bigint(20) NOT NULL,
  `user_location` varchar(100) NOT NULL,
  `user_zip` int(11) NOT NULL,
  `user_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_phone`, `user_location`, `user_zip`, `user_password`) VALUES
(1, 'Aswin Das', 'aswindaspk10@gmail.com', 9656600778, 'Thamarassery', 673573, 'aswin'),
(2, 'asw', 'asw@gmail.com', 2222, '222', 334, 'asw'),
(4, 'test', 'test@gmail.com', 7994465741, 'tirur', 663366, 'a1234567');

-- --------------------------------------------------------

--
-- Table structure for table `venue`
--

CREATE TABLE `venue` (
  `venue_id` int(11) NOT NULL,
  `venue_name` varchar(100) NOT NULL,
  `venue_category` varchar(100) NOT NULL,
  `venue_amount` bigint(20) NOT NULL,
  `venue_capacity` int(11) NOT NULL,
  `venue_location` varchar(100) NOT NULL,
  `venue_image` varchar(100) NOT NULL,
  `venue_desc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venue`
--

INSERT INTO `venue` (`venue_id`, `venue_name`, `venue_category`, `venue_amount`, `venue_capacity`, `venue_location`, `venue_image`, `venue_desc`) VALUES
(11, 'A1 hall', 'Indoor', 4000, 40, 'Kozhikode', '11.png', 'a1 hall Kozhikode'),
(12, 'Diamond Hall', 'Indoor', 50000, 2000, 'Diamond Hall', '12.png', 'Diamond Hall Diamond Hall'),
(13, 'MP Hall', 'Indoor', 10000, 600, 'Kozhikode', '13.png', 'MP Hall Kozhikode');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indexes for table `catering`
--
ALTER TABLE `catering`
  ADD PRIMARY KEY (`catering_id`);

--
-- Indexes for table `cuisine`
--
ALTER TABLE `cuisine`
  ADD PRIMARY KEY (`cuisine_id`);

--
-- Indexes for table `decor`
--
ALTER TABLE `decor`
  ADD PRIMARY KEY (`decor_id`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`photo_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `venue`
--
ALTER TABLE `venue`
  ADD PRIMARY KEY (`venue_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `catering`
--
ALTER TABLE `catering`
  MODIFY `catering_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cuisine`
--
ALTER TABLE `cuisine`
  MODIFY `cuisine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `decor`
--
ALTER TABLE `decor`
  MODIFY `decor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `photo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `venue`
--
ALTER TABLE `venue`
  MODIFY `venue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
