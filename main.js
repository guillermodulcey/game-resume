import { GameScene } from './GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
