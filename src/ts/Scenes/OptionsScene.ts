export default class OptionsScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "OptionsScene";

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

		this.add.text(leftSideSpacing, topSpacing, "Options").setFontFamily("monospace").setFontSize(20).setFill("#fff");

	}
}
