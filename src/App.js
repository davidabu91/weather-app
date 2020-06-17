import React, { useState } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from './components/home/Home.component';
import Favorites from './components/favorites/Favorites.component';
import './App.css';
import Header from './components/header/Header.component';

function App() {

    const apiKey = 'pbMi18QKIQNM2jsp1tjmvujSbTVW6ebv'

    const [favorites, setFavorites] = useState([])
    const [favoritCity, setFavoritCity] = useState('')
    const [fiveDays, setFiveDays] = useState()

    const setCurrentCity = (currentCity) => {
        setFiveDays(currentCity)
    }



    const d = new Date();
    const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[7] = "Sunday";
    weekday[8] = "Monday";
    weekday[9] = "Tuesday";
    weekday[10] = "Wednesday";
    const n = weekday[d.getDay()]

    const getForecast = (cityId, cityName) => {
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                setFiveDays([{
                        cityName: cityName,
                        id: cityId,
                        dayName: weekday[d.getDay()],
                        temp: Math.round(toCelsius([response['DailyForecasts'][0]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][0]['Day']['IconPhrase']]
                    },
                    {
                        dayName: weekday[d.getDay() + 1],
                        temp: Math.round(toCelsius([response['DailyForecasts'][1]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']]
                    },
                    {
                        dayName: weekday[d.getDay() + 2],
                        temp: Math.round(toCelsius([response['DailyForecasts'][2]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']]
                    },
                    {
                        dayName: weekday[d.getDay() + 3],
                        temp: Math.round(toCelsius([response['DailyForecasts'][3]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][3]['Day']['IconPhrase']]
                    },
                    {
                        dayName: weekday[d.getDay() + 4],
                        temp: Math.round(toCelsius([response['DailyForecasts'][4]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][4]['Day']['IconPhrase']]
                    },
                ])
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong with calling a server, please choose a city')
            })
    }

    const toCelsius = (f) => {
        return (5 / 9) * (f - 32)
    }

    const addToFavorites = (fiveDays, city, id) => {
        if (favoritCity.includes(city)) {
            alert('is in your favorites')
            return
        } else {
            setFavorites([...favorites, fiveDays[0]])
            setFavoritCity([...favoritCity, city])

        }
    }


    const remove = (city) => {

        let temp = favorites
        let tempCitys = favoritCity

        for (let i = 0; i < favorites.length; i++) {
            if (city === favorites[i].cityName) {
                temp.splice(i, 1)
                tempCitys.splice(i, 1)
                setFavorites(temp)
            }

        }
    }

    const favorCity = (cityId, cityName) => {
        getForecast(cityId, cityName)
    }

    return ( <
        div className = "App" >
        <
        Router >

        <
        div >
        <
        Header / >
        <
        Switch >
        <
        Route path = "/Favorites" >
        <
        Favorites favorites = { favorites }
        apiKey = { apiKey }
        remove = { remove }
        favorCity = { favorCity }
        getForecast = { getForecast }
        remove = { remove }

        /> < /
        Route > <
        Route path = "/" >
        <
        Home addToFavorites = { addToFavorites }
        favoritCity = { favoritCity }
        apiKey = { apiKey }
        remove = { remove }
        fiveDays = { fiveDays }
        setCurrentCity = { setCurrentCity }
        /> < /
        Route > <
        /Switch> < /
        div > <
        /Router> < /
        div >
    );
}

export default App;