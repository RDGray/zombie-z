import GameState from "./game-state";

export default class Spawner {
  constructor({ app, create }) {
    this.app = app;
    const spawnInterval = 700; //in ms
    this.maxSpawns = 30; // more zombies
    this.create = create;
    this.spawns = [];
    setInterval(() => this.spawn(), spawnInterval);
  }
  spawn() {
    if (this.app.gameState !== GameState.RUNNING) return; //game stopped + in index stop
    if (this.spawns.length >= this.maxSpawns) return;
    let s = this.create();
    this.spawns.push(s);
  }
}
