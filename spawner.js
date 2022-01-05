export default class Spawner {
  constructor({ app, create }) {
    this.app = app;
    const spawnInterval = 1000; //in ms
    this.maxSpawns = 20; // more zombies
    this.create = create;
    this.spawns = [];
    setInterval(() => this.spawn(), spawnInterval);
  }
  spawn() {
    if (this.app.gameStarted === false) return; //game stopped + in index stop
    if (this.spawns.length >= this.maxSpawns) return;
    let s = this.create();
    this.spawns.push(s);
  }
}
