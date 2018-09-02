export default class MainMenu extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainMenu";

	public preload(): void {
		this.load.path = "assets/";
		this.load.image("phaser_pixel_medium_flat");
	}

	public create(): void {
		window.console.log((new Date()).toISOString() + " : Entered MainMenu create()");

		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");
	}

	public update(): void {
	}
}
