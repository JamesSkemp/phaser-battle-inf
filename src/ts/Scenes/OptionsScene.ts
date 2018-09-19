import MainGame from "./MainGame";

export default class OptionsScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "OptionsScene";
	private mainGameScene: MainGame;

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

		this.mainGameScene = this.scene.get(MainGame.Name) as MainGame;

		this.add.text(leftSideSpacing, topSpacing, "Options").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		const buttonStyling = {
			fill: "#fff",
			fontFamily: "monospace",
			fontSize: "20px"
		};

		// Save button.
		const saveButton = this.add.text(leftSideSpacing + 25, topSpacing + 50, "Save the game", buttonStyling);
		saveButton.setInteractive();
		// TODO should be moved into the player?
		saveButton.on("pointerdown", () => { this.mainGameScene.savePlayer(); }, this);

		// Load button.
		const loadButton = this.add.text(leftSideSpacing + 25, topSpacing + 50 + 50, "Load the last save", buttonStyling);
		// TODO

		// Reset button.
		// TODO
	}
}
