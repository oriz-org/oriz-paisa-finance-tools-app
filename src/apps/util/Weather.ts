/**
 * FinSuite OS - Weather
 */
import { getWeather, geocodeCity, getWeatherDescription, getWeatherIcon } from '@/services/utility';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🌤️ Weather</h1>
      <p class="page-subtitle">Hyper-local weather forecast</p>
    </header>
    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <div class="input-group">
        <label class="input-label" for="city">City</label>
        <div style="display: flex; gap: var(--space-3);">
          <input type="text" class="input" id="city" placeholder="Enter city name..." value="Mumbai">
          <button class="btn btn--primary" id="get-weather">Get Weather</button>
        </div>
      </div>
    </div>
    <div id="weather-data"></div>
  `;

  const cityInput = container.querySelector('#city') as HTMLInputElement;
  const getWeatherBtn = container.querySelector('#get-weather') as HTMLButtonElement;
  const weatherEl = container.querySelector('#weather-data') as HTMLElement;

  async function fetchWeather(): Promise<void> {
    const city = cityInput.value.trim();
    if (!city) return;

    getWeatherBtn.disabled = true;
    weatherEl.innerHTML = '<div class="skeleton" style="height: 300px;"></div>';

    try {
      const location = await geocodeCity(city);
      if (!location) {
        weatherEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">City not found</div>';
        return;
      }

      const weather = await getWeather(location.latitude, location.longitude);
      if (!weather) {
        weatherEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Weather data unavailable</div>';
        return;
      }

      weatherEl.innerHTML = `
        <div class="glass-card" style="padding: var(--space-8); text-align: center; margin-bottom: var(--space-6);">
          <div style="font-size: 64px; margin-bottom: var(--space-4);">${getWeatherIcon(weather.weatherCode, weather.isDay)}</div>
          <div style="font-size: var(--text-5xl); font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">${weather.temperature}°C</div>
          <div style="font-size: var(--text-lg); color: var(--text-secondary); margin-bottom: var(--space-2);">${getWeatherDescription(weather.weatherCode)}</div>
          <div style="color: var(--text-tertiary);">${location.city}, ${location.country}</div>
        </div>

        <div class="stats-grid mb-6">
          <div class="stat-card">
            <div class="stat-icon">💧</div>
            <div class="stat-value">${weather.humidity}%</div>
            <div class="stat-label">Humidity</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💨</div>
            <div class="stat-value">${weather.windSpeed}</div>
            <div class="stat-label">Wind (km/h)</div>
          </div>
        </div>

        <div class="glass-card" style="padding: var(--space-5);">
          <h3 style="margin-bottom: var(--space-4);">7-Day Forecast</h3>
          <div style="display: flex; gap: var(--space-4); overflow-x: auto;">
            ${weather.daily.time.slice(0, 7).map((date, i) => `
              <div style="text-align: center; min-width: 80px;">
                <div style="font-size: var(--text-sm); color: var(--text-tertiary);">${new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                <div style="font-size: 28px; margin: var(--space-2) 0;">${getWeatherIcon(weather.daily.weatherCode[i], true)}</div>
                <div style="font-family: var(--font-mono);">
                  <span style="color: var(--accent-cost);">${weather.daily.temperatureMax[i]}°</span>
                  <span style="color: var(--text-tertiary);">${weather.daily.temperatureMin[i]}°</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch {
      weatherEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to fetch weather</div>';
    } finally {
      getWeatherBtn.disabled = false;
    }
  }

  getWeatherBtn.addEventListener('click', fetchWeather);
  cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchWeather(); });
  fetchWeather();

  return container;
}
