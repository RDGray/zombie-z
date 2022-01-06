import * as PIXI from "pixi.js";
import * as PARTICLES from "pixi-particles";
import { rain } from "./emitter-configs.js"; // from pixi particles website

export default class Weather {
  constructor({ app }) {
    //lightning
    this.lightningGap = { min: 9000, max: 29000 };
    this.app = app;
    this.createAudio();
    this.lightning = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.lightning.width = this.lightning.height = app.screen.width; //where it appears
    this.lightning.tint = 0xffffff; //color
    this.lightning.alpha = 0.8; //opacity
    this.flash();

    //rain
    const container = new PIXI.ParticleContainer();
    container.zIndex = 2;
    app.stage.addChild(container);
    const emitter = new PARTICLES.Emitter(
      container,
      [PIXI.Loader.shared.resources["rain"].texture],
      rain
    );
    let elapsed = Date.now();
    const update = function () {
      requestAnimationFrame(update);
      let now = Date.now();
      emitter.update((now - elapsed) * 0.001);
      elapsed = now;
    };
    emitter.emit = true;
    update();
  }
  createAudio() {
    this.thunder = new Audio("./assets/thunder.mp3");
    this.rain = new Audio("./assets/rain.mp3");
    //this.rain.loop = true; //loops sound rain. but it gliches and stops playing before loop
    this.rain.addEventListener("timeupdate", function () {
      if (this.currentTime > this.duration - 0.2) {
        this.currentTime = 0;
      } // resets the sound after it ends
    });
  }
  async flash() {
    await new Promise((res) =>
      setTimeout(
        res,
        this.lightningGap.min +
          (this.lightningGap.max - this.lightningGap.min) * Math.random()
      )
    );
    this.app.stage.addChild(this.lightning);
    if (this.sound) this.thunder.play();
    await new Promise((res) => setTimeout(res, 200)); // flash duration
    this.app.stage.removeChild(this.lightning);
    this.flash();
  }
  enableSound() {
    this.sound = true;
    this.rain.play();
  }
}
