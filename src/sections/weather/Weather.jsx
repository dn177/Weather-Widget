import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import "./Weather.css";
import axios from "axios";

function WeatherGrid() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("Munich");
  const [country, setCountry] = useState("Germany");
  const [errormsg, setErrormsg] = useState(t('weather.errors.noData'));
  const isFirst = useRef(true);
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=Europe%2FBerlin";
  const NINJAS_API_KEY = "ZO9arBg2KlmXrGAGiWT1/A==Jis6QiHm09iT7ySH";
  const days = [
    t('weather.weekdays.sunday'),
    t('weather.weekdays.monday'),
    t('weather.weekdays.tuesday'),
    t('weather.weekdays.wednesday'),
    t('weather.weekdays.thursday'),
    t('weather.weekdays.friday'),
    t('weather.weekdays.saturday'),
  ];
  const production = false;

  //check if is first is necessary
  useEffect(() => {
    if (!isFirst.current) {
      debounce(fetchCity(), 1000);
    }
  }, [city, country]);

  useEffect(() => {
    fetchData();
    isFirst.current = false;
  }, []);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  //fetch data from default url specified in url variable
  async function fetchData() {
    await axios
      .get(url)
      .then((res) => {
        setWeather(res?.data);
      })
      .catch((error) => {
        setErrormsg(t('weather.errors.fetchDefault'));
      });
  }

  // fetches weather data based on latitude and longitude
  async function fetchCoordData(lat, long) {
    await axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=Europe%2FBerlin`,
        {}
      )
      .then((res) => {
        setWeather(res?.data);
      })
      .catch((err) => {
        setErrormsg(t('weather.errors.fetchCoords'));
      });
  }

  //fetches city coordinates based on city entered in input
  async function fetchCity() {
    await axios
      .get(
        `https://api.api-ninjas.com/v1/geocoding?city=${
          Object.keys(city).length > 0 ? city : "Munich"
        }&country=${Object.keys(country).length > 0 ? country : "Germany"}`,
        {
          headers: {
            "X-API-KEY": NINJAS_API_KEY,
          },
        }
      )
      .then((res) => {
        fetchCoordData(res.data[0].latitude, res.data[0].longitude);
        // return res;
      })
      .catch((error) => {
        setErrormsg(t('weather.errors.cityNotFound'));
      });
  }

  //handles change of the city input
  function handleCityChange(event) {
    event.preventDefault();
    setCity(event.target.value);
  }

  //debounces city input change handler to avoid unnecessary API requests
  const debouncedHandleCityChange = debounce(handleCityChange, 500);

  //handles location (country) input change
  function handleLocationChange(event) {
    event.preventDefault();
    setCountry(event.target.value);
  }

  //debounces city input change handler to avoid unnecessary API requests
  const debouncedHandleLocationChange = debounce(handleLocationChange, 500);

  return (
    <div className="weather-widget">
      <h2 className="weather-widget__headline">
        {t('weather.headline')}
      </h2>
      <div className="input-wrapper">
        <input
          type="text"
          name="city"
          id="city"
          placeholder={t('weather.placeholders.city')}
          onChange={debouncedHandleCityChange}
        />
        <input
          type="text"
          name="country"
          id="country"
          placeholder={t('weather.placeholders.country')}
          onChange={debouncedHandleLocationChange}
        />
      </div>
      {Object.keys(weather).length > 0 ? (
        <div className="weathergrid mx-auto">
          {weather.daily.rain_sum
            .map((wdata, index) => {
              return (
                <div className="weathergrid__el" key={index}>
                  <p className="weekday">
                    {index === 0
                      ? t('weather.today')
                      : days[new Date(weather.daily.time[index]).getDay()]}
                  </p>
                  <div className="temp-wrapper">
                    <span className="temp">
                      {weather.daily.temperature_2m_max[index]}&deg;
                    </span>
                    <span className="temp__type">{t('weather.max')}</span>
                  </div>
                  <div className="temp-wrapper">
                    <span className="temp">
                      {weather.daily.temperature_2m_min[index]}&deg;
                    </span>
                    <span className="temp__type">{t('weather.min')}</span>
                  </div>
                </div>
              );
            })
            .slice(0, 5)}
        </div>
      ) : (
        <p>{errormsg}</p>
      )}
      <button className="github-btn">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/dn177/Weather-Widget"
        >
          {t('weather.githubButton')}
        </a>
      </button>
    </div>
  );
}

export default WeatherGrid;
