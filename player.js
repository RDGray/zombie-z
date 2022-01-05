import * as PIXI from "pixi.js";
import Shooting from "./shooting";

export default class Player {
  constructor({ app }) {
    this.app = app;
    const playerWidth = 32;
    let sheet =
      PIXI.Loader.shared.resources["assets/hero_male.json"].spritesheet; // player animation
    this.player = new PIXI.AnimatedSprite(sheet.animations["idle"]); // player animation
    this.player.animationSpeed = 0.1; // player animation
    this.player.play(); // player animation
    //this.player = new PIXI.Sprite(PIXI.Texture.WHITE); //square as player
    this.player.anchor.set(0.5);
    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    // this.player.width = this.player.height = playerWidth; //square player props
    // this.player.tint = 0xea985d; //square player props

    app.stage.addChild(this.player);

    this.lastMouseButton = 0;
    this.shooting = new Shooting({ app, player: this });

    //Health bar
    this.maxHealth = 100;
    this.health = this.maxHealth;
    const margin = 16;
    const barHeight = 8;
    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(0xff0000);
    this.healthBar.initialWidth = app.screen.width - 2 * margin; // healthbar width
    this.healthBar.drawRect(
      margin,
      10, // app.screen.height - barHeight - margin / 2, to put healthbar bottom
      this.healthBar.initialWidth,
      barHeight
    );
    this.healthBar.endFill();
    this.healthBar.zIndex = 1;
    this.app.stage.sortableChildren = true;
    this.app.stage.addChild(this.healthBar);
  }

  //health lose
  attack() {
    this.health -= 1;
    this.healthBar.width =
      (this.health / this.maxHealth) * this.healthBar.initialWidth;
    if (this.health <= 0) {
      this.dead = true;
    }
  }

  get position() {
    return this.player.position;
  }
  get width() {
    return this.player.width;
  }

  update(delta) {
    if (this.dead) return; //if player is dead
    const mouse = this.app.renderer.plugins.interaction.mouse;
    const cursorPosition = mouse.global;
    let angle =
      Math.atan2(
        cursorPosition.y - this.player.position.y,
        cursorPosition.x - this.player.position.x
      ) +
      Math.PI / 2;
    this.player.rotation = angle;

    if (mouse.buttons !== this.lastMouseButton) {
      this.shooting.shoot = mouse.buttons !== 0;
      this.lastMouseButton = mouse.buttons;
    }
    this.shooting.update(delta); // frame rate delta for consistency
  }
}
