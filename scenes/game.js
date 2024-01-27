import Player from "/objects/player.js";

this.screenSize = this.sys.scale.gameSize;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.preload.image("playerfront", "assets/playerfront.png");
  }

  create() {
    this.keys = this.input.keyboard.addKeys({
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    this.player = new Player(this, 50, 50, "player");

    this.player = new Player(
      this,
      this.screenSize.width / 2,
      this.screenSize.height / 2,
      "player"
    );

    this.text.setOrigin(0.5, 0.5); // The x and y position of the text is centered
    this.text.setColor("#FFFFFF");
    this.text.setFontSize(30);

    this.player.setDepth(1000);
  }

  update() {
    this.player.move(
      this.keys.UP,
      this.keys.LEFT,
      this.keys.DOWN,
      this.keys.RIGHT
    );

    if (this.keys.SPACE.isDown) {
      this.add.image(
        Math.random() * this.screenSize.width,
        Math.random() * this.screenSize.height,
        "player"
      );
    }
  }
}
