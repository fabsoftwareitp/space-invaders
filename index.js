const scoreEl = document.querySelector("#scoreEl");
const vlraclr = document.querySelector("#vlracelerometro");
const canvas = document.querySelector("canvas");
const div = document.querySelector("div");
const c = canvas.getContext("2d");
var aceler_gamma = 0;
var begingame = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.opacity = 1;

    const image = new Image();
    //declarar imagem
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.save();
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 4;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath;
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath;
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fades) this.opacity -= 0.01;
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    //declarar imagem
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(InvaderProjectiles) {
    InvaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: Math.random() * 2 + 1,
      y: 0,
    };

    this.invaders = [];

    this.maxColumns = Math.floor(canvas.width / 60);

    const columns = Math.floor(Math.random() * this.maxColumns + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
    console.log(this.invaders);
  }

  update() {
    (this.position.x += this.velocity.x), (this.position.y += this.velocity.y);

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30; //mudar 4
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [];
const InvaderProjectiles = [];
const particles = [];

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: false,
};
let score = 0;

for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 3,
      color: "white",
    })
  );
}

//controle acelerometro
function accelerometer(event) {
  vlraclr.innerHTML = event.gamma;
  aceler_gamma = event.gamma;
}
window.addEventListener("deviceorientation", accelerometer, true);

//detectar toque na tela
function endtouch() {
  if (!game.active && !begingame){
    begingame = true;
    div.requestFullscreen();
  }
}
document.querySelector("canvas").addEventListener("touchend", endtouch);

var firsttime = true;
function touchscreen() {
  if (game.over) return;
  if (!firsttime){
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y,
        },
        velocity: {
          x: 0,
          y: -10,
        },
      })
    );
  }
  firsttime = false;
}
document.querySelector("canvas").addEventListener("touchstart", touchscreen);

function createParticles({ object, colour, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: colour || "#BAA0DE",
        fades,
      })
    );
  }
}

function fillText(text, x, y, color, fontSize) {
  if (typeof color !== 'undefined') c.fillStyle = color;
  if (typeof fontSize !== 'undefined') c.font = fontSize + 'px Play';
  c.fillText(text, x, y);
}

function fillCenteredText(text, x, y, color, fontSize) {
  var metrics = c.measureText(text);
  fillText(text, x - metrics.width/2, y, color, fontSize);
}

function fillBlinkingText(text, x, y, blinkFreq, color, fontSize) {
  if (~~(0.5 + Date.now() / blinkFreq) % 2) {
    fillCenteredText(text, x, y, color, fontSize);
  }
}

function drawStartScreen() {
  c.fillText
  fillCenteredText("Space Invaders", canvas.width/2, canvas.height/2.75, '#FFFFFF', 36);
  fillBlinkingText("Toque na tela para começar!", canvas.width/2, canvas.height/2, 500, '#FFFFFF', 36);
}

var lastTime = 0;
function animate() {
  var now = window.performance.now();
  if (!game.active && begingame){
    game.active = true;
    begingame = false;
  }
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  if (game.active){
  player.update();
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  InvaderProjectiles.forEach((InvaderProjectile, index) => {
    if (
      InvaderProjectile.position.y + InvaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        InvaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      InvaderProjectile.update();
    }

    //projectile hits player
    if (
      InvaderProjectile.position.y + InvaderProjectile.height >=
        player.position.y &&
      InvaderProjectile.position.x + InvaderProjectile.width >=
        player.position.x &&
      InvaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        InvaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false;
      }, 2000);
      console.log("you lose");
      createParticles({
        object: player,
        colour: "white",
        fades: true,
      });
    }
  });

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        InvaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      if (!game.over && player.position != null) {
        if (grid.position.y >= player.position.y) {
          setTimeout(() => {
            player.opacity = 0;
            game.over = true;
          }, 0);
          setTimeout(() => {
            game.active = false;
          }, 2000);
          console.log("you lose");
          createParticles({
            object: player,
            colour: "white",
            fades: true,
          });
        }
      }
      // projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (invader.position.y != null) {
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
              );
              const projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
              );

              //remove invader and projectile
              if (invaderFound && projectileFound) {
                score += 100;
                scoreEl.innerHTML = score;
                createParticles({
                  object: invader,
                  fades: true,
                });

                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0];
                  const lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                } else {
                  grids.splice(gridIndex, 1);
                }
              }
            }, 0);
          }
        }
      });
    });
  });

  //velocidade e controles
  if (aceler_gamma < -5 && player.position.x >= 0) {
    player.velocity.x = -5;
    console.log(aceler_gamma);
  } else if (
    aceler_gamma > 5 &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
    console.log(aceler_gamma);
  } else {
    player.velocity.x = 0;
  }

  //spawning enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 1000 + 500);
    frames = 0;
    console.log(randomInterval);
  }

  frames++;
  }else{
    drawStartScreen();
  }
  lastTime = now;
  requestAnimationFrame(animate);
}

animate();
