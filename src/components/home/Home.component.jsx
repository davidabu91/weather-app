import React, { useState, useEffect } from 'react'
import './home.styles.css'
import DayCard from '../day-card/DayCard.component';

export default function Home({
    currentCity,
    getForecast,
    favoritCity,
    apiKey,
    fiveDays,
    getCurrentCity,
    addOrRemoveItem
}) {
    const [searchQuery, setSearchQuery] = useState()
    const [dropdown, setDropdown] = useState([])
    const DefaultSearch = { id: '215854', name: 'Tel Aviv' }




    const hendleCity = (e) => {
        let letters = /^[A-Za-z ]+$/;
        if (e.target.value.match(letters)) {
            setSearchQuery(e.target.value)
            return
        }
    }



    //פונקצית השלמה אוטומטית לחיפוש עיר
    //הפונקציה מופעלת בעת שינוי באינפוט החיפוש ושולחת לשרת את הערך הנוכחי
    //הפונקציה אוספת מהתשובה את שמות הערים ואת המספר המזהה שלהם ומעדכנת בהתאם מערך
    //מערך אשר יוצג תחת האינפוט באלמנט שיציג בכל שינוי באינפוט את תוצאות החיפוש
    //במידה ויש בעיה בתקשורת עם השרת הפונקציה יודעת לקלבת שגיאות
    const getAutoComplete = () => {
        if (searchQuery === '') {
            return
        }
        fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${searchQuery}`)
            .then(response => response.json())
            .then(response => {
                let citys = [];
                let city = {};
                for (let i = 0; i < response.length; i++) {
                    city = {
                        name: response[i].LocalizedName,
                        id: response[i].Key,
                        country: response[i].Country.LocalizedName
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


    //פונקציה אשר מופעלת באופן דיפולטיבי בעת כניסה ראשונה לאתר
    //מפעילה 2 פונקציות המבקשות מהשרת פרטי מזג אוויר 
    //פונקציה אחת מביאה פרטים נוכחיים
    //פונקציה שנייה מביאה פרטים לחמישה ימים הבאים
    //להפעלת הפונקציה יש תנאי שבעזרתם אני מוודא שאכן זו הפעם הראשונה שמשתמש נכנס
    const defaultFunction = () => {
        if (favoritCity.length > 0) {
            return
        }
        getCurrentCity(DefaultSearch.id, DefaultSearch.name)
        getForecast(DefaultSearch.id, DefaultSearch.name)
    }

//פונקציה לבחירת עיר מתוך הצעות החיפוש עבור פרטי מזג אוויר
//בנוסף - הפונקציה מאפסת את האלמנט אשר מציג את תוצאות החיפוש
    const chooseCity = (e) => {
        getCurrentCity(e.target.id, e.target.name)
        getForecast(e.target.id, e.target.name)
        setDropdown([])
    }

 

    useEffect(defaultFunction, [])//הפעלה דיפולטיבית לקבלת תוצאות עבור תל אביב
    useEffect(getAutoComplete, [searchQuery])//האזנה לשינוי בשדה החיפוש כדי להפעיל את פונקצית השלמת מילות החיפוש

    let dropdownDiv;
    if (dropdown.length) {
        dropdownDiv = <div>
            {dropdown.map(city => (
                <div key={city.id}>
                    <a href='#' className='a' onClick={chooseCity} id={city.id} name={city.name} >
                        {city.name}({city.country.toLowerCase()})
                         </a>
                </div>
            ))}
        </div>
    }

    let addOrRemoveButten = 'Add to favorites'
    if (favoritCity) {
        if (favoritCity.find(favorit => favorit === currentCity.name)) {
            addOrRemoveButten = 'Remove from favorites '
        }
    }
    

    return (
        <div className='container'>
            <h1>WEATHER APP</h1>
            <div>
                <div className='button-container'>
                    <input
                        type="text"
                        onChange={hendleCity}
                        placeholder='Search...'
                    />
                    {dropdownDiv}
                </div>
            </div>
            <div>{currentCity ? <div>
                <h2>{currentCity.name}</h2>
                <h5>{`${currentCity.temp} C`}</h5>
                <button className='add-button' onClick={addOrRemoveItem}>{addOrRemoveButten}</button>

            </div>
                : null}
            </div>


            <div >
                {fiveDays ?
                    <div className='card-list'>{fiveDays.map(day => {
                        return <DayCard day={day} key={day.key} />
                    })}</div> : null}
            </div>

        </div>
    )
}
