import Preloader from "./Preloader";

export default class Boot extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "Boot";

	public preload(): void {
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered Boot create()");

		this.scene.start(Preloader.Name);
	}
}
