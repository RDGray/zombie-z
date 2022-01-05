import * as PIXI from "pixi.js";
//import Matter from "matter-js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";

let canvasSize = 600; // to change game size
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize, // to change game size
  height: canvasSize, // to change game size
  backgroundColor: 0x5c812f,
});

let player = new Player({ app });
let zSpawner = new Spawner({ app, create: () => new Zombie({ app, player }) });

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

//cursor and square movement
app.ticker.add((delta) => {
  // delta - frame rate
  gameStartScene.visible = !app.gameStarted; // delete the "Click to Start"
  gameOverScene.visible = player.dead; // delete the "YOU DIED"
  if (app.gameStarted === false) return; //game stopped + in spwaner stop
  player.update(); // calling the method from player.js
  zSpawner.spawns.forEach((zombie) => zombie.update());
  bulletHitTest({
    bullets: player.shooting.bullets,
    zombies: zSpawner.spawns,
    bulletRadius: 8,
    zombieRadius: 16,
  }); // change values radius in all the files and here
});

//Game start Container
let gameStartScene = createScene("Click to Start");
let gameOverScene = createScene("YOU DIED");
app.gameStarted = false;

// Scene Container
function createScene(sceneText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText); //can style it
  text.x = app.screen.width / 2; // center
  text.y = app.screen.height / 2; // top
  text.anchor.set(0.5, 0); // center on x, y
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text); //adding the text itself
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

function startGame() {
  app.gameStarted = true;
}

document.addEventListener("click", startGame); // starting game when click on the screen
