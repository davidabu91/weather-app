import React, { useState, useEffect } from 'react'
import './home.styles.css'
import DayCard from '../day-card/DayCard.component';

export default function Home({ addToFavorites, favoritCity, apiKey, fiveDays, setCurrentCity, remove }) {
    const [cityName, setCityName] = useState()
    const [cityId, setCityId] = useState()
    const [ShowForecastButton, setShowForecastButton] = useState(false)
    const [dropdown, setDropdown] = useState([])
    const DefaultId = { id: '215854', name: 'Tel Aviv' }


    const hendleCity = (e) => {
        let letters = /^[A-Za-z]+$/;
        if (e.target.value.match(letters)) {
            setCityName(e.target.value)
        }
        return
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


    const add = () => {
        for (let i = 0; i < favoritCity.length; i++) {
            if (cityName == favoritCity[i]) {
                alert('Already in favor')
                return
            }
        }
        addToFavorites(fiveDays, cityName, cityId)
    }


    const getAutoComplete = () => {
        if (cityName == '') {
            return
        }
        fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${cityName}`)
            .then(response => response.json())
            .then(response => {
                let citys = [];
                let city = {};
                for (let i = 0; i < response.length; i++) {
                    city = {
                        name: response[i].LocalizedName,
                        id: response[i].Key
                    }
                    citys.push(city)
                }
                setDropdown(citys)
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong...')
            })
    }



    const defaultForecast = (id) => {
        if (favoritCity.length > 0) {
            return
        }
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${DefaultId.id}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                let currentCity = [
                    {
                        cityName: DefaultId.name,
                        id: DefaultId.id,
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
                ]
                setCurrentCity(currentCity)
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong with calling a server, please choose a city')
            })
    }

    const getForecast = () => {
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                let currentCity = [
                    {
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
                ]
                setCurrentCity(currentCity)
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong with calling a server, please choose a city')
            })
    }


    const toCelsius = (f) => {
        return (5 / 9) * (f - 32)
    }


    const clickButtonForecast = () => {
        setShowForecastButton(!ShowForecastButton)
        getForecast()
    }

    const chooseCity = (e) => {
        setCityId(e.target.id)
        setCityName(e.target.name)
        setDropdown([])
        setShowForecastButton(!ShowForecastButton)
    }

    useEffect(defaultForecast, [])
    useEffect(() => { setCityName(favoritCity[0]) }, [])
    useEffect(() => { getAutoComplete(cityName) }, [cityName])


    return (
        <div className='container'>
            <h1>WEATHER APP</h1>
            <div>
                {ShowForecastButton ?
                    <div>
                        <h3>{cityName}</h3>
                        <button onClick={clickButtonForecast} >getForecast</button>
                    </div> : null}
                <div className='button-container'>
                    <input
                        type="text"
                        onChange={hendleCity}
                        placeholder={cityName}
                    />
                    {dropdown.map(city => {
                        return <button className='button' onClick={chooseCity} id={city.id} name={city.name}>{city.name}</button>
                    })}
                </div>
            </div>
            <div>{fiveDays ? <div>
                <h2>{fiveDays[0].cityName}</h2>
                <h5>{`${fiveDays[0].temp} C`}</h5>
            </div>
                : null}
            </div>

            <div>
                {favoritCity.includes(cityName) ?
                    <div>
                        <h3>in your favorites!</h3>
                        <button onClick={() => { remove(cityName) }}>Remove from favorites</button>
                    </div>
                    : <button className='add-button' onClick={add}>ADD TO FAVORITES</button>
                }
            </div>

            <div >
                {fiveDays ?
                    <div className='card-list'>{fiveDays.map(day => {
                        return <DayCard day={day} />
                    })}</div> : null}
            </div>
        </div>
    )
}
