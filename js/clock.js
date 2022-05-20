/****************************/
/****     날짜, 시간 JS    ****/
/****************************/

const clock = document.querySelector(".clock");
const caleandar = document.querySelector(".date");

function getClock() {
  const date = new Date();
  const years = String(date.getFullYear());
  const month = String(date.getMonth());
  const dates = String(date.getDate());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2,"0");
  caleandar.innerText = `${years}.${month}.${dates}`;
  clock.innerText = `${hours}:${minutes}:${seconds}`;
}

getClock();
setInterval(getClock, 1000);
