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

		const phaserLogo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");
		phaserLogo.setInteractive();
		phaserLogo.on("pointerdown", this.loadMainMenu, this);

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
