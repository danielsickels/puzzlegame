class Player extends Phaser.GameObjects.Sprite {
  contructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);

    this.speed = 20;

    scene.add.existing(this);
  }

  move(up, left, down, right) {
    if (up.isDown) this.y -= this.speed;
    if (left.isDown) this.x += this.speed;
    if (down.isDown) this.y -= this.speed;
    if (right.isDown) this.x += this.speed;
  }
}

export default Player;
