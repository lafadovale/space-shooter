const player = document.querySelector(".player");
const playArea = document.getElementById("play-area");
const aliensImg = ["img/alien1.png", "img/alien2.png", "img/alien3.png"];
const instructionsText = document.querySelector(".game-instructions");
const startButton = document.querySelector(".start-button");
let alienInterval;

function flyPlayer(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fire();
  }
}

function moveUp() {
  let topPosition = getComputedStyle(player).getPropertyValue("top");
  if (topPosition === "0px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    player.style.top = `${position}px`;
  }
}

function moveDown() {
  let topPosition = getComputedStyle(player).getPropertyValue("top");
  if (topPosition === "500px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 50;
    player.style.top = `${position}px`;
  }
}

function fire() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(player).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(player).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "img/shot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      if (checkShotCollision(laser, alien)) {
        alien.src = "img/blast.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
      }
    });

    if (xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

function createAliens() {
  let newAlien = document.createElement("img");
  let alienDraw = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienDraw;
  newAlien.classList.add("alien");
  newAlien.classList.add("alien-transition");
  newAlien.style.left = "370px";
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("left")
    );
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

function checkShotCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;

  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;

  if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if (laserTop <= alienTop && laserTop >= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

startButton.addEventListener("click", (event) => {
  startGame();
});

function startGame() {
  startButton.style.display = "none";
  instructionsText.style.display = "none";
  window.addEventListener("keydown", flyPlayer);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);
}

function gameOver() {
  window.removeEventListener("keydown", flyPlayer);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());
  let lasers = document.querySelectorAll(".laser");
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert("Game Over!");
    player.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}
