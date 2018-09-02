import MainMenu from "./MainMenu";

export default class Preloader extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "Preloader";

	public preload(): void {
		this.load.path = "assets/";

		this.load.image("phaser_pixel_medium_flat");
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered Preloader create()");

		this.scene.start(MainMenu.Name);
	}

	public update(): void {
	}
}
