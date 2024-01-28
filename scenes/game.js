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

class Puzzlehole extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.speed = 0;
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
    this.load.image("crosshole", "assets/crosshole.png");
    this.load.image("smolstonehole", "assets/smolstonehole.png");
    this.load.image("tombhole", "assets/tombhole.png");
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    // Create player
    this.player = new Player(this, 50, 350, "player");

    // Create Puzzlepieces array
    this.puzzlepieces = [
      new Puzzlepiece(this, 375, 250, "tombstone"),
      new Puzzlepiece(this, 350, 450, "smolstone"),
      new Puzzlepiece(this, 325, 350, "cross"),
    ];
    // Puzzleholes
    this.puzzlehole = [
      new Puzzlehole(this, 775, 250, "tombhole"),
      new Puzzlehole(this, 775, 450, "smolstonehole"),
      new Puzzlehole(this, 775, 350, "crosshole"),
    ];

    // Create invisible boundaries
    const { width, height } = this.sys.game.canvas;
    const thickness = 0.5;

    this.createBoundary(width / 2, -thickness / 2, width, thickness);
    this.createBoundary(width / 2, height + thickness / 2, width, thickness);
    this.createBoundary(-thickness / 2, height / 2, thickness, height);
    this.createBoundary(width + thickness / 2, height / 2, thickness, height);

    // Create background or tiles group
    this.backgroundGroup = this.physics.add.group();

    const tileWidth = 56; // Adjust as needed
    const tileHeight = 56; // Adjust as needed
    const horizontalSpacing = 10; // Adjust as needed
    const verticalSpacing = 10; // Adjust as needed

    // Calculate the number of tiles needed in both dimensions
    const numTilesX = Math.ceil(width / (tileWidth + horizontalSpacing));
    const numTilesY = Math.ceil(height / (tileHeight + verticalSpacing));

    // Add scenery assets to the background in a grid pattern
    for (let i = 0; i < numTilesX; i++) {
      for (let j = 0; j < numTilesY; j++) {
        const tileX = i * (tileWidth + horizontalSpacing) + tileWidth / 2;
        const tileY = j * (tileHeight + verticalSpacing) + tileHeight / 2;

        // Use random chance to decide if it's a grass or flower tile
        const isFlower = Phaser.Math.Between(1, 15) === 1; // 1 in 10 chance
        const tileKey = isFlower ? "flowers" : "grass";

        const tile = this.backgroundGroup.create(tileX, tileY, tileKey);

        // Set the depth of the background tiles
        if (tile && tile.setDepth) {
          tile.setDepth(-1);
        }
      }
    }

    // Detect overlaps without solid collisions
    this.physics.add.overlap(this.player, this.backgroundGroup);
    this.physics.add.overlap(this.puzzlepieces, this.backgroundGroup);
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
      if (
        this.physics.world.overlap(this.player, puzzlepiece, null, null, this)
      ) {
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
    this.physics.add.collider(this.puzzlepieces, boundary);
  }
}

const scene = new Game();
const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 700,
  scene: [scene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // No gravity for this example
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
