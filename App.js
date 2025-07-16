import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Get current weather
      const weatherResponse = await axios.get(`${API_BASE}/weather/${searchCity}`);
      setWeather(weatherResponse.data);
      
      // Get forecast
      const forecastResponse = await axios.get(`${API_BASE}/forecast/${searchCity}`);
      setForecast(forecastResponse.data.forecasts);
      
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather(city);
  };

  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.city)) {
      setFavorites([...favorites, weather.city]);
    }
  };

  const removeFromFavorites = (cityToRemove) => {
    setFavorites(favorites.filter(fav => fav !== cityToRemove));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Weather Dashboard</h1>
      </header>

      <main className="main-content">
        {/* Search Section */}
        <section className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-button">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </section>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Current Weather */}
        {weather && (
          <section className="weather-section">
            <div className="weather-card">
              <div className="weather-header">
                <h2>{weather.city}, {weather.country}</h2>
                <button 
                  onClick={addToFavorites}
                  className="favorite-button"
                  disabled={favorites.includes(weather.city)}
                >
                  {favorites.includes(weather.city) ? '⭐ Favorited' : '☆ Add to Favorites'}
                </button>
              </div>
              
              <div className="weather-main">
                <div className="temperature-section">
                  <img 
                    src={`https://openweathermap.org/img/w/${weather.icon}.png`}
                    alt={weather.description}
                    className="weather-icon"
                  />
                  <span className="temperature">{weather.temperature}°C</span>
                </div>
                <p className="description">{weather.description}</p>
              </div>
              
              <div className="weather-details">
                <div className="detail">
                  <span className="label">Humidity:</span>
                  <span className="value">{weather.humidity}%</span>
                </div>
                <div className="detail">
                  <span className="label">Wind Speed:</span>
                  <span className="value">{weather.wind_speed} m/s</span>
                </div>
                <div className="detail">
                  <span className="label">Pressure:</span>
                  <span className="value">{weather.pressure} hPa</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <section className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <div className="forecast-date">{day.date}</div>
                  <img 
                    src={`https://openweathermap.org/img/w/${day.icon}.png`}
                    alt={day.description}
                    className="forecast-icon"
                  />
                  <div className="forecast-temp">{day.temperature}°C</div>
                  <div className="forecast-desc">{day.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <section className="favorites-section">
            <h3>Favorite Cities</h3>
            <div className="favorites-grid">
              {favorites.map((favCity, index) => (
                <div key={index} className="favorite-item">
                  <button 
                    onClick={() => searchWeather(favCity)}
                    className="favorite-city-button"
                  >
                    {favCity}
                  </button>
                  <button 
                    onClick={() => removeFromFavorites(favCity)}
                    className="remove-favorite-button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;