import React, { useEffect, useState } from "react";
import "./ViewerPage.css";

const ViewerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [randomQueries] = useState([
    "2 черви",
    "2 пики",
    "2 бубны",
    "2 трефы",
    "карты игральные",
    "колода карт",
    "карты для покера",
    "карточные фокусы",
  ]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");

  useEffect(() => {
    const changePlaceholder = () => {
      const newPlaceholder =
        randomQueries[Math.floor(Math.random() * randomQueries.length)];
      setCurrentPlaceholder(newPlaceholder);
    };
    changePlaceholder();
    const placeholderInterval = setInterval(changePlaceholder, 3000);
    return () => clearInterval(placeholderInterval);
  }, [randomQueries]);

  useEffect(() => {
    // Очищаем историю браузера при загрузке
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "/");
    }

    let lastCheck = Date.now();
    let redirectAttempts = 0;

    const checkCard = async () => {
      try {
        const response = await fetch("/api/checkCard");
        const data = await response.json();

        if (data.card) {
          setSearchQuery(data.card);
          const yandexUrl = `https://yandex.ru/images/search?text=${encodeURIComponent(
            data.card
          )}`;

          // Пытаемся разными способами открыть URL
          const openUrl = () => {
            try {
              // Способ 1: Прямой редирект
              window.location.href = yandexUrl;
            } catch (e) {
              try {
                // Способ 2: Через assign
                window.location.assign(yandexUrl);
              } catch (e) {
                try {
                  // Способ 3: Через replace
                  window.location.replace(yandexUrl);
                } catch (e) {
                  // Способ 4: Через временный iframe
                  const iframe = document.createElement("iframe");
                  iframe.style.display = "none";
                  iframe.src = yandexUrl;
                  document.body.appendChild(iframe);
                  setTimeout(() => iframe.remove(), 1000);
                }
              }
            }
          };

          // Повторяем попытку редиректа несколько раз
          const redirectInterval = setInterval(() => {
            if (redirectAttempts < 5) {
              openUrl();
              redirectAttempts++;
            } else {
              clearInterval(redirectInterval);
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error checking card:", error);
      }
    };

    // Проверяем карту каждые 100мс
    const checkInterval = setInterval(checkCard, 100);

    // Принудительно обновляем страницу каждые 2 секунды
    const reloadInterval = setInterval(() => {
      const now = Date.now();
      // Обновляем только если прошло больше 2 секунд с последней проверки
      if (now - lastCheck > 2000) {
        lastCheck = now;
        window.location.reload();
      }
    }, 2000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(reloadInterval);
    };
  }, []);

  return (
    <div className="yandex-images">
      <header className="header">
        <div className="logo">
          <span className="ya">Я</span>ндекс
        </div>
        <div className="services">
          <span>Поиск</span>
          <span>Нейро</span>
          <span className="active">Картинки</span>
          <span>Видео</span>
          <span>Карты</span>
          <span>Товары</span>
        </div>
      </header>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            readOnly
            placeholder={currentPlaceholder}
          />
          <button className="search-button">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="categories">
        <div className="category active">HD Обои</div>
        <div className="category">Лица</div>
        <div className="category">GIF</div>
        <div className="category">Рисунки</div>
        <div className="category">Цвета</div>
        <div className="category">Товары</div>
      </div>

      <div className="content">
        <div className="suggestions">
          <div className="suggestion-title">Популярные запросы</div>
          <div className="suggestion-items">
            {randomQueries.map((query, index) => (
              <div key={index} className="suggestion-item">
                <svg className="history-icon" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
                    fill="currentColor"
                  />
                </svg>
                {query}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
