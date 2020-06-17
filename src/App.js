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

    const [favorites, setFavorites] = useState([]) ///מכיל את פרטי הערים המועדפות
    const [favoritCity, setFavoritCity] = useState('') ///מכיל רק  את שמות הערים המועדפות
    const [fiveDays, setFiveDays] = useState() ///מכיל את פרטי מזג האוויר לחמישה ימים עבור העיר הנבחרת על ידי המשתמש במסך המועדפים. מערך זה עובר למסך הבית להצגה

    //פונקציה שמופעלת בעת לחיצה על לינק מן המועדפים למסך הבית
    //הפונקציה מעדכנת את מערך "חמישה ימים" בפרטים לפי העיר שנבחרה
    const setCurrentCity = (currentCity) => {
        setFiveDays(currentCity)
    }


    ///מערך שמכיל את שמות ימות השבוע בו נשמתמש בעת עדכון מערך "חמישה ימים" שלמעלה
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

    //פונקציה הקוראת לשרת חיצוני לקבלת פרטי מזג אוויר לפי מספר מזהה של עיר ספציפית
    //הפונקציב מעדכנת את מערך 5 ימים
    //הפונקציה יודעת לקבל שגיאות במידה והתקשורת עם השרת לא הצליחה
    const getForecast = (cityId, cityName) => {
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                setFiveDays([{
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
                ])
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('error!  Something wrong with calling a server, please choose a city')
            })
    }

    //convert F to c
    const toCelsius = (f) => {
        return (5 / 9) * (f - 32)
    }

    //פונקציה להוספת עיר ופרטי מזג אוויר למסף המועדפים
    //מקבלת עיר ופרטי מזג אוויר ליום הנוכחי
    //מעדכת את שני המערכים בסטייסט
    const addToFavorites = (fiveDays) => {
        setFavorites([...favorites, fiveDays[0]])
        setFavoritCity([...favoritCity, fiveDays[0].cityName])
    }



    //פונקציה להסרה של עיר ממסך המועדפים
    //מקבלת אינדקס ממסך הבית ומסירה את הערך לפי האינדקס משני המערכים בטייט
    const remove = (i) => {

        let temp = favorites
        let tempCitys = favoritCity
        temp.splice(i, 1)
        tempCitys.splice(i, 1)
        setFavorites(temp)
        setFavoritCity(tempCitys)
    }

    //פונקציה שמופעלת בעת לחיצה על עיר במסך המועדפים
    //מפעילה את הפונקציה גטפורקאסט 
    //לקבלת פרטי מזג האוויר לחמישה ימים ועדכון מסך הבית
    //כך שהמשתמש מקבל את מסך הבית עם פרטי העיר הנבחרת
    const linkToHome = (cityId, cityName) => {
        getForecast(cityId, cityName)
    }


    //לא כל כך הצלחתי להבין מה קרה פה
    //היה עדכון בויזואל סטודיו קוד ומאז לא הצלחתי לסדר את הקוד
    //הוא עובד! אבל אני לא הצלחתי לסדר את זה עד שעת ההגשה
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
        linkToHome = { linkToHome }
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