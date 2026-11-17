-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 12 2026 г., 08:53
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `geek_market`
--

-- --------------------------------------------------------

--
-- Структура таблицы `adverts`
--

CREATE TABLE `adverts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`photos`)),
  `views_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `category_id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `adverts`
--

INSERT INTO `adverts` (`id`, `title`, `text`, `status`, `price`, `photos`, `views_count`, `category_id`, `user_id`, `created_at`, `updated_at`) VALUES
(61, 'Modern Apartment in City Center', 'Spacious 2-bedroom apartment with great view.', 'published', 1200.00, NULL, 258, 'C1', 1, '2026-11-05 02:48:45', '2026-11-11 00:57:55'),
(62, 'Cozy Suburban House', 'Quiet area, 3 bedrooms, renovated kitchen.', 'declined', 980.00, NULL, 143, 'C1', 8, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(63, 'Downtown Studio', 'Perfect for students, fully furnished.', 'moderation', 650.00, NULL, 77, 'C1', 13, '2026-11-05 02:48:45', '2026-11-06 04:54:51'),
(64, 'Country Cottage', 'Wooden cottage near the lake.', 'published', 1500.00, NULL, 301, 'C1', 11, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(65, 'Beachfront Villa', 'Luxury villa with private beach access.', 'published', 3500.00, NULL, 512, 'C1', 18, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(66, 'Used Toyota Corolla 2018', 'Well-maintained, single owner.', 'published', 8500.00, NULL, 712, 'C2', 3, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(67, 'BMW X5 2016', 'Excellent condition, full service history.', 'moderation', 23000.00, NULL, 89, 'C2', 9, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(68, 'Electric Scooter', 'Lightweight model with 25km range.', 'declined', 280.00, NULL, 33, 'C2', 7, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(69, 'Yamaha Motorcycle', 'Perfect for city and touring rides.', 'published', 4100.00, NULL, 267, 'C2', 1, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(70, 'Ford F-150', 'Powerful pickup truck with low mileage.', 'published', 18500.00, NULL, 344, 'C2', 17, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(71, 'Frontend Developer Needed', 'Looking for React developer for long-term project.', 'moderation', 0.00, NULL, 143, 'C3', 5, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(72, 'Warehouse Worker', 'Night shift, paid weekly.', 'published', 0.00, NULL, 199, 'C3', 19, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(73, 'Office Administrator', 'Full-time office role, experience required.', 'declined', 0.00, NULL, 66, 'C3', 20, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(74, 'Senior Java Engineer', 'Remote position with competitive salary.', 'published', 0.00, NULL, 352, 'C3', 16, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(75, 'Graphic Designer', 'Creative designer needed for branding projects.', 'published', 0.00, NULL, 271, 'C3', 2, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(76, 'House Cleaning Service', 'Professional home cleaning with eco products.', 'published', 80.00, NULL, 98, 'C4', 2, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(77, 'Plumbing Repair', 'Fast and reliable plumbing service.', 'declined', 120.00, NULL, 41, 'C4', 14, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(78, 'Private Tutor', 'Math & physics lessons for students.', 'published', 25.00, NULL, 154, 'C4', 6, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(79, 'Wedding Photographer', 'Full-day wedding photography package.', 'moderation', 600.00, NULL, 73, 'C4', 8, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(80, 'Car Repair Service', 'Engine diagnostics and repair services.', 'published', 150.00, NULL, 210, 'C4', 5, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(81, 'iPhone 13 Pro', '256GB, excellent condition, Sierra Blue.', 'published', 750.00, NULL, 529, 'C5', 7, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(82, 'Gaming Laptop', 'RTX graphics, 16GB RAM.', 'declined', 1100.00, NULL, 87, 'C5', 15, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(83, 'Smart TV 55', '4K HDR display, like new.', 'moderation', 400.00, NULL, 57, 'C5', 1, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(84, 'Bluetooth Headphones', 'Noise-cancelling wireless headphones.', 'published', 90.00, NULL, 184, 'C5', 3, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(85, 'Canon DSLR Camera', 'Great starter camera for photography.', 'published', 320.00, NULL, 214, 'C5', 14, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(86, 'Vintage Leather Jacket', 'Genuine leather jacket in great condition.', 'declined', 120.00, NULL, 44, 'C6', 13, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(87, 'Women’s Dress', 'Elegant evening dress, barely worn.', 'published', 60.00, NULL, 98, 'C6', 12, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(88, 'Men’s Sneakers', 'Brand new sneakers in original box.', 'published', 75.00, NULL, 112, 'C6', 5, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(89, 'Handmade Backpack', 'Eco-friendly handmade backpack.', 'moderation', 40.00, NULL, 28, 'C6', 16, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(90, 'Kids’ Winter Coat', 'Warm and stylish winter coat.', 'published', 25.00, NULL, 67, 'C6', 2, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(91, 'Mountain Bike', 'Serviced hardtail MTB bicycle.', 'published', 400.00, NULL, 367, 'C7', 9, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(92, 'Tennis Racket', 'Lightweight racket for intermediate players.', 'declined', 50.00, NULL, 22, 'C7', 17, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(93, 'Kayak', 'One-person kayak with paddle included.', 'published', 180.00, NULL, 119, 'C7', 11, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(94, 'Guitar', 'Acoustic guitar ideal for beginners.', 'moderation', 90.00, NULL, 81, 'C7', 8, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(95, 'Camping Tent', '4-person waterproof camping tent.', 'published', 70.00, NULL, 295, 'C7', 15, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(96, 'Golden Retriever Puppies', 'Healthy and vaccinated puppies.', 'published', 500.00, NULL, 812, 'C8', 11, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(97, 'Parrot for Adoption', 'Friendly talking parrot looking for a home.', 'declined', 60.00, NULL, 47, 'C8', 18, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(98, 'Aquarium Set', 'Complete aquarium kit with filter.', 'moderation', 70.00, NULL, 34, 'C8', 6, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(99, 'Cat Scratching Post', 'Durable scratching post for cats.', 'published', 30.00, NULL, 128, 'C8', 7, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(100, 'Rabbit Hutch', 'Outdoor wooden rabbit hutch.', 'published', 85.00, NULL, 211, 'C8', 5, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(101, 'Garden Tool Set', 'Starter set: shovel, rake, gloves.', 'moderation', 45.00, NULL, 61, 'C9', 15, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(102, 'LED Garden Lights', 'Solar-powered decorative garden lights.', 'published', 25.00, NULL, 102, 'C9', 19, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(103, 'Flower Pots', 'Ceramic pots in three sizes.', 'declined', 20.00, NULL, 18, 'C9', 16, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(104, 'Electric Lawn Mower', 'Quiet and lightweight electric mower.', 'published', 120.00, NULL, 209, 'C9', 20, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(105, 'Wooden Patio Chairs', 'Set of two wooden patio chairs.', 'published', 90.00, NULL, 145, 'C9', 1, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(106, 'Coffee Shop Equipment', 'Espresso machine and grinder bundle.', 'published', 950.00, NULL, 133, 'C10', 19, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(107, 'Office Desks', 'Bulk sale of office desks.', 'declined', 150.00, NULL, 53, 'C10', 14, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(108, 'POS Terminal', 'Used but fully functional POS terminal.', 'published', 220.00, NULL, 88, 'C10', 8, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(109, 'Restaurant Oven', 'Commercial gas oven for restaurants.', 'moderation', 700.00, NULL, 32, 'C10', 3, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(110, 'Bar Stools', 'Set of 4 modern bar stools.', 'published', 130.00, NULL, 167, 'C10', 17, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(111, 'Luxury Penthouse', 'Spacious penthouse with panoramic city view.', 'draft', 5000.00, NULL, 45, 'C1', 2, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(112, 'Compact Car Honda Civic', 'Low mileage, excellent condition.', 'draft', 7200.00, NULL, 62, 'C2', 5, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(113, 'Backend Developer Position', 'Looking for Node.js developer for remote work.', 'draft', 0.00, NULL, 15, 'C3', 14, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(114, 'Massage Therapy Services', 'Professional massage services at home.', 'draft', 100.00, NULL, 23, 'C4', 6, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(115, 'Samsung Galaxy S22', 'Mint condition, 128GB storage.', 'draft', 650.00, NULL, 41, 'C5', 12, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(116, 'Leather Handbag', 'Designer leather handbag, like new.', 'draft', 150.00, NULL, 18, 'C6', 16, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(117, 'Fishing Rod Set', 'Complete fishing rod set for beginners.', 'draft', 75.00, NULL, 12, 'C7', 17, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(118, 'Parakeet Birds', 'Two friendly parakeets looking for a home.', 'draft', 35.00, NULL, 27, 'C8', 8, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(119, 'Garden Fountain', 'Decorative outdoor fountain for garden.', 'draft', 220.00, NULL, 19, 'C9', 15, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(120, 'Restaurant Chairs', 'Set of 6 chairs, sturdy and modern design.', 'draft', 180.00, NULL, 33, 'C10', 19, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(121, 'Test advert updated from API', 'Testing advert creation for Module C.', 'archived', 150.00, '[\"https:\\/\\/example.com\\/test-photo.jpg\"]', 0, 'C1', 1, '2026-11-12 00:57:26', '2026-11-12 02:24:24');

-- --------------------------------------------------------

--
-- Структура таблицы `advert_images`
--

CREATE TABLE `advert_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `advert_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `advert_images`
--

INSERT INTO `advert_images` (`id`, `advert_id`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 61, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(2, 61, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(3, 62, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(4, 62, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(5, 62, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(6, 63, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(7, 63, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(8, 64, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(9, 64, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(10, 64, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(11, 65, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(12, 65, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(13, 65, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(14, 65, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(15, 66, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(16, 66, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(17, 67, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(18, 67, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(19, 67, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(20, 68, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(21, 68, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(22, 69, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(23, 69, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(24, 69, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(25, 70, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(26, 70, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(27, 70, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(28, 70, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(29, 71, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(30, 71, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(31, 72, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(32, 72, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(33, 72, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(34, 73, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(35, 73, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(36, 74, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(37, 74, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(38, 74, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(39, 74, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(40, 75, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(41, 75, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(42, 76, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(43, 76, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(44, 76, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(45, 77, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(46, 77, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(47, 78, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(48, 78, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(49, 79, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(50, 79, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(51, 79, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(52, 80, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(53, 80, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(54, 80, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(55, 80, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(56, 81, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(57, 81, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(58, 82, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(59, 82, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(60, 82, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(61, 83, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(62, 83, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(63, 84, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(64, 84, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(65, 84, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(66, 84, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(67, 85, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(68, 85, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(69, 86, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(70, 86, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(71, 86, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(72, 87, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(73, 87, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(74, 88, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(75, 88, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(76, 89, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(77, 89, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(78, 89, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(79, 89, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(80, 90, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(81, 90, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(82, 91, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(83, 91, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(84, 92, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(85, 92, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(86, 92, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(87, 93, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(88, 93, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(89, 94, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(90, 94, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(91, 95, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(92, 95, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(93, 95, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(94, 96, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(95, 96, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(96, 97, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(97, 97, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(98, 97, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(99, 98, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(100, 98, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(101, 99, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(102, 99, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(103, 100, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(104, 100, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(105, 100, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(106, 101, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(107, 101, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(108, 102, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(109, 102, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(110, 102, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(111, 103, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(112, 103, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(113, 104, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(114, 104, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(115, 104, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(116, 105, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(117, 105, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(118, 106, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(119, 106, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(120, 106, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(121, 106, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(122, 107, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(123, 107, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(124, 108, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(125, 108, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(126, 109, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(127, 109, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(128, 110, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(129, 110, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(130, 110, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(131, 111, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(132, 111, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(133, 111, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(134, 111, 'advert-4.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(135, 112, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(136, 112, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(137, 113, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(138, 113, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(139, 114, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(140, 114, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(141, 115, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(142, 115, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(143, 115, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(144, 116, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(145, 116, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(146, 117, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(147, 117, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(148, 118, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(149, 118, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(150, 118, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(151, 119, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(152, 119, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(153, 120, 'advert-1.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(154, 120, 'advert-2.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(155, 120, 'advert-3.jpg', '2026-11-05 02:48:45', '2026-11-05 02:48:45');

-- --------------------------------------------------------

--
-- Структура таблицы `advert_paid_services`
--

CREATE TABLE `advert_paid_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `advert_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `activated_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `deactivated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `advert_paid_services`
--

INSERT INTO `advert_paid_services` (`id`, `advert_id`, `type`, `activated_at`, `expires_at`, `deactivated_at`, `created_at`, `updated_at`) VALUES
(1, 61, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(2, 61, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(3, 63, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(4, 64, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(5, 65, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(6, 65, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(7, 67, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(8, 68, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(9, 70, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(10, 70, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(11, 72, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(12, 73, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(13, 74, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(14, 74, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(15, 76, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(16, 78, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(17, 80, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(18, 80, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(19, 81, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(20, 83, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(21, 84, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(22, 84, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(23, 86, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(24, 87, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(25, 89, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(26, 89, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(27, 91, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(28, 93, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(29, 95, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(30, 95, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(31, 97, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(32, 98, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(33, 100, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(34, 100, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(35, 102, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(36, 104, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(37, 106, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(38, 106, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(39, 108, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(40, 110, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(41, 111, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(42, 111, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(43, 113, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(44, 115, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(45, 117, 'top', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(46, 119, 'vip', NULL, NULL, NULL, '2026-11-05 02:48:45', '2026-11-05 02:48:45'),
(47, 61, 'highlight', '2026-11-08 23:41:38', '2026-11-28 23:41:38', NULL, '2026-11-08 23:41:38', '2026-11-08 23:41:38'),
(48, 62, 'urgent', '2026-11-08 23:43:39', '2026-11-28 23:43:39', '2026-11-08 23:45:24', '2026-11-08 23:43:39', '2026-11-08 23:45:24'),
(49, 62, 'urgent', '2026-11-08 23:45:58', '2026-11-28 23:45:58', '2026-11-08 23:46:03', '2026-11-08 23:45:58', '2026-11-08 23:46:03'),
(50, 61, 'TOP', '2026-11-11 04:42:43', '2026-11-14 04:42:43', NULL, '2026-11-11 04:42:43', '2026-11-11 04:42:43'),
(51, 69, 'VIP', '2026-11-11 05:05:23', '2026-11-18 05:05:23', NULL, '2026-11-11 05:05:23', '2026-11-11 05:05:23');

-- --------------------------------------------------------

--
-- Структура таблицы `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
('C1', 'Real Estate', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C10', 'Business & Equipment', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C2', 'Vehicles', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C3', 'Jobs', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C4', 'Services', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C5', 'Electronics', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C6', 'Personal Items', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C7', 'Hobbies & Leisure', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C8', 'Animals & Pets', '2026-11-05 00:34:04', '2026-11-05 00:34:04'),
('C9', 'Home & Garden', '2026-11-05 00:34:04', '2026-11-05 00:34:04');

