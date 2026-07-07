import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Weather.css";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
// Keyless geocoding (replaces the former api-ninjas endpoint, which required
// a client-side API key — see CODE-REVIEW.md §2).
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Default view on first load: Berlin (same coordinates the widget always used).
const DEFAULT_COORDS = { latitude: 52.52, longitude: 13.41 };

const DEBOUNCE_MS = 500;
const VISIBLE_DAYS = 5;

const buildForecastUrl = ({ latitude, longitude }) =>
  `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
  "&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=Europe%2FBerlin";

function WeatherGrid() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  // The error is stored as a translation KEY and translated at render time,
  // so the message follows live language switches instead of freezing in
  // whatever language was active when the fetch failed.
  const [errorKey, setErrorKey] = useState("weather.errors.noData");

  // Initial load: default coordinates, no geocoding round-trip needed.
  useEffect(() => {
    let cancelled = false;

    fetch(buildForecastUrl(DEFAULT_COORDS))
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setErrorKey("weather.errors.fetchDefault");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // City/country search. The debounce lives in the effect: the timer is
  // cleared whenever the inputs change again (or on unmount), so only the
  // last value within DEBOUNCE_MS triggers a request.
  useEffect(() => {
    const query = city.trim();
    if (!query) return undefined;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const geoRes = await fetch(
          `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
        );
        if (!geoRes.ok) throw new Error("geocoding request failed");
        const geo = await geoRes.json();

        const wanted = country.trim().toLowerCase();
        const match = (geo.results || []).find(
          (r) =>
            !wanted ||
            r.country?.toLowerCase().includes(wanted) ||
            r.country_code?.toLowerCase() === wanted,
        );
        if (!match) throw new Error("city not found");

        const forecastRes = await fetch(buildForecastUrl(match));
        if (!forecastRes.ok) throw new Error("forecast request failed");
        const forecast = await forecastRes.json();

        if (!cancelled) setWeather(forecast);
      } catch {
        // Keep the last successful forecast on screen; the message only
        // shows when there is no data at all (same behaviour as before).
        if (!cancelled) setErrorKey("weather.errors.cityNotFound");
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [city, country]);

  const days = [
    t("weather.weekdays.sunday"),
    t("weather.weekdays.monday"),
    t("weather.weekdays.tuesday"),
    t("weather.weekdays.wednesday"),
    t("weather.weekdays.thursday"),
    t("weather.weekdays.friday"),
    t("weather.weekdays.saturday"),
  ];

  const hasForecast = Boolean(weather?.daily?.time?.length);

  return (
    <div className="weather-widget">
      <h2 className="weather-widget__headline">{t("weather.headline")}</h2>
      <div className="input-wrapper">
        <label htmlFor="city" className="visually-hidden">
          {t("weather.labels.city")}
        </label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder={t("weather.placeholders.city")}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="country" className="visually-hidden">
          {t("weather.labels.country")}
        </label>
        <input
          type="text"
          name="country"
          id="country"
          placeholder={t("weather.placeholders.country")}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      {hasForecast ? (
        <div className="weathergrid mx-auto">
          {weather.daily.time.slice(0, VISIBLE_DAYS).map((date, index) => (
            <div className="weathergrid__el" key={date}>
              <p className="weekday">
                {index === 0
                  ? t("weather.today")
                  : days[new Date(date).getDay()]}
              </p>
              <div className="temp-wrapper">
                <span className="temp">
                  {weather.daily.temperature_2m_max[index]}&deg;
                </span>
                <span className="temp__type">{t("weather.max")}</span>
              </div>
              <div className="temp-wrapper">
                <span className="temp">
                  {weather.daily.temperature_2m_min[index]}&deg;
                </span>
                <span className="temp__type">{t("weather.min")}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t(errorKey)}</p>
      )}
      <div className="weather-widget__footer">
        <a
          className="github-btn"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/dn177/Weather-Widget"
        >
          {t("weather.githubButton")}
        </a>
      </div>
    </div>
  );
}

export default WeatherGrid;
