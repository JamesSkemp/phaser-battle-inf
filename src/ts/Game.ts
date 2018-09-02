import * as phaser from "phaser";
import MainMenuScene from "./Scenes/MainMenuScene";

const gameConfig: GameConfig = {
	width: 800,
	height: 600,
	type: Phaser.AUTO,
	parent: "content",
	title: "Battle INF developed in Phaser 3 with TypeScript, NodeJS, and VS Code"
};

export default class Game extends Phaser.Game {
	constructor(config: GameConfig) {
		console.log((new Date).toISOString() + ' : Entered Game constructor()');

		super(config);

		this.scene.add(MainMenuScene.Name, MainMenuScene);
		this.scene.start(MainMenuScene.Name);
	}
};

window.onload = () => {
	var game = new Game(gameConfig);
};