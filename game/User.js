export class User {
  name = '';
  score = 0;
  sended = false;

  constructor() {}

  setName(name) {
    this.name = name;  
  }

  setScore(score) {
    if (score > this.score) {
      this.score = score;
    }
  }

}