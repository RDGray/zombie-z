import * as PIXI from "pixi.js";

import Player from "./player.js";
import Zombie from "./zombie.js";

//import Matter from "matter-js";

let canvasSize = 512;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

let player = new Player({ app });
let zombie = new Zombie({ app, player });

//enemy

//cursor and square movement
app.ticker.add((delta) => {
  player.update(); // calling the method from player.js
  zombie.update();
});

//zombies spawn
