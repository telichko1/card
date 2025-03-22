import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardDeck from "./components/CardDeck";
import ViewerPage from "./components/ViewerPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CardDeck />} />
          <Route path="/1" element={<ViewerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
