import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Score from "./Score.js";
import { User } from "./User.js";

//Variáveis
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const userNameInput = document.querySelector("#name");
const startButton = document.getElementById("start");
const optionsButton = document.getElementById("options");
const closeOptionsButton = document.getElementById("closeOptions");
const audioToggleButton = document.getElementById("option1");
const modoToggleButton = document.getElementById("option2");
const containers = document.querySelectorAll('.container');
const host = window.location.origin;

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function resizeCanvas() {
canvas.width = window.innerWidth * 1.7;
canvas.height = window.innerHeight * 1.7;

  if (!isMobileDevice()) {
    canvas.width = 1000;
    canvas.height = window.innerHeight;
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const background = new Image();
background.src = "images/space.png";

//Variáveis do jogo
let isAudioEnabled = true;
let isModoIfEnabled = true;
let isGameOver = false;
let didWin = false;

let playerBulletController = new BulletController(canvas, 1, "red", isAudioEnabled);
let enemyBulletController = new BulletController(canvas, 4, "white", isAudioEnabled);
let score = new Score();
let enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController, score, isAudioEnabled);
let player = new Player(canvas, 3, playerBulletController);
let user = new User();
let pontos = 0;

//Loop do jogo
function game() {
  checkGameOver();
  drawGame();
  
  if (!isGameOver) {
    requestAnimationFrame(game);
  }
}

function drawGame() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    score.draw(ctx);
  } else {
    displayGameOver();
    user.send();
  }
}

//Lógica do jogo
//Lógica do jogo
function displayGameOver() {
  const gameOverText = didWin ? "Você venceu" : "Você Perdeu";
  document.getElementById("textGameOver").innerText = gameOverText;
  score.draw(ctx, canvas.width / 5, canvas.height / 4);
  user.setScore(score.scoreNumber);
  toggleGameOverButtons(true);
  salvarPontuacaoRanking()
}

function toggleGameOverButtons(visible) {
  const action = visible ? 'remove' : 'add';
  document.getElementById("playAgainButton").classList[action]("hidden");
  document.getElementById("rankingButton").classList[action]("hidden");
  document.getElementById("textGameOver").classList[action]("hidden");
}

//Estado do controle do jogo
function resetGame() {
  playerBulletController = new BulletController(canvas, 1, "red", isAudioEnabled);
  enemyBulletController = new BulletController(canvas, 4, "white", isAudioEnabled);
  score = new Score();
  enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController, score, isAudioEnabled);
  player = new Player(canvas, 3, playerBulletController);
  
  isGameOver = false;
  didWin = false;
  toggleGameOverButtons(false);
}

function checkGameOver() {
  if (isGameOver) return;
  
  if (enemyBulletController.collideWith(player) || enemyController.collideWith(player)) {
    isGameOver = true;
  } else if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  } else {
    const allEnemiesPassed = enemyController.enemyRows.flat().every(enemy => enemy.y + enemy.height >= canvas.height);
    if (allEnemiesPassed) {
      isGameOver = true;
    }
  }
}

//Ativação do áudio e dos modos
//Ativação do áudio e dos modos
function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  updateAudioButton();
  
  playerBulletController.soundEnabled = isAudioEnabled;
  enemyBulletController.soundEnabled = isAudioEnabled;
  enemyController.setAudioEnabled(isAudioEnabled);
}

function updateAudioButton() {
  audioToggleButton.style.backgroundColor = isAudioEnabled ? "green" : "red";
  audioToggleButton.textContent = isAudioEnabled ? "Desativar áudio" : "Ativar áudio";
}

function toggleMode() {
  isModoIfEnabled = !isModoIfEnabled;
  updateModeButton();

  if (isModoIfEnabled) {
    localStorage.setItem("modo_game", "ifsp");
    modoToggleButton.style.backgroundColor = "green";
    modoToggleButton.textContent = "MODO IFSP";
  } else {
    localStorage.setItem("modo_game", "original");
    modoToggleButton.style.backgroundColor = "red";
    modoToggleButton.textContent = "MODO ORIGINAL";
  }
}

function updateModeButton() {
  modoToggleButton.style.backgroundColor = isModoIfEnabled ? "green" : "red";
  modoToggleButton.textContent = isModoIfEnabled ? "MODO IFSP" : "MODO ORIGINAL";
}

//Visibilidade do menu
function showOptionsMenu() {
  toggleElementVisibility("optionsMenu", true);
  toggleElementVisibility("form", false);
}

function hideOptionsMenu() {
  toggleElementVisibility("optionsMenu", false);
  toggleElementVisibility("form", true);
}

function toggleElementVisibility(elementId, visible) {
  const element = document.getElementById(elementId);
  element.classList[visible ? 'remove' : 'add']('hidden');
  element.classList[visible ? 'add' : 'remove']('container');
}


//Eventos
closeOptionsButton.addEventListener('click', hideOptionsMenu);
optionsButton.addEventListener('click', showOptionsMenu);
audioToggleButton.addEventListener('click', toggleAudio);
modoToggleButton.addEventListener('click', toggleMode);

startButton.addEventListener('click', async () => {
  document.querySelector("#error-msg").style.display = "none";
  const name = userNameInput.value;
    for (const element of rankingData) {
        if(element.name == name) {
            document.querySelector("#error-msg").style.display = "block";
            return;
        }
    }
  
  if (!name) {
    alert('Insira um nome');
    return;
  }
  
  if (name.length > 5) {
    alert('O nome só pode ter até 5 caracteres');
    return;
  }

  user.setName(name);
  resetGame();
  game();
  document.body.requestFullscreen();
  allHidden();
});

document.getElementById("playAgainButton").addEventListener('click', () => {
  if (isGameOver) {
    resetGame();
    game();
  }
});

//Funções utilitárias
function allHidden() {
  containers.forEach(container => container.classList.add("hidden"));
  ['paginaInicial', 'rodape1', 'rodape2', 'rodape3', 'logo', 'header'].forEach(className => {
    document.querySelector(`.${className}`).classList.add("hidden");
    canvas.classList.remove("hidden")
  });
}

async function salvarPontuacaoRanking() {
  const name = user.name;  // Corrigido para acessar a propriedade do objeto 'user'
  const scoreValue = score.scoreNumber;  // Corrigido para acessar o valor da pontuação

  const fetchResponse = await fetch('https://ranking.fabsoftware.itp.ifsp.edu.br/ranking', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: name, score: scoreValue, game: 'space'})
  });

  const data = await fetchResponse.json();
  createRankingList(data);
}
