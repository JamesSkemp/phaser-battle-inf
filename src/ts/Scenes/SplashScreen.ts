import MainMenu from "./MainMenu";

export default class SplashScreen extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "SplashScreen";

	public preload(): void {
		this.load.path = "assets/";
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered SplashScreen create()");

		const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "Battle INF: Phaser Edition")
			.setOrigin(0.5, 0)
			.setFontFamily("monospace").setFontSize(30).setFill("#fff");

		const poweredByText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 25, "Powered By");
		poweredByText.setOrigin(0.5, 0.5);
		poweredByText.setFontFamily("monospace").setFontSize(20).setFill("#fff");
		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");

		this.input.setDefaultCursor("pointer");
		this.input.on("pointerdown", this.loadMainMenu, this);

		this.time.addEvent({
			// Run after three seconds.
			delay: 3000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});
	}

	private loadMainMenu(): void {
		this.scene.start(MainMenu.Name);
	}
}
