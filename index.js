"use strict";
import * as PIXI from "pixi.js";
//import Matter from "matter-js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";
import { textStyle, subTextStyle, zombies } from "./globals.js";
import Weather from "./weather.js";
import GameState from "./game-state.js";

//canvas
let canvasSize = 650; // to change game size
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize, // to change game size
  height: canvasSize, // to change game size
  // backgroundColor: bgTexture, //

  resolution: 2,
});
//fix resolution from scale
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//Add the canvas that Pixi automatically created for you to the HTML document
const texture = PIXI.Texture.from("assets/textures1.png");
const bgTexture = new PIXI.Sprite(texture);
app.stage.addChild(bgTexture);

//Music
const music = new Audio("./assets/e1m1.mp3");
music.volume = 0.1;
music.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  } // resets the sound after it ends
});

//Zombie Sounds
const zombieHorde = new Audio("./assets/horde.mp3");
zombieHorde.volume = 0.3; //adjust volume from 0 to 1 (0.1, 0.2 etc)
zombieHorde.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  } // resets the sound after it ends
});

initGame();

//loading assets
async function initGame() {
  app.gameState = GameState.PREINTRO; // games state
  try {
    console.log("Loading...."); // check if loading
    await loadAssets();
    console.log("Loaded"); // check if loaded
    //weather
    app.weather = new Weather({ app });

    let player = new Player({ app });
    let zSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player }),
    });

    //Game start Container
    let gamePreIntroScene = createScene("Horde", "Click to Continue");
    let gameStartScene = createScene("Horde", "Click to Start");
    let gameOverScene = createScene("", "YOU DIED");

    //cursor and square movement   // delta - frame rate
    app.ticker.add((delta) => {
      if (player.dead) app.gameState = GameState.GAMEOVER;
      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO;
      gameStartScene.visible = app.gameState === GameState.START; // delete the "Click to Start"
      gameOverScene.visible = app.gameState === GameState.GAMEOVER; // delete the "YOU DIED"

      switch (app.gameState) {
        case GameState.PREINTRO:
          player.scale = 2;
          break;
        case GameState.INTRO:
          player.scale -= 0.01;
          if (player.scale <= 1) app.gameState = GameState.START;
          break;
        case GameState.RUNNING:
          player.update(delta); // calling the method from player.js
          zSpawner.spawns.forEach((zombie) => zombie.update(delta));
          bulletHitTest({
            bullets: player.shooting.bullets,
            zombies: zSpawner.spawns,
            bulletRadius: 2,
            zombieRadius: 16,
          }); // change values radius in all the files and here
          break;
        default:
          break;
      }
    });
  } catch (error) {
    console.log(error.message);
    console.log("Load Failed");
  }
}

function bulletHitTest({ bullets, zombies, bulletRadius, zombieRadius }) {
  bullets.forEach((bullet) => {
    zombies.forEach((zombie, index) => {
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1); //removing a zombie
        zombie.kill();
      }
    });
  });
}

// Scene Container
function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();

  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle)); //can style it (in globals.js)
  text.x = app.screen.width / 2; // center
  text.y = 0; // top
  text.anchor.set(0.5, 0); // center on x, y

  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle)); //can style it (in globals.js)
  subText.x = app.screen.width / 2; // center
  subText.y = app.screen.height / 2; // top
  subText.anchor.set(0.5, 0); // center on x, y

  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text); //adding the text itself
  sceneContainer.addChild(subText); //adding the text itself
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    zombies.forEach((z) => {
      PIXI.Loader.shared.add(`assets/${z}.json`);
    }); // loaded all the json zombie files from assets folder
    PIXI.Loader.shared.add("assets/hero_male.json"); // pixi loader
    PIXI.Loader.shared.add("bullet", "assets/bullet.png"); //name, path
    PIXI.Loader.shared.add("rain", "assets/rain.png"); //rain, path

    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}
//game state transitions clicks
function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO; // transition to INTRO
      music.play(); // music
      app.weather.enableSound(); //weather
      break;
    case GameState.START:
      app.gameState = GameState.RUNNING; // transition to INTRO
      zombieHorde.play();
      break;

    default:
      break;
  }
}

document.addEventListener("click", clickHandler); // starting game when click on the screen

let soundOn = document.querySelector(".sound_on");
let soundOff = document.querySelector(".sound_off");

soundOn.onclick = () => {
  localStorage.mute = 1 - Number(localStorage.mute);
  console.log(`zz`);
  // this will result in `.mute` being either '0' or '1' (strings)
  // perform mute operation too, if a sound is currently playing, if you want
};
