const cityInput = document.querySelector('.city-input')
const searchBtn  = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const  notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-text')
const coditionTxt = document.querySelector('.condition-text')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemContainer = document.querySelector('.forecast-items-container')

const API_Key = "146d868752b7771578503ca295f4e7cc"



searchBtn.addEventListener('click', function(){
    if(cityInput.value.trim() != ''){
        //  console.log(cityInput.value)
        updateWeatherInfo(cityInput.value)
         cityInput.value = ''
         cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && cityInput.value.trim() != ''){
      //   console.log(cityInput.value)
         updateWeatherInfo(cityInput.value)
         cityInput.value = ''
         cityInput.blur()
    }
})

 async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${API_Key}&units=metric
`
 const response =  await fetch(apiUrl)
 return response.json()
}

function getWeatherIcon(id){
  if (id >= 200 &&  id < 232) return 'thunderstorm.svg'
  if (id >= 300 &&  id < 400) return 'drizzle.svg'
  if (id >= 500 &&  id < 600) return 'rain.svg'
  if (id >= 600 &&  id < 700) return 'snow.svg'
  if (id >= 700 &&  id < 800) return 'atmosphere.svg'
  if (id === 800) return 'clear.svg'
  if (id > 800 &&  id <= 804) return 'clouds.svg'
  return 'clouds.svg'
}

function getCurrentDate(){
  const currentDate = new Date();
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }
  return currentDate.toLocaleDateString('en-US', options)
}


async function updateWeatherInfo(city){
 const weatherData =  await getFetchData('weather', city)
 
 
 if(weatherData.cod != 200){
      showDisplaySection(notFoundSection)
      return
 }
 console.log(weatherData);

 const  {
     name: country,
     main: {temp, humidity},
     weather: [{id, main}],
     wind: {speed}
 } = weatherData

 countryTxt.textContent = country
 tempTxt.textContent = Math.round(temp) + '  °C'
 humidityValueTxt.textContent = humidity + "%"
 windValueTxt.textContent = speed + " M/s"
 coditionTxt.textContent = main

 currentDateTxt.textContent = getCurrentDate()
 weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`


 await updateForecastsInfo(city)
 showDisplaySection(weatherInfoSection)
}


async function  updateForecastsInfo(city){
  const forecastsData = await getFetchData('forecast', city)

  const timeToken = '12:00:00'
  const todayDate = new Date().toISOString().split('T')[0]

  forecastItemContainer.innerHTML = ''
  forecastsData.list.forEach(forecastWeather => {
   if(forecastWeather.dt_txt.includes(timeToken) &&  !forecastWeather.dt_txt.includes(todayDate)){
     updateForecastsItems(forecastWeather)
   }
    
  })
}

function updateForecastsItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt:date,
    weather: [{ id}],
    main: { temp }
  } = weatherData
  
  const dateTaken = new Date(date)
  const dateOption = {
    day: '2-digit',
    month: 'short'
  }
 const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

  const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date">${dateResult}</h5>
             <img src="assets/weather/${getWeatherIcon(id)}"  class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
         </div>
  `

  forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem )
}

function showDisplaySection(activeSection){
  [weatherInfoSection, notFoundSection, searchCitySection].forEach(section => {
    if (section === activeSection) {
      section.style.display = 'flex'
    } else {
      section.style.display = 'none'
    }
    
  })

}

setInterval(() => {
    let time_print = document.querySelector(".time-box")
    let time = new Date();
    let twoDigit = time.toLocaleTimeString()
    time_print.innerHTML = `${twoDigit}`;
    
}, 1000);
