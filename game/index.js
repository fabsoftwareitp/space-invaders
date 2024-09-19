import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Score from "./Score.js";
import PlayAgainButton from "./PlayAgainButton.js";
import { User } from "./User.js";
import { RankingButton } from "./RankingButton.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const userNameInput = document.querySelector("#name");
const start = document.getElementById("start");
const optionsButton = document.getElementById("options");
const optionsMenu = document.getElementById("optionsMenu");
const closeOptionsButton = document.getElementById("closeOptions");
const form = document.getElementById("form");
const option1Button = document.getElementById("option1");
const option2Button = document.getElementById("option2");
const aviso = document.querySelectorAll('.aviso');
const containers = document.querySelectorAll('.container');
const rodape = document.querySelector('.Rodape');
const logo = document.querySelector('.logo');
const header = document.querySelector('.header');
const host = window.location.origin;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = "images/space.png";

let isAudioEnabled = true;
let isModoIfEnabled = true;

let playerBulletController = new BulletController(canvas, 1, "red", true);
let enemyBulletController = new BulletController(canvas, 4, "white", true);
let score = new Score();
let enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  score,
  isAudioEnabled
);
let player = new Player(canvas, 3, playerBulletController);
let user = new User();
let playAgainButton = new PlayAgainButton(canvas);
let rankingButton = new RankingButton(canvas);

let isGameOver = false;
let didWin = false;

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();

  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    score.draw(ctx);
  }

  if (!isGameOver) {
    requestAnimationFrame(game);
  }
}

function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "Você Venceu" : "Você Perdeu";
    let textOffset = 5;

    ctx.fillStyle = "white";
    ctx.font = "48px 'Press Start 2P'";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    score.draw(ctx, canvas.width / textOffset, canvas.height / 4);
    playAgainButton.draw(ctx, "white");
    rankingButton.draw(ctx, "white");
    user.setScore(score.scoreNumber);
  }
}

function resetGame() {
  playerBulletController = new BulletController(canvas, 1, "red", isAudioEnabled);
  enemyBulletController = new BulletController(canvas, 4, "white", isAudioEnabled);
  score = new Score();
  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    score,
    isAudioEnabled
  );
  player = new Player(canvas, 3, playerBulletController);
  isGameOver = false;
  didWin = false;
  user.reset();
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(player) || enemyController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  }

  const allEnemiesPassed = enemyController.enemyRows.flat().every((enemy) => enemy.y + enemy.height >= canvas.height);

  if (allEnemiesPassed) {
    isGameOver = true;
  }
}

function stopGame() {
  isGameOver = true;
}

function showOptionsMenu() {
  optionsMenu.classList.remove("hidden");
  optionsMenu.classList.add("container");
  form.classList.add("hidden");
}

function hideOptionsMenu() {
  optionsMenu.classList.add("hidden");
  form.classList.remove("hidden");
}

function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;

  if (isAudioEnabled) {
    option1Button.style.backgroundColor = "green";
    option1Button.textContent = "Desativar áudio";
  } else {
    option1Button.style.backgroundColor = "red";
    option1Button.textContent = "Ativar áudio";
  }
  
  playerBulletController.soundEnabled = isAudioEnabled;
  enemyBulletController.soundEnabled = isAudioEnabled;
  enemyController.setAudioEnabled(isAudioEnabled);
}

function toggleMODOIFSP() {
  isModoIfEnabled = !isModoIfEnabled;

  if (isModoIfEnabled) {
    localStorage.setItem("modo_game", "ifsp");
    option2Button.style.backgroundColor = "green";
    option2Button.textContent = "MODO IFSP";
  } else {
    localStorage.setItem("modo_game", "original");
    option2Button.style.backgroundColor = "red";
    option2Button.textContent = "MODO ORIGINAL";
  }
}

function allHidden() {
  containers.forEach(container => {
    container.classList.add("hidden");
  });
  rodape.classList.add("hidden");
  logo.classList.add("hidden");
  header.classList.add("hidden");
}


closeOptionsButton.addEventListener('click', () => {
  hideOptionsMenu();
});

optionsButton.addEventListener('click', () => {
  showOptionsMenu();
});

option1Button.addEventListener('click', () => {
  toggleAudio();
});

option2Button.addEventListener('click', () => {
  toggleMODOIFSP();
});

start.addEventListener('click', async () => {
  let nameRepeat = false;
  const res = await fetch(`${host}/ranking`);
  const resJson = await res.json();

  if (resJson.find((player) => player.name == userNameInput.value)) {
    nameRepeat = true;
  }
  
  if (userNameInput.value === '') {
    alert('Insira um nome');
  } else if (userNameInput.value.length > 5) {
    alert('O nome só pode ter até 5 caracteres');
  } else if (nameRepeat) {
    window.alert("esse nome já existe");
  } else {
    user.setName(userNameInput.value);
    resetGame();
    game();
    document.body.requestFullscreen();
    allHidden();
  }
});

document.addEventListener("click", (e) => {
  if (playAgainButton.isClicked(e) && isGameOver) {
    resetGame();
    game();
  }

  if (rankingButton.isClicked(e) && isGameOver) {
    user.send();
    window.location.href = `${host}/ranking.html`;
  }
});

