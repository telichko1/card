import React, { useState, useEffect } from "react";
import "./CardDeck.css";

const CardDeck = () => {
  const suits = ["♠", "♥", "♦", "♣"];
  const suitNames = {
    "♠": "пики",
    "♥": "черви",
    "♦": "бубны",
    "♣": "трефы",
  };
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const valueNames = {
    A: "туз",
    J: "валет",
    Q: "дама",
    K: "король",
  };
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSuit, setSelectedSuit] = useState(null);

  // Проверяем localStorage при загрузке и при изменениях
  useEffect(() => {
    const checkLocalStorage = () => {
      const storedCard = localStorage.getItem("selectedCard");
      // Если карта была очищена на странице зрителя, сбрасываем выбор
      if (!storedCard && selectedCard) {
        setSelectedCard(null);
      }
    };

    const interval = setInterval(checkLocalStorage, 1000);
    return () => clearInterval(interval);
  }, [selectedCard]);

  const getCardName = (card) => {
    const valueName = valueNames[card.value] || card.value;
    return `${valueName} ${suitNames[card.suit]}`;
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    const cardName = getCardName(card);
    localStorage.setItem("selectedCard", cardName);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setSelectedSuit(null);
    localStorage.removeItem("selectedCard");
  };

  const handleSuitClick = (suit) => {
    setSelectedSuit(suit === selectedSuit ? null : suit);
  };

  return (
    <div className="card-deck">
      <h1>Выберите масть</h1>
      <div className="suits-container">
        {suits.map((suit) => (
          <div
            key={suit}
            className={`suit-button ${
              suit === "♥" || suit === "♦" ? "red" : "black"
            } ${selectedSuit === suit ? "selected" : ""}`}
            onClick={() => handleSuitClick(suit)}
          >
            <div className="suit-symbol">{suit}</div>
            <div className="suit-name">{suitNames[suit]}</div>
          </div>
        ))}
      </div>

      {selectedSuit && (
        <>
          <h2>Выберите карту {suitNames[selectedSuit]}</h2>
          <div className="values-container">
            {values.map((value) => (
              <div
                key={`${value}${selectedSuit}`}
                className={`card ${
                  selectedSuit === "♥" || selectedSuit === "♦" ? "red" : "black"
                } ${
                  selectedCard?.value === value &&
                  selectedCard?.suit === selectedSuit
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleCardClick({ value, suit: selectedSuit })}
              >
                <div className="card-value">{value}</div>
                <div className="card-suit">{selectedSuit}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCard && (
        <div className="selected-info">
          <div>Выбрана карта: {getCardName(selectedCard)}</div>
          <button className="reset-button" onClick={handleReset}>
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  );
};

export default CardDeck;
