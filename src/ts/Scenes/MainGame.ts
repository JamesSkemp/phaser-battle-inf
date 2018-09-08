import Player from "../Prefabs/Player";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainGame";

	public player: Player;

	public consoleText: Phaser.GameObjects.Text;

	public preload(): void {
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");

		this.consoleText = this.add.text(50, 50, "");
		this.consoleText.setWordWrapWidth(this.cameras.main.width * .9);

		this.player = new Player();

		this.player.addInitialLogMessages();

		console.log(this.player);
	}

	public update(): void {
		this.consoleText.setText(this.player.battleLog.join("\n"));
	}
}
