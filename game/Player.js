export default class Player {
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    this.gamma = 0;
    this.beta = 0;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "images/player.png";

    this.runShoot();
    this.setupControls();
  }

  isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  setupControls() {
    if (!this.isMobileDevice()) {
      window.addEventListener("keydown", (e) => {
        if (e.key === "a") {
          this.beta = -2.5;
        } else if (e.key === "d") {
          this.beta = 2.5;
        }
        this.move(this.beta);
      });

      window.addEventListener("keyup", (e) => {
        if (e.key === "a" || e.key === "d") {
          this.beta = 0;
        }
      });
      
    } else {
      window.addEventListener("deviceorientation", (e) => {
        switch (screen.orientation.type) {
          case "portrait-primary":
            this.gamma = e.gamma * 0.5;
            break;
          case "portrait-secondary":
            this.gamma = -(e.gamma * 0.5);
            break;
        }
        this.move(this.gamma);
      });
    }
  }

  runShoot() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.shootPressed = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.shootPressed = false;
      }
    });

    document.addEventListener("touchstart", () => {
      this.shootPressed = true;
    });

    document.addEventListener("touchend", () => {
      this.shootPressed = false;
    });
  }

  draw(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 25, 35.75);
    }
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWithWalls() {
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  move(axis) {
    this.x += axis * this.velocity;
    this.collideWithWalls();
  }
}
