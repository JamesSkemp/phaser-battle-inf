import MainGame from "./MainGame";

export default class TrainingScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "TrainingScene";
	private mainGameScene: MainGame;

	constructor(handle) {
		super(handle);
	}

	public create() {
		const leftSideSpacing = 125;
		const topSpacing = this.cameras.main.centerY;

		const background = this.add.graphics();
		background.fillStyle(0x000000);
		background.fillRect(leftSideSpacing, topSpacing, this.cameras.main.width, this.cameras.main.height);

		this.mainGameScene = this.scene.get(MainGame.Name) as MainGame;

		this.add.text(leftSideSpacing, topSpacing, "Training").setFontFamily("monospace").setFontSize(20).setFill("#fff");

	}
}
