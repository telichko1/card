const express = require("express");
const path = require("path");
const app = express();

// Хранилище для выбранной карты
let selectedCard = null;
let lastUpdateTime = null;

// Правильные MIME типы для статических файлов
express.static.mime.define({ "text/css": ["css"] });
express.static.mime.define({ "application/javascript": ["js"] });

// Парсинг JSON
app.use(express.json());

// Настройка заголовков для всех ответов
app.use((req, res, next) => {
  res.header("Cache-Control", "no-store");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

// API для установки карты
app.post("/api/setCard", (req, res) => {
  const { card } = req.body;
  selectedCard = card;
  lastUpdateTime = Date.now();
  res.json({ success: true });
});

// API для проверки карты
app.get("/api/checkCard", (req, res) => {
  // Если карта была выбрана и прошло менее 5 секунд
  if (selectedCard && Date.now() - lastUpdateTime < 5000) {
    const card = selectedCard;
    selectedCard = null; // Очищаем карту после отправки
    res.json({ card });
  } else {
    res.json({ card: null });
  }
});

// Раздача статических файлов из папки build
app.use(express.static(path.join(__dirname, "build")));

// Обработка всех остальных маршрутов
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
