export default class PlayAgainButton {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 3 - 125;
    this.y = canvas.height / 2 + 50;
    this.w = 250;
    this.h = 50;
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "black";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("Jogar Novamente", this.x + 5, this.y + 32);
  }

  isClicked(evt) {
    let pos = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY,
    };

    if (
      pos.x > this.x + 20 &&
      pos.x < this.x + this.w &&
      pos.y > this.y &&
      pos.y < this.y + this.h 
    ) {
      return true;
    }
    return false;
  }
}
