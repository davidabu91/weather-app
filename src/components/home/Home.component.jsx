import React, { useState, useEffect } from 'react'
import './home.styles.css'
import DayCard from '../day-card/DayCard.component';

export default function Home({ addToFavorites, favoritCity, apiKey, fiveDays, setCurrentCity, remove }) {
    const [cityName, setCityName] = useState()
    const [cityId, setCityId] = useState()
    const [ShowForecastButton, setShowForecastButton] = useState(false)
    const [dropdown, setDropdown] = useState([])
    const [favoritCityHP, setFavoritCityHM] = useState(favoritCity)
    const [firstEntry, setFirstEntry] = useState(true)
    const DefaultSearch = { id: '215854', name: 'Tel Aviv' }



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


    //פונקצית השלמה אוטומטית לחיפוש עיר
    //הפונקציה מופעלת בעת שינוי באינפוט החיפוש ושולחת לשרת את הערך הנוכחי
    //הפונקציה אוספת מהתשובה את שמות הערים ואת המספר המזהה שלהם ומעדכנת בהתאם מערך
    //מערך אשר יוצג תחת האינפוט באלמנט שיציג בכל שינוי באינפוט את תוצאות החיפוש
    //במידה ויש בעיה בתקשורת עם השרת הפונקציה יודעת לקלבת שגיאות
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


    //פונקציה לקבלת פרטי מזג אוויר אשר פועלת בכל טעינה של הדף על מנת לקבל ולהציג את העיר תלאביב שהוגדרה כערך דיפולטיבי עבור מסך הבית
    //במידה והמשתמש עובר ממסך המועדפים למסך הבית, מאחר שזו לא הפעם הראשונה שנכנס, הוספנו תנאי
//אינקציה אחת היא האם יש ערכים במועדפים ו
//אינקציה שנייה ועדיפה היא ערך בוליאני שמשתנה ברנדור הראשון, אלא שלא הצלחתי לגרום לזה לעבוד
//אז למעשה אם משתמש עובר למסך המועדפים ללא הוספת עיר למועדפים, כאשר יחזור למסך הבית - תופעל קריאה לשרת מיותרת
    const defaultForecast = (id) => {
        if (favoritCity.length > 0) {
            return
        }
        if (firstEntry === false) {
            return
        }
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${DefaultSearch.id}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                let currentCity = [
                    {
                        cityName: DefaultSearch.name,
                        id: DefaultSearch.id,
                        dayName: weekday[d.getDay()],
                        temp: Math.round(toCelsius([response['DailyForecasts'][0]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][0]['Day']['IconPhrase']],
                        key: 0
                    },
                    {
                        dayName: weekday[d.getDay() + 1],
                        temp: Math.round(toCelsius([response['DailyForecasts'][1]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']],
                        key:1
                    },
                    {
                        dayName: weekday[d.getDay() + 2],
                        temp: Math.round(toCelsius([response['DailyForecasts'][2]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']],
                        key: 2
                    },
                    {
                        dayName: weekday[d.getDay() + 3],
                        temp: Math.round(toCelsius([response['DailyForecasts'][3]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][3]['Day']['IconPhrase']],
                        key: 3
                    },
                    {
                        dayName: weekday[d.getDay() + 4],
                        temp: Math.round(toCelsius([response['DailyForecasts'][4]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][4]['Day']['IconPhrase']],
                        key: 4
                    },
                ]
                setCurrentCity(currentCity)
                setCityName(DefaultSearch.name)
                setFirstEntry(false)
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong with calling a server, please choose a city')
            })
    }

    //קריאה לשרת לקבלת נתוני מזג אוויר עבור עיר נבחרת מתוצאות החיפוש
    //יש כאן כפילות בקוד משום שהפונקציה הזו כבר כתובה למעשה
    //הסיבה שבחרתי או נאלצתי להשתמש בה בכיתבה חדה היא שלא המצלחתי להפעיל את הפונקציה עם ערכים שונים 
    //פעם אחת ערכים דיפולטיביים ופעם אחת ערכים משתנים
    //(אני מניח שיש דרך טובה יותר לעשות את זה)
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
                        description: [response['DailyForecasts'][0]['Day']['IconPhrase']],
                        key: 0

                    },
                    {
                        dayName: weekday[d.getDay() + 1],
                        temp: Math.round(toCelsius([response['DailyForecasts'][1]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']],
                        key: 1
                    },
                    {
                        dayName: weekday[d.getDay() + 2],
                        temp: Math.round(toCelsius([response['DailyForecasts'][2]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][2]['Day']['IconPhrase']],
                        key: 2
                    },
                    {
                        dayName: weekday[d.getDay() + 3],
                        temp: Math.round(toCelsius([response['DailyForecasts'][3]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][3]['Day']['IconPhrase']],
                        key: 3
                    },
                    {
                        dayName: weekday[d.getDay() + 4],
                        temp: Math.round(toCelsius([response['DailyForecasts'][4]['Temperature']['Maximum']['Value']])),
                        description: [response['DailyForecasts'][4]['Day']['IconPhrase']],
                        key: 4
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

    const removeCityFromFavorites = () => {
        let temp = favoritCityHP
        for (let i = 0; i < favoritCityHP.length; i++) {
            if (fiveDays[0].cityName === favoritCityHP[i]) {
                temp.splice(i, 1)
                setFavoritCityHM(temp)
                remove(i)
                alert('remove')
            }
        }
    }

    const add = () => {
        for (let i = 0; i < favoritCityHP.length; i++) {
            if (cityName == favoritCityHP[i]) {
                alert('Already in favor')
                return
            }
        }
        setFavoritCityHM([...favoritCityHP, cityName])
        addToFavorites(fiveDays)
    }

    useEffect(defaultForecast, [])//הפעלה דיפולטיבית לקבלת תוצאות עבור תל אביב
    useEffect(() => { setCityName(favoritCity[0]) }, [])//עדכון ספציפי לערך משתנה אשר מחזיק בעיר הנוכחית בכל רנדור
    useEffect(() => { getAutoComplete(cityName) }, [cityName])//האזנה לשינוי בערך העיר הנוכחית כדי להפעיל את פונקצית השלמת מילות החיפוש


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
                        return <button className='button' onClick={chooseCity} id={city.id} name={city.name} key={city.id}>{city.name}</button>
                    })}
                </div>
            </div>
            <div>{fiveDays ? <div>
                <h2>{fiveDays[0].cityName}</h2>
                <h5>{`${fiveDays[0].temp} C`}</h5>
            </div>
                : null}
            </div>

{/* ניסיתי ליצור כאן דיב שמאפשר הוספה/הסרה של עיר מהמעודפים. בפועל בכפתורים עובדים אבל לאחר לחיצה על הסרה מהמועדפים הקומפוננט לא מתעדכן אלא רק בפעולה הבאה */}
            <div>
                {favoritCityHP.includes(cityName) ?
                    <div>
                        <h3>in your favorites!</h3>
                        <button onClick={removeCityFromFavorites}>Remove from favorites</button>
                    </div>
                    : <button className='add-button' onClick={add}>ADD TO FAVORITES</button>
                }
            </div>

            <div >
                {fiveDays ?
                    <div className='card-list'>{fiveDays.map(day => {
                        return <DayCard day={day} key={day.key}/>
                    })}</div> : null}
            </div>
        </div>
    )
}