-- --------------------------------------------------------

--
-- Структура таблицы `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_11_05_044229_create_categories_table', 2),
(6, '2026_11_05_054508_add_phone_and_role_to_users_table', 3),
(7, '2026_11_05_061332_add_phone_and_role_columns_to_users_table', 4),
(8, '2026_11_05_065819_create_adverts_table', 5),
(9, '2026_11_05_070601_create_advert_images_table', 6),
(10, '2026_11_05_070815_create_advert_paid_services_table', 7),
(11, '2026_11_06_043627_add_is_blocked_to_users_table', 8),
(12, '2026_11_10_042548_create_personal_access_tokens_table', 9),
(13, '2026_11_10_045018_add_photos_to_adverts_table', 10),
(14, '2026_11_10_045126_create_views_table', 10),
(15, '2026_11_10_050515_make_name_nullable_in_users_table', 11);

-- --------------------------------------------------------

--
-- Структура таблицы `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 21, 'auth_token', '099635034df4e5ab474cdc99877c884dfd5cb7ee44752f2c782dd2c62bd66776', '[\"*\"]', NULL, NULL, '2026-11-10 00:48:36', '2026-11-10 00:48:36'),
(3, 'App\\Models\\User', 21, 'auth_token', 'd9e6211fab371df6f1f374db435e78dbf6ddc9bbbf042dd8a944e90527f3031c', '[\"*\"]', NULL, NULL, '2026-11-10 04:00:22', '2026-11-10 04:00:22'),
(4, 'App\\Models\\User', 21, 'auth_token', 'ebd620ce72cd9243b8edcbb76152aef007e5c499a6aa9aaf9daac0887ed774e5', '[\"*\"]', '2026-11-10 06:07:57', NULL, '2026-11-10 05:55:40', '2026-11-10 06:07:57'),
(6, 'App\\Models\\User', 21, 'auth_token', '97f554dd25f344b7c0d7626684dc7a2d86acb8677108aabfe5d7329e042fc731', '[\"*\"]', '2026-11-11 03:45:22', NULL, '2026-11-11 00:48:27', '2026-11-11 03:45:22'),
(7, 'App\\Models\\User', 5, 'auth_token', '7d6dfaca275870bc1f98fa0b414b72764d175de621b4a00b71d2904b3cde1603', '[\"*\"]', '2026-11-11 03:53:53', NULL, '2026-11-11 00:57:32', '2026-11-11 03:53:53'),
(8, 'App\\Models\\User', 4, 'auth_token', '6bcd511bce2479bd2f3159039d45bf3106b654a548cccb248bbd7601ded89264', '[\"*\"]', '2026-11-11 04:27:38', NULL, '2026-11-11 03:56:25', '2026-11-11 04:27:38'),
(9, 'App\\Models\\User', 1, 'auth_token', 'f1fcae803cfe30d3a85bd94a0f586197a4ab72c1a7de4328985d2f56bc6f3d3d', '[\"*\"]', '2026-11-11 04:42:43', NULL, '2026-11-11 04:42:16', '2026-11-11 04:42:43'),
(10, 'App\\Models\\User', 1, 'auth_token', '0aa079b6ccd4c00d72d93cc1324714b000980867f362381722789f480055529d', '[\"*\"]', '2026-11-12 02:46:09', NULL, '2026-11-11 05:00:27', '2026-11-12 02:46:09'),
(11, 'App\\Models\\User', 4, 'auth_token', '25081ccf6de63607cd1023d66a08af402abf4b87de83c9cddce72788cb278597', '[\"*\"]', '2026-11-12 02:18:36', NULL, '2026-11-12 02:10:52', '2026-11-12 02:18:36');

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('9KuWuzMcn24inaFdBj7lIDZIcJAQGCfyijjU0AEw', NULL, '127.0.0.1', 'PostmanRuntime/2.16.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS25DUnAyMDNDRjN4YnFNdjdCQlljanFNQkhmaUliRXFqNWFaTHNjUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794467809),
('dtQCJIR1DW5swUSgi3kryg7c9Ds23L9iiqIyuOOU', NULL, '127.0.0.1', 'PostmanRuntime/2.15.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVBEc1BBaXpQRjFQWW5CZ2hqSDZOYkh1MlMxeTc1WHFURXlwUDAzViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794290711),
('IfoCxC64IUUNlveqi3OLxhJqU4yyo7gcRNf1DdSg', NULL, '127.0.0.1', 'PostmanRuntime/2.15.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWZIRHZEd2Z2U09mb0pLV3ZxeGFGRHZBaTJSeEl6MDdDUnpFeExEdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794305864),
('jyOrBIvzF5W3b7pmVvx3mwx6dyh6822jlZhvjJqn', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiT3RtTVo4Q0tkZXFjazFWZHczazhFQXU3YnNhdVU3V0JOQ2FMNmo3aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9hZHZlcnRzL2V4cG9ydC9jc3YiO3M6NToicm91dGUiO3M6MjA6ImFkbWluLmFkdmVydHMuZXhwb3J0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2NDoiYjA4M2YxMWUxMDI0ZTQ2NTVjYjNhN2RiYzAzNmZhZDUwMjI0MjhiNmVhN2E4YmU2ODE2N2JiMmFkNzRlZmYzNiI7fQ==', 1794207581),
('mrFhSHsr2tXz5UtNX3AOqRVVzTL1HIcIH6dJDPzL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFpYUTBNY1lzUkIyUGs2eVJYdWN5NjI4WEtSbWtXUXVBOUw1d3VMYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794287568),
('nWcsrVCOQpXYs2DFxhJe2YNQ0OP9CeiX1a4wlA1n', NULL, '127.0.0.1', 'PostmanRuntime/2.16.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmFTYlE1ZkVMTDJhVlk2b2Z4Zk5EZHBsQ0FXNElXZldvbjFPNnY3SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794390913),
('pusCfaeyGhqE4XONETJ0QogF3u40OLJwedTiU9zA', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSGRUWllEZW9GZjgzZ1JEWmdTc0J4Y1VJd1BGTkpYaGMxUE0zVnVUdCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbiI7czo1OiJyb3V0ZSI7Tjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2NDoiYjA4M2YxMWUxMDI0ZTQ2NTVjYjNhN2RiYzAzNmZhZDUwMjI0MjhiNmVhN2E4YmU2ODE2N2JiMmFkNzRlZmYzNiI7fQ==', 1793959317),
('tmLZe6NpSdB4mtXCaBjGT2OXN9DxoDzFgD0wAzT4', NULL, '127.0.0.1', 'PostmanRuntime/2.16.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGIzeWVXTWNCRXY3VmdieFZhNmFmSzU3RFRLTVFjTTJNajdvRG15SCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794376317);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`, `is_blocked`) VALUES
(1, 'Ethan Brooks', 'ethan@example.com', '+1 202 555 0143', NULL, '$2y$12$EWrj1WWeESM2QFwPRn9Aw.2dcHD8q.ebQbdSbV8h2ZpR5BkExh7OG', 'user', NULL, '2026-11-05 01:46:36', '2026-11-12 02:46:09', 0),
(2, 'Olivia Carter', 'olivia@example.com', '+44 7700 900321', NULL, '$2y$12$p0MH9H2.Ae3M.rFUIs8C8.AXj5g5rXvNc6uewAgEAQ5DAGC.INJD6', 'moderator', NULL, '2026-11-05 01:46:36', '2026-11-05 01:46:36', 0),
(3, 'Mason Hill', 'mason@example.com', '+61 412 345 678', NULL, '$2y$12$.2P3fn6OzvJyqNZE/IMpfujCHVmrU5lO5CSaX/eshZ9xfQkpsi/Xm', 'user', NULL, '2026-11-05 01:46:37', '2026-11-05 01:46:37', 0),
(4, 'Ava Thompson', 'ava@example.com', '+49 1512 3456789', NULL, '$2y$12$jM461ODH/KQwLxrAGOZd2Oqku8O28om8nTgMo.t/MZImAb8z.bvC2', 'moderator', NULL, '2026-11-05 01:46:37', '2026-11-05 01:46:37', 0),
(5, 'Liam Wright', 'liam@example.com', '+33 6 12 34 56 78', NULL, '$2y$12$H2orHYR8lYWrt4AzBVrkreQU6sD5PplCYUzRnvIyKf6Cy489szRx2', 'user', NULL, '2026-11-05 01:46:37', '2026-11-05 01:46:37', 0),
(6, 'Sophia Mitchell', 'sophia@example.com', '+7 777 123 45 67', NULL, '$2y$12$coICRGybXnEINj3ImCMILOQs9O8kIusSphmwOek2Xz72fhbAXmAQa', 'moderator', NULL, '2026-11-05 01:46:37', '2026-11-05 01:46:37', 0),
(7, 'Noah Adams', 'noah@example.com', '+34 600 700 800', NULL, '$2y$12$vJeidqBCpipTDnmXG1I5n.l3qRGvZO.NcaLpyNQAIAwpzkTlzI402', 'user', NULL, '2026-11-05 01:46:38', '2026-11-05 01:46:38', 0),
(8, 'Emma Clark', 'emma@example.com', '+39 347 123 4567', NULL, '$2y$12$oofBWy05kfTKpc5e6tnI4.4cZeUT1FHciaXXZc0xuyjeiVaQqULHS', 'moderator', NULL, '2026-11-05 01:46:38', '2026-11-05 01:46:38', 0),
(9, 'Lucas Turner', 'lucas@example.com', '+81 90 1234 5678', NULL, '$2y$12$3Cw3c3zbQ0V5UYip.voFduuVefykKT2x2PEURuZOVy1s7.j4IyX6y', 'user', NULL, '2026-11-05 01:46:38', '2026-11-05 01:46:38', 0),
(10, 'Isabella Green', 'isabella@example.com', '+91 98765 43210', NULL, '$2y$12$ClxvxTFOfvlWR0YwMp8FSOjA3OKTGHF8bgrjGiLGCGrYx1MawOI9e', 'moderator', NULL, '2026-11-05 01:46:38', '2026-11-05 01:46:38', 0),
(11, 'Benjamin Scott', 'benjamin@example.com', '+55 21 99876 5432', NULL, '$2y$12$BoEA2mSomnHIaj1.DWqMOuxgea6YWyLX9DT/eYlSVEk0BvJwbmpvm', 'user', NULL, '2026-11-05 01:46:38', '2026-11-05 01:46:38', 0),
(12, 'Mia Robinson', 'mia@example.com', '+46 70 123 4567', NULL, '$2y$12$5F6UbDadM0MDT9seZGopMOqXOuF7tWGQB76pmtUmNTtuUBilJOKP.', 'moderator', NULL, '2026-11-05 01:46:39', '2026-11-05 01:46:39', 0),
(13, 'Elijah Baker', 'elijah@example.com', '+31 6 1234 5678', NULL, '$2y$12$qysThSyJnRmtjN/B.j8K6eNEbOyVWzYBwpfP7MSjw/ZtROm6HYju6', 'user', NULL, '2026-11-05 01:46:39', '2026-11-05 01:46:39', 0),
(14, 'Harper Lewis', 'harper@example.com', '+82 10 3456 7890', NULL, '$2y$12$k.fZDKf.a6e3.g56vKB/j.0JZWPQgalB3g7AmIq/44/yJWug/e932', 'moderator', NULL, '2026-11-05 01:46:39', '2026-11-05 01:46:39', 0),
(15, 'Alexander Evans', 'alexander@example.com', '+351 912 345 678', NULL, '$2y$12$QJyJiYa773Mz4ZxcGJTAi.tP9riSZJ1IW.sbxm4OrXoykZTGifWdi', 'user', NULL, '2026-11-05 01:46:39', '2026-11-05 01:46:39', 0),
(16, 'Amelia Reed', 'amelia@example.com', '+420 777 123 456', NULL, '$2y$12$0z.loTQ8pxP6antNCzKF2etK9ugmqJr.wU0OfyPAQRoPM5th/CecK', 'moderator', NULL, '2026-11-05 01:46:39', '2026-11-05 01:46:39', 0),
(17, 'James Parker', 'james@example.com', '+36 30 123 4567', NULL, '$2y$12$lEIveGJX4upkGJkzfH3gVuIrEZZQpVLO7MQN5/COfWrIFCvClb78.', 'user', NULL, '2026-11-05 01:46:40', '2026-11-05 01:46:40', 0),
(18, 'Charlotte Foster', 'charlotte@example.com', '+1 647 555 0199', NULL, '$2y$12$IhI0110oYiG37g0Gjmzf6eJJydSgEwzNBRdw98QyEuYofOgCjKVV6', 'moderator', NULL, '2026-11-05 01:46:40', '2026-11-05 01:46:40', 0),
(19, 'Daniel Murphy', 'daniel@example.com', '+62 812 3456 7890', NULL, '$2y$12$S1MKQ4M8biTeP.EWmN3AReEGcvqz3yhgKb8/7/WjuT4LwO6xPTQPy', 'user', NULL, '2026-11-05 01:46:40', '2026-11-05 01:46:40', 0),
(20, 'Grace Peterson', 'grace@example.com', '+48 601 234 567', NULL, '$2y$12$kUnF3ixw5.XdpW4vHZMhI.06DGldpr18U.Gjoq8hYwpDWmlJ1o8fu', 'moderator', NULL, '2026-11-05 01:46:40', '2026-11-05 01:46:40', 0),
(21, 'Test User', 'test@example.com', '+77001234567', NULL, '$2y$12$DHfF4IuN6qXweyVOabZOOOl6PktZAjdNOU4gnJIN.SVNw5EPSFXD2', 'user', NULL, '2026-11-10 00:48:36', '2026-11-10 00:48:36', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `views`
--

CREATE TABLE `views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `advert_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `views`
--

INSERT INTO `views` (`id`, `advert_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 61, 21, '2026-11-11 00:45:01', '2026-11-11 00:45:01'),
(2, 61, 5, '2026-11-11 00:57:55', '2026-11-11 00:57:55');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `adverts`
--
ALTER TABLE `adverts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adverts_user_id_foreign` (`user_id`),
  ADD KEY `adverts_category_id_foreign` (`category_id`);

--
-- Индексы таблицы `advert_images`
--
ALTER TABLE `advert_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advert_images_advert_id_foreign` (`advert_id`);

--
-- Индексы таблицы `advert_paid_services`
--
ALTER TABLE `advert_paid_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advert_paid_services_advert_id_foreign` (`advert_id`);

--
-- Индексы таблицы `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Индексы таблицы `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Индексы таблицы `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Индексы таблицы `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Индексы таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Индексы таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Индексы таблицы `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `views_advert_id_user_id_unique` (`advert_id`,`user_id`),
  ADD KEY `views_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `adverts`
--
ALTER TABLE `adverts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT для таблицы `advert_images`
--
ALTER TABLE `advert_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT для таблицы `advert_paid_services`
--
ALTER TABLE `advert_paid_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT для таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `views`
--
ALTER TABLE `views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `adverts`
--
ALTER TABLE `adverts`
  ADD CONSTRAINT `adverts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `adverts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `advert_images`
--
ALTER TABLE `advert_images`
  ADD CONSTRAINT `advert_images_advert_id_foreign` FOREIGN KEY (`advert_id`) REFERENCES `adverts` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `advert_paid_services`
--
ALTER TABLE `advert_paid_services`
  ADD CONSTRAINT `advert_paid_services_advert_id_foreign` FOREIGN KEY (`advert_id`) REFERENCES `adverts` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `views`
--
ALTER TABLE `views`
  ADD CONSTRAINT `views_advert_id_foreign` FOREIGN KEY (`advert_id`) REFERENCES `adverts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
