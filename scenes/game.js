class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = 300; // Adjust the speed as needed
  }

  move(cursors) {
    const body = this.body;
    const speed = this.speed;

    // Reset velocity before applying new velocity
    body.setVelocity(0, 0);

    let velocityX = 0;
    let velocityY = 0;

    if (cursors) {
      if (cursors.up.isDown) {
        velocityY = -speed;
        this.setTexture("playerback"); // Set texture to back-facing
      }
      if (cursors.left.isDown) {
        velocityX = -speed;
        this.setTexture("playerside"); // Set texture to side-facing
        this.setFlipX(false);
      }
      if (cursors.down.isDown) {
        velocityY = speed;
        this.setTexture("player"); // Set texture to front-facing
      }
      if (cursors.right.isDown) {
        velocityX = speed;
        this.setTexture("playerside");
        this.setFlipX(true); // Set texture to side-facing
      }

      // Normalize diagonal movement
      const magnitude = Math.sqrt(
        velocityX * velocityX + velocityY * velocityY
      );
      if (magnitude > 0) {
        velocityX /= magnitude;
        velocityY /= magnitude;
      }

      body.setVelocity(velocityX * speed, velocityY * speed);
    }
  }
}

class Puzzlepiece extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(false);
    this.speed = 0; // Puzzlepiece's initial speed
  }

  update(cursors) {
    const body = this.body;

    // Reset velocity before applying new velocity
    body.setVelocity(0, 0);

    let velocityX = 0;
    let velocityY = 0;

    if (cursors) {
      if (cursors.up.isDown) {
        velocityY = -this.speed; // Use this.speed instead of speed
      }
      if (cursors.left.isDown) {
        velocityX = -this.speed; // Use this.speed instead of speed
      }
      if (cursors.down.isDown) {
        velocityY = this.speed; // Use this.speed instead of speed
      }
      if (cursors.right.isDown) {
        velocityX = this.speed; // Use this.speed instead of speed
      }

      // Normalize diagonal movement
      const magnitude = Math.sqrt(
        velocityX * velocityX + velocityY * velocityY
      );
      if (magnitude > 0) {
        velocityX /= magnitude;
        velocityY /= magnitude;
      }

      body.setVelocity(velocityX * this.speed, velocityY * this.speed);
    }
  }
}

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.load.image("player", "assets/playerfront.png");
    this.load.image("playerside", "assets/playerside.png");
    this.load.image("playerback", "assets/playerback.png");
    this.load.image("cross", "assets/cross.png");
    this.load.image("flowers", "assets/flowers-tile.png");
    this.load.image("grass", "assets/Grass-tile.png");
    this.load.image("largestone", "assets/L-stone.png");
    this.load.image("medstone", "assets/m-stone.png");
    this.load.image("smolstone", "assets/s-stone.png");
    this.load.image("tombstone", "assets/tomb.png");
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    // Create player
    this.player = new Player(this, 50, 50, "player");

    // Create Puzzlepieces array
    this.puzzlepieces = [
      new Puzzlepiece(this, 200, 200, "tombstone"),
      new Puzzlepiece(this, 250, 300, "smolstone"),
    ];

    // Create invisible boundaries
    const { width, height } = this.sys.game.canvas;
    const thickness = 1;

    this.createBoundary(width / 2, -thickness / 2, width, thickness);
    this.createBoundary(width / 2, height + thickness / 2, width, thickness);
    this.createBoundary(-thickness / 2, height / 2, thickness, height);
    this.createBoundary(width + thickness / 2, height / 2, thickness, height);
  }

  update() {
    this.player.move(this.keys);

    for (const puzzlepiece of this.puzzlepieces) {
      puzzlepiece.update(this.keys);
    }

    this.handleCollisions();
  }

  handleCollisions() {
    // Player and Puzzlepieces collisions
    for (const puzzlepiece of this.puzzlepieces) {
      this.physics.world.collide(
        this.player,
        puzzlepiece,
        this.handlePuzzlepieceCollision,
        null,
        this
      );
    }

    // Check for overlap with each puzzlepiece separately
    let overlap = false;
    for (const puzzlepiece of this.puzzlepieces) {
      if (this.physics.world.overlap(this.player, puzzlepiece)) {
        overlap = true;
        break;
      }
    }

    if (!overlap) {
      this.player.speed = 300;
    }
  }

  handlePuzzlepieceCollision(player, puzzlepiece) {
    // Reduce player speed when colliding with the Puzzlepiece
    if (player.body.velocity.x !== 0 || player.body.velocity.y !== 0) {
      player.speed *= 0.5; // Reduce player speed to half
      player.move(this.keys); // Update player velocity based on the new speed
    }
  }

  createBoundary(x, y, width, height) {
    const boundary = this.physics.add
      .staticImage(x, y, "boundary")
      .setScale(width, height)
      .setAlpha(0); // Make the boundary invisible
    boundary.refreshBody();

    // Set up collider between player and boundary
    this.physics.add.collider(this.player, boundary);
  }
}

const scene = new Game();
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [scene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // No gravity for this example
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
