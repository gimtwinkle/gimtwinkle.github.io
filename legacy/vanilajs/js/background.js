const images = ["bg01.jpg","bg02.jpg","bg03.jpg","bg04.jpg","bg05.jpg"];
const chosenImage = images[Math.floor(Math.random() * images.length)];
const bgImage = document.createElement("img");
bgImage.classList.add('background');
bgImage.src = `./img/${chosenImage}`;

document.body.appendChild(bgImage);