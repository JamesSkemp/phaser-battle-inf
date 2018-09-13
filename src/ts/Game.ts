import Boot from "./Scenes/Boot";
import Preloader from "./Scenes/Preloader";
import MainMenu from "./Scenes/MainMenu";
import MainGame from "./Scenes/MainGame";
import SplashScreen from "./Scenes/SplashScreen";

const gameConfig: GameConfig = {
	width: 800,
	height: 600,
	type: Phaser.AUTO,
	parent: "content",
	title: "Phaser Battle INF, developed in Phaser 3 with TypeScript, NodeJS, and VS Code"
};

export default class Game extends Phaser.Game {
	constructor(config: GameConfig) {
		console.log((new Date()).toISOString() + " : Entered Game constructor()");

		super(config);

		this.scene.add(Boot.Name, Boot);
		this.scene.add(Preloader.Name, Preloader);
		this.scene.add(SplashScreen.Name, SplashScreen);
		this.scene.add(MainMenu.Name, MainMenu);
		this.scene.add(MainGame.Name, MainGame);
		this.scene.start(Boot.Name);
	}
}

/**
 * Workaround for inability to scale in Phaser 3.
 * From http://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
 */
function resize() {
	const canvas = document.querySelector("canvas");
	const width = window.innerWidth;
	const height = window.innerHeight;
	const wratio = width / height;
	const ratio = Number(gameConfig.width) / Number(gameConfig.height);
	if (wratio < ratio) {
		canvas.style.width = width + "px";
		canvas.style.height = (width / ratio) + "px";
	} else {
		canvas.style.width = (height * ratio) + "px";
		canvas.style.height = height + "px";
	}
}

window.onload = () => {
	const game = new Game(gameConfig);
	resize();
	window.addEventListener("resize", resize, true);
};
