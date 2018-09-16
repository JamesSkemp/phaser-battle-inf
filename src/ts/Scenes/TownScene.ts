export default class TownScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "TownScene";

	constructor(handle) {
		super(handle);
		console.log(arguments);
	}

	public create() {
		const leftSideSpacing = 125;
		const topSpacing = this.cameras.main.centerY;

		const background = this.add.graphics();
		background.fillStyle(0x000000);
		background.fillRect(leftSideSpacing, topSpacing, this.cameras.main.width, this.cameras.main.height);

		this.add.text(leftSideSpacing, topSpacing, "Town").setFontFamily("monospace").setFontSize(20).setFill("#fff");

	}
}
