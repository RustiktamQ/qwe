-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3307
-- Время создания: Янв 16 2026 г., 23:36
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `study`
--

-- --------------------------------------------------------

--
-- Структура таблицы `options`
--

CREATE TABLE `options` (
  `option_id` int NOT NULL,
  `question_id` int NOT NULL,
  `correct` varchar(255) NOT NULL,
  `incorrect1` varchar(255) NOT NULL,
  `incorrect2` varchar(255) NOT NULL,
  `incorrect3` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `options`
--

INSERT INTO `options` (`option_id`, `question_id`, `correct`, `incorrect1`, `incorrect2`, `incorrect3`) VALUES
(1, 13, '4', '2', '1', '3'),
(2, 13, '2', '1', '3', '4');

-- --------------------------------------------------------

--
-- Структура таблицы `questions`
--

CREATE TABLE `questions` (
  `question_id` int NOT NULL,
  `test_id` int NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `questions`
--

INSERT INTO `questions` (`question_id`, `test_id`, `text`) VALUES
(13, 3, 'Рустам Крутой?');

-- --------------------------------------------------------

--
-- Структура таблицы `teachers`
--

CREATE TABLE `teachers` (
  `teacher_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `teachers`
--

INSERT INTO `teachers` (`teacher_id`, `name`, `email`, `password`) VALUES
(1, '123', '123', '$2b$05$P56JP/lu1dY7v7i7YMKt5eadq1/qERgHxaKZ0TPf4avUM4io04lOq'),
(2, 'Android', 'android@gmail.com', '$2b$05$lP9ETAh8TUg4NBvWc3NWyuSctmNakgNKl37FRakUEPMtp9X4Rnj8K');

-- --------------------------------------------------------

--
-- Структура таблицы `tests`
--

CREATE TABLE `tests` (
  `test_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `tests`
--

INSERT INTO `tests` (`test_id`, `teacher_id`, `name`) VALUES
(1, 1, '333'),
(3, 2, 'Тест#323');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Индексы таблицы `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `questions_test_id` (`test_id`);

--
-- Индексы таблицы `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacher_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `tests_teacher_id` (`teacher_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `options`
--
ALTER TABLE `options`
  MODIFY `option_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `teachers`
--
ALTER TABLE `teachers`
  MODIFY `teacher_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `tests`
--
ALTER TABLE `tests`
  MODIFY `test_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
