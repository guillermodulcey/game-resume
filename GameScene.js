// Player class
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // Add the player sprite to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.lastDirection = 'right';

    // Create animations for the character's movements
    scene.anims.create({
      key: 'left_m',
      frames: scene.anims.generateFrameNumbers('character', {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    scene.anims.create({
      key: 'turn',
      frames: [{ key: 'character', frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: 'right_m',
      frames: scene.anims.generateFrameNumbers('character', {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create the "idle" animation using the manually defined sequence of frames
    scene.anims.create({
      key: 'right',
      frames: [{ key: 'character', frame: 5 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: 'left',
      frames: [{ key: 'character', frame: 0 }],
      frameRate: 20,
    });
  }

  update(cursors) {
    // Default velocities (assume player is not moving)
    let velocityX = 0;
    let velocityY = 0;
    // Default animation (assume player is idle)
    let animation = this.lastDirection === 'left' ? 'left' : 'right';

    // Update velocities and animations based on arrow key input
    if (cursors.up.isDown) {
      velocityY = -160;
      // Determine the frame for moving upwards based on the last direction
      const upwardFrame = this.lastDirection === 'left' ? 1 : 6;
      this.setTexture('character', upwardFrame);
    } else if (cursors.down.isDown) {
      velocityY = 160;
      // Determine the frame for moving downwards based on the last direction
      const downwardFrame = this.lastDirection === 'left' ? 1 : 6;
      this.setTexture('character', downwardFrame);
    }

    if (cursors.left.isDown) {
      velocityX = -160;
      animation = 'left_m';
      this.lastDirection = 'left'; // Update the last direction
    } else if (cursors.right.isDown) {
      velocityX = 160;
      animation = 'right_m';
      this.lastDirection = 'right'; // Update the last direction
    }

    // Play the appropriate idle frame based on the last direction
    if (velocityX === 0 && velocityY === 0) {
      // Determine the idle frame based on the last direction
      const idleFrame = this.lastDirection === 'left' ? 0 : 5;
      this.setTexture('character', idleFrame);
    }

    // Set player velocities and play animation
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    this.anims.play(animation, true);
  }
}

// NPC class
class Npc extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setImmovable(true);
  }
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('town', 'https://labs.phaser.io/assets/skies/sky4.png'); // Placeholder image for the town

    this.load.image(
      'fitideas',
      'https://raw.githubusercontent.com/guillermodulcey/game-resume/main/assets_local/fit.png'
    ); // Placeholder image for the NPC

    this.load.image(
      'open',
      'https://raw.githubusercontent.com/guillermodulcey/game-resume/main/assets_local/open.png'
    ); // Placeholder image for the NPC

    this.load.image(
      'turing',
      'https://raw.githubusercontent.com/guillermodulcey/game-resume/main/assets_local/turing.png'
    ); // Placeholder image for the NPC

    this.load.spritesheet(
      'character',
      'https://labs.phaser.io/assets/sprites/dude.png',
      {
        frameWidth: 32,
        frameHeight: 48,
      }
    ); // Placeholder spritesheet for the character
  }

  create() {
    // Create the town background
    this.add.image(400, 300, 'town');

    this.messageText_fit = this.add.text(300, 100, 'Feb 2022 - Aug 2022', {
      fontSize: '32px',
      fill: '#000',
    });

    this.messageText_open = this.add.text(300, 100, 'Mar 2018 - Jul 2019', {
      fontSize: '32px',
      fill: '#000',
    });

    this.messageText_turing = this.add.text(300, 100, 'Ago 2022 - Currently', {
      fontSize: '32px',
      fill: '#000',
    });

    this.player = new Player(this, 100, 450, 'character');
    this.player.setDepth(3);

    this.npc_open = new Npc(this, 100, 300, 'open');

    this.npc_fit = new Npc(this, 400, 300, 'fitideas');

    this.npc_turing = new Npc(this, 700, 300, 'turing');

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.update(this.cursors);

    // Code snippet to be placed inside the 'update' function

    let distance_fit = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.npc_fit.x,
      this.npc_fit.y
    );

    let distance_open = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.npc_open.x,
      this.npc_open.y
    );

    let distance_turing = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.npc_turing.x,
      this.npc_turing.y
    );

    // Determine whether the player is close enough to the NPC
    const threshold = 100; // Set an arbitrary threshold for "close enough"

    this.messageText_fit.visible = distance_fit <= threshold;
    this.messageText_open.visible = distance_open <= threshold;
    this.messageText_turing.visible = distance_turing <= threshold;
  }
}
