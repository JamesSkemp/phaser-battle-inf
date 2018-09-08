import Player from "../Prefabs/Player";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainGame";

	public player: Player;

	public consoleText: Phaser.GameObjects.Text;

	public preload(): void {
		// TODO?
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");

		this.consoleText = this.add.text(50, 50, "");
		this.consoleText.setWordWrapWidth(this.cameras.main.width * .9);

		this.player = new Player();

		this.player.addInitialLogMessages();

		console.log(this.player);

		// Add a timer to check for automatic money.
		/*this.time.addEvent({
			// Run every sixty seconds.
			delay: 60000,
			callback: this.checkMoneyGeneration,
			callbackScope: this,
			loop: true
		});*/
	}

	public update(): void {
		this.consoleText.setText(this.player.battleLog.join("\n"));
	}
}
