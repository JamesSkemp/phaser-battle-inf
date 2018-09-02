import MainGame from "./MainGame";

export default class MainMenu extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainMenu";

	public preload(): void {
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainMenu create()");

		this.scene.start(MainGame.Name);
	}

	public update(): void {
	}
}
