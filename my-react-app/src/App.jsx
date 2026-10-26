
import { useState } from "react";
import "./App.css";

const forecast = [
  { day: "Mon", icon: "⛅", high: 22, low: 12 },
  { day: "Tue", icon: "☁️", high: 21, low: 10 },
  { day: "Wed", icon: "🌤️", high: 18, low: 10 },
  { day: "Thu", icon: "☁️", high: 18, low: 12 },
  { day: "Fri", icon: "☀️", high: 18, low: 11 },
];

function App() {
  const [city, setCity] = useState("San Francisco");
  const [search, setSearch] = useState("");

  function handleSearch(event) {
    event.preventDefault();

    if (search.trim()) {
      setCity(search.trim());
      setSearch("");
    }
  }

  return (
    <main className="page">
      <div className="weather-app">
        

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter a city..."
            aria-label="Enter a city"
          />
          <button type="submit">Search <span>↗</span></button>
        </form>

        <div className="divider" />

        <section className="current-weather">
          <div className="weather-info">
            <h1>{city}</h1>
            <p className="conditions">Monday 13:23, few clouds</p>
            <p className="weather-details">
              Humidity: <span>81%</span>, Wind: <span>2.68 km/h</span>
            </p>
          </div>

          <div className="temperature-display">
            <span className="current-icon" aria-label="Partly cloudy">
              ⛅
            </span>
            <span className="temperature">13<sup>°C</sup></span>
          </div>
        </section>

        <section className="forecast" aria-label="Five-day forecast">
          {forecast.map((day) => (
            <article className="forecast-day" key={day.day}>
              <p className="forecast-name">{day.day}</p>
              <span className="forecast-icon" role="img" aria-label="Weather">
                {day.icon}
              </span>
              <p className="forecast-temperatures">
                <span className="high">{day.high}°</span>
                <span className="low">{day.low}°</span>
              </p>
            </article>
          ))}
        </section>

        <footer className="footer">
          <span> Made by Shannen <span className="footer-heart">♥</span></span>
          <span>Weather for wherever you are.</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
