export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainGame";

	public preload(): void {
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");
	}

	public update(): void {
	}
}
