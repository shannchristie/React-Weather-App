import { useState } from "react";
import "./App.css";

const API_KEY = "ffddcebaf06e0to44a664648399a8013";
const API = "https://api.shecodes.io/weather/v1";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(event) {
    event.preventDefault();

    const city = cityInput.trim();
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const query = `query=${encodeURIComponent(city)}&key=${API_KEY}&units=metric`;

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${API}/current?${query}`),
        fetch(`${API}/forecast?${query}`),
      ]);

      if (!currentResponse.ok) {
        throw new Error("City not found. Please try another city.");
      }

      const currentData = await currentResponse.json();
      const forecastData = forecastResponse.ok
        ? await forecastResponse.json()
        : null;

      if (!currentData?.temperature) {
        throw new Error("Weather data was unavailable for this city.");
      }

      setWeather(currentData);

      const days =
        forecastData?.daily ??
        forecastData?.forecast ??
        forecastData?.data?.daily ??
        [];

      setForecast(Array.isArray(days) ? days.slice(0, 5) : []);

      if (!forecastResponse.ok || !Array.isArray(days) || days.length === 0) {
        setError(
          "Current weather loaded, but the forecast wasn't available. Check the forecast API response."
        );
      }
    } catch (err) {
      setError(err.message || "Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function dayName(value) {
    if (!value) return "Forecast";

    const date = new Date(
      typeof value === "number" && value < 1e12 ? value * 1000 : value
    );

    return Number.isNaN(date.getTime())
      ? "Forecast"
      : date.toLocaleDateString("en-GB", { weekday: "short" });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">WEATHER, EVERYWHERE</p>
        <h1>World Weather</h1>
        <p className="subtitle">
          Forecast for wherever life takes you.
        </p>
      </header>

      <form className="search-form" onSubmit={searchWeather}>
        <input
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          placeholder="Enter a city, e.g. London"
          aria-label="Search for a city"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading…" : "Search"}
        </button>
      </form>

      {error && <p className="message">{error}</p>}

      {weather && (
        <>
          <section className="current-weather">
            <div className="current-details">
              <p className="eyebrow">CURRENT WEATHER</p>
              <h2>{weather.city}</h2>
              <p className="condition">
                {weather.condition?.description}
              </p>
              {weather.temperature.feels_like != null && (
                <p className="feels-like">
                  Feels like {Math.round(weather.temperature.feels_like)}°C
                </p>
              )}
            </div>

            <div className="temperature-area">
              {weather.condition?.icon_url && (
                <img
                  className="weather-icon"
                  src={weather.condition.icon_url}
                  alt={weather.condition.description || "Current weather"}
                />
              )}
              <p className="temperature">
                {Math.round(weather.temperature.current)}°
                <span>C</span>
              </p>
            </div>
          </section>

          <section className="forecast-section">
            <div className="section-heading">
              <h3>5-day forecast</h3>
              <p>Coming up</p>
            </div>

            {forecast.length > 0 ? (
              <div className="forecast-grid">
                {forecast.map((day, index) => {
                  const date = day.time ?? day.date ?? day.dt;
                  const icon =
                    day.condition?.icon_url ??
                    day.condition?.icon ??
                    day.icon_url;
                  const description =
                    day.condition?.description ??
                    day.description ??
                    "Forecast";
                  const high =
                    day.temperature?.maximum ??
                    day.temperature?.max ??
                    day.temp?.max;
                  const low =
                    day.temperature?.minimum ??
                    day.temperature?.min ??
                    day.temp?.min;

                  return (
                    <article className="forecast-day" key={date ?? index}>
                      <p className="forecast-name">{dayName(date)}</p>
                      {icon && (
                        <img
                          src={icon}
                          alt={description}
                          className="forecast-icon"
                        />
                      )}
                      <p className="forecast-description">{description}</p>
                      <p className="forecast-temperatures">
                        {high != null && <strong>{Math.round(high)}°</strong>}
                        {high != null && low != null && " / "}
                        {low != null && <span>{Math.round(low)}°</span>}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="message">
                No forecast data returned yet. Check the forecast API response.
              </p>
            )}
          </section>
        </>
      )}

      {!weather && !loading && (
        <p className="welcome-message">
          Search for a destination to discover its weather.
        </p>
      )}

      <footer className="footer">
        Made by Shannen · Hosted on{" "}
        <a
          href="https://github.com/shannchristie/React-Weather-App"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://spectacular-chebakia-00546a.netlify.app"
          target="_blank"
          rel="noreferrer"
        >
          Netlify
        </a>
      </footer>
    </main>
  );
}

export default App;
