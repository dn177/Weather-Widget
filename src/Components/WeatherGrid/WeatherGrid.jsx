import { useState, useEffect, useRef } from "react";
import "./WeatherGrid.css";
import axios from "axios";

function WeatherGrid() {
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("Munich");
  const [country, setCountry] = useState("Germany");
  const [errormsg, setErrormsg] = useState("No weather data found.");
  const isFirst = useRef(true);
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=Europe%2FBerlin";
  //get your API_KEY here: https://api-ninjas.com/api/geocoding
  const NINJAS_API_KEY = process.env.REACT_APP_NINJAS_API_KEY;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
        setErrormsg("Couldn't fetch default weather data.");
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
        setErrormsg("Couldn't fetch weather data with given input values.");
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
      })
      .catch((error) => {
        setErrormsg("Couldn't find city.");
      });
  }

  //handles change of the city input
  function handleCityChange(event) {
    event.preventDefault();
    setCity(event.target.value);
  }

  //debounces city input change handler to avoid unnecessary API requests
  const debouncedHandleCityChange = debounce(handleCityChange, 500);

  //handles country input change
  function handleLocationChange(event) {
    event.preventDefault();
    setCountry(event.target.value);
  }

  //debounces country input change handler to avoid unnecessary API requests
  const debouncedHandleLocationChange = debounce(handleLocationChange, 500);

  return (
    <div className="weather-widget">
      <h2 className="weather-widget__headline">
        Weather Forecast using Open Meteo API
      </h2>
      <div className="input-wrapper">
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Enter city"
          onChange={debouncedHandleCityChange}
        />
        <input
          type="text"
          name="country"
          id="country"
          placeholder="Enter country"
          onChange={debouncedHandleLocationChange}
        />
      </div>
      {Object.keys(weather).length > 0 ? (
        <div className="weathergrid mx-auto">
          {weather.daily.rain_sum.map((wdata, index) => {
            return (
              <div className="weathergrid__el" key={index}>
                <p className="weekday">
                  {index === 0
                    ? "Today"
                    : days[new Date(weather.daily.time[index]).getDay()]}
                </p>
                <div className="temp-wrapper">
                  <span className="temp">
                    {weather.daily.temperature_2m_max[index]}&deg;
                  </span>
                  <span className="temp-type">Max</span>
                </div>
                <div className="temp-wrapper">
                  <span className="temp">
                    {weather.daily.temperature_2m_min[index]}&deg;
                  </span>
                  <span className="temp-type">Min</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>{errormsg}</p>
      )}
    </div>
  );
}

export default WeatherGrid;
