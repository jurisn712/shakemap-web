import React from "react";
import MapComponent from "./Map.jsx";
import "./App.css"; // Подключаем стили

function App() {
  return (
    <div className="app-container">
      <h1>Shakemap - Карта вибраций</h1>
      <MapComponent />
    </div>
  );
}

export default App;
