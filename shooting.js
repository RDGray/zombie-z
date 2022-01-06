import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Shooting {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;
    this.bulletSpeed = 10;
    this.bullets = [];
    this.bulletRadius = 2;
    this.maxBullets = 30;
  }
  fire() {
    //managing bullets outside of the screen
    if (this.bullets.length >= this.maxBullets) {
      let b = this.bullets.shift();
      this.app.stage.removeChild(b);
    }

    this.bullets.forEach((b) => this.app.stage.removeChild(b));
    this.bullets = this.bullets.filter(
      (b) =>
        Math.abs(b.position.x) < this.app.screen.width &&
        Math.abs(b.position.y) < this.app.screen.height
    );
    this.bullets.forEach((b) => this.app.stage.addChild(b));
    //end anaging bullets outside of the screen
    const bullet = new PIXI.Sprite( //bullet animation
      PIXI.Loader.shared.resources["bullet"].texture
    );
    bullet.anchor.set(0.5); //set the anchor to the center
    bullet.scale.set(0.2); //set the scale to 0.2
    bullet.position.set(this.player.position.x, this.player.position.y);
    bullet.rotation = this.player.rotation; // bullet rotation as the player rotation

    let angle = this.player.rotation - Math.PI / 2;

    bullet.velocity = new Victor(
      Math.cos(angle),
      Math.sin(angle)
    ).multiplyScalar(this.bulletSpeed);
    this.bullets.push(bullet);
    this.app.stage.addChild(bullet);
    console.log(this.bullets.length, this.app.stage.children.length);
  }
  set shoot(shooting) {
    if (shooting) {
      this.fire();
      this.interval = setInterval(() => this.fire(), 400); // interval on shooting while holding
    } else {
      clearInterval(this.interval);
    }
  }
  update(delta) {
    this.bullets.forEach((b) =>
      b.position.set(
        b.position.x + b.velocity.x * delta,
        b.position.y + b.velocity.y * delta
      )
    );
  }
}
