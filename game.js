import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  // Load assets like images and sprites here
}

function create() {
  // Set up initial game state here
}

function update() {
  // Update game logic here
}
