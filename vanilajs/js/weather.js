function onGeoOk(position){
    //console.log(position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const API_KEY = "91ab97e04261fc7d7bda5f6367db50ca";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&unit=metric`;
    
    //console.log(url);

    fetch(url).then(reponse => response.json()).then(data =>{console.log(data.name, data.weather[0].main)});//fetch는 url을 호출합니다.



}
function onGeoError(){
    alert("can't find you. No weather for you.");
}
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);  