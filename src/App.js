import React, { useEffect, useState } from "react";
import { Api } from "./ApiServise";
import { useStateValue } from "./StateProvider";
import { dateBuilder } from "./DateBuild";
import Spinner from "./Spinner";

function App() {
  const [query, setQuery] = useState("");

  const [error, setError] = useState("");
  const [{ CITIES }, dispatch] = useStateValue();

  // UPDATE DATA WHERE APP REFRESH OR ADD/DALETE NEW CITY

  useEffect(() => {
    CITIES.forEach((element) => {
      Api.getWeatherFromCity(element.name)
        .then((result) => {
          dispatch({
            type: "UPDATE_CITIES",
            name: element.name,
            temprature: result.main.temp,
          });
        })
        .catch((error) => {
          console.log(error);
          setError("Can't update cities");
        });
    });

    localStorage.setItem("cities", JSON.stringify(CITIES));
  }, [CITIES]);

  // GET GEOPOSITION
  const [loading, setLoading] = useState(false);

  const [currentCity, setCurrentCity] = useState(null);

  const getPosition = (options) => {
    if (navigator.geolocation) {
      new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);

        setLoading(true);
      })
        //If user allow location service then will fetch data & send it to get-weather function.
        .then((position) => {
          Api.getWeatherFromCoordinate(
            position.coords.latitude,
            position.coords.longitude
          ).then((result) => {
            setLoading(false);
            setCurrentCity(result);
          });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          setError("Please allow geolocation assess or try later");
        });
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  // SEARCH CITY
  const search = () => {
    setError("");
    if (
      CITIES.filter((city) => city.name.toUpperCase() === query.toUpperCase())
        .length === 0
    ) {
      Api.getWeatherFromCity(query)
        .then((result) => {
          dispatch({
            type: "ADD_CITY",
            name: result.name,
            country: result.sys.country,
            temprature: result.main.temp,
          });
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
          setError("Can't add city, check city name " + query);
        });
    } else {
      alert("Already exist");
    }
    setQuery("");
  };

  const deleteCity = (city) => {
    dispatch({
      type: "DELETE_CITY",
      name: city.name,
    });
  };

  return (
    <>
      <main>
        <h3 className="error">{error}</h3>
        {loading && <Spinner />}
        <div className="current-city">
          {currentCity && (
            <div key={currentCity.name}>
              <h4>Weather in your city</h4>
              <div className="location-box">
                <div className="location">
                  {currentCity.name}, {currentCity.sys.country}
                </div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                  {Math.round(currentCity.main.temp)}°c
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button onClick={search}>ADD</button>
        </div>
        {CITIES.map((city) => {
          if (city?.name) {
            return (
              <div key={city.name}>
                <div className="location-box">
                  <div className="location">
                    {city.name}, {city.country}
                  </div>
                  <div className="date">{dateBuilder(new Date())}</div>
                </div>
                <div className="weather-box">
                  <div className="temp">{Math.round(city.temprature)}°c</div>
                  <button onClick={() => deleteCity(city)}>DELETE</button>
                </div>
              </div>
            );
          }
        }).reverse()}
      </main>
    </>
  );
}

export default App;
