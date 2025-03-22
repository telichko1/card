import React, { useState } from "react";
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

  const getCardName = (card) => {
    const valueName = valueNames[card.value] || card.value;
    return `${valueName} ${suitNames[card.suit]}`;
  };

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    const cardName = getCardName(card);
    try {
      await fetch("/api/setCard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card: cardName }),
      });
    } catch (error) {
      console.error("Error setting card:", error);
    }
  };

  const handleReset = async () => {
    setSelectedCard(null);
    setSelectedSuit(null);
    try {
      await fetch("/api/setCard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card: null }),
      });
    } catch (error) {
      console.error("Error resetting card:", error);
    }
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
