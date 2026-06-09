function onGeoOk(position){
    //console.log(position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const API_KEY = "91ab97e04261fc7d7bda5f6367db50ca";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
    
    console.log(url);

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        const weather = document.querySelector("#weather .weather");
        const city = document.querySelector(".location");
        const minTemp = parseInt(data.main.temp_min);
        const maxTemp = parseInt(data.main.temp_max);
        city.innerText = `${data.name},
         최저 ${minTemp}°C, 최고 ${maxTemp}°C`;
        weather.innerHTML = `${data.weather[0].main}`; });
        
}

function onGeoError(){
    alert("위치를 알려주시면 날씨를 알려드릴게요.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);  