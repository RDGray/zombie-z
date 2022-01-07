import * as PIXI from "pixi.js";
import Victor from "victor";
import { zombies } from "./globals.js";

export default class Zombie {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;

    this.speed = 3;
    // this.zombie = new PIXI.Graphics(); // old zombie circle
    let r = this.randomSpawnPoint();
    let zombieName = zombies[Math.floor(Math.random() * zombies.length)]; // zombies random sprites
    this.speed = zombieName === "quickzee" ? 1 : 0.5; // quickzee zombie speed
    let sheet =
      PIXI.Loader.shared.resources[`assets/${zombieName}.json`].spritesheet; //loading the quickzee sprite
    this.die = new PIXI.AnimatedSprite(sheet.animations["die"]); // zombie die sprite
    this.attack = new PIXI.AnimatedSprite(sheet.animations["attack"]); // zombie attack sprite
    this.zombie = new PIXI.AnimatedSprite(sheet.animations["walk"]); // zombie walk sprite
    this.zombie.animationSpeed = zombieName === "quickzee" ? 0.2 : 0.1; // animation speed
    this.zombie.play(); // play animation
    this.zombie.anchor.set(0.5); // anchor
    this.zombie.position.set(r.x, r.y);

    app.stage.addChild(this.zombie);
    this.audio = new Audio("./assets/squelch.mp3");
  }

  attackPlayer() {
    if (this.attacking) return;
    this.attacking = true;
    this.interval = setInterval(() => this.player.attack(), 200); // get to player and chip away the healthy
    this.zombie.textures = this.attack.textures; // zombie attack animation
    this.zombie.animationSpeed = 0.1; // animation speed
    this.zombie.play();
  }
  update(delta) {
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
    let v = d.normalize().multiplyScalar(this.speed * delta); // normalize and multiply
    this.zombie.scale.x = v.x < 0 ? 1 : -1; // flip zombie sprite
    this.zombie.position.set(
      this.zombie.position.x + v.x,
      this.zombie.position.y + v.y
    );
  }

  //kill zombies // we can put animation here for kill
  kill() {
    // this.app.stage.removeChild(this.zombie); // zombie dissapear when killed
    this.audio.currentTime = 0;
    this.audio.volume = 0.2;
    this.audio.play(); //zombie die sound
    this.zombie.textures = this.die.textures; // zombie die animation
    this.zombie.loop = false; // stop die looping animation
    this.zombie.onComplete = () =>
      setTimeout(() => this.app.stage.removeChild(this.zombie), 30000); // remove zombie after 30 sec
    this.zombie.play(); // play die animation
    //this.zombie.zIndex = -1; // they must remain on the map, but they dissapear as soon as dead. added in player.js
    clearInterval(this.interval);
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
