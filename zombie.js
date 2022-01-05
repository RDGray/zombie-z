import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Zombie {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;

    const radius = 16;
    this.speed = 3;
    this.zombie = new PIXI.Graphics();
    let r = this.randomSpawnPoint();
    this.zombie.position.set(r.x, r.y);
    this.zombie.beginFill(0xff0000, 1);
    this.zombie.drawCircle(0, 0, radius);
    this.zombie.endFill();
    app.stage.addChild(this.zombie);
  }

  attackPlayer() {
    if (this.attacking) return;
    this.attacking = true;
    this.interval = setInterval(() => this.player.attack(), 200); // get to player and chip away the healthy
  }
  update() {
    //enemy movement
    let e = new Victor(this.zombie.position.x, this.zombie.position.y); // this.zombie
    let s = new Victor(this.player.position.x, this.player.position.y); // player
    //behaviour when this.zombie get to player
    if (e.distance(s) < this.player.width / 2) {
      this.attackPlayer();
      //let r = this.randomSpawnPoint();   random spawn after reaching player
      //this.zombie.position.set(r.x, r.y); random spawn after reaching player
      return;
    }

    let d = s.subtract(e); // marking  player and this.zombie position
    let v = d.normalize().multiplyScalar(this.speed); // normalize and multiply
    this.zombie.position.set(
      this.zombie.position.x + v.x,
      this.zombie.position.y + v.y
    );
  }

  //kill zombies
  kill() {
    this.app.stage.removeChild(this.zombie);
    clearInterval(this.interval);
    // we can put animation here for kill
  }

  get position() {
    return this.zombie.position;
  }

  randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4); //random int between 0 and 3 (inclusive)
    let spawnPoint = new Victor(0, 0); // x and y defined
    let canvasSize = this.app.screen.width;
    switch (edge) {
      case 0: //top
        spawnPoint.x = canvasSize * Math.random();
        break;
      case 1: //right
        spawnPoint.x = canvasSize;
        spawnPoint.y = canvasSize * Math.random();
        break;
      case 2: //bottom
        spawnPoint.x = canvasSize * Math.random();
        spawnPoint.y = canvasSize;
        break;
      default:
        spawnPoint.x = 0; // left
        spawnPoint.y = canvasSize * Math.random();
        break;
    }
    return spawnPoint;
  }
}
