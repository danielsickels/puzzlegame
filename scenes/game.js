class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.speed = 5;
    scene.add.existing(this);
  }

  move(cursors) {
    if (cursors && cursors.up.isDown) this.y -= this.speed;
    if (cursors && cursors.left.isDown) this.x -= this.speed;
    if (cursors && cursors.down.isDown) this.y += this.speed;
    if (cursors && cursors.right.isDown) this.x += this.speed;
  }
}

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.load.image("playerfront", "assets/playerfront.png");
  }

  create() {
    // Use createCursorKeys() to create cursor keys
    this.keys = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, 50, 50, "playerfront");
  }

  update() {
    this.player.move(this.keys);
  }
}

const scene = new Game();
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [scene],
};

const game = new Phaser.Game(config);
