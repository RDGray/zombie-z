import * as PIXI from "pixi.js";

import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";

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
let zSpawner = new Spawner({ create: () => new Zombie({ app, player }) });

//enemy

//cursor and square movement
app.ticker.add((delta) => {
  player.update(); // calling the method from player.js
  zSpawner.spawns.forEach((zombie) => zombie.update());
});

//zombies spawn
