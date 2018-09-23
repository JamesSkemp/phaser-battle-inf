import MainGame from "./MainGame";
import Styling from "../Prefabs/Styling";

export default class OptionsScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "OptionsScene";
	private mainGameScene: MainGame;
	private autoSaveStatusText: Phaser.GameObjects.Text;
	private autoBattleStatusText: Phaser.GameObjects.Text;

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

		this.add.text(leftSideSpacing, topSpacing, "Options").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		const buttonStyling = Styling.actionButtonStyling();

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

		// Auto-save toggle.
		const autoSaveToggleButton = this.add.text(leftSideSpacing + 25, topSpacing + 150, "Auto save (1 minute)", buttonStyling);
		autoSaveToggleButton.setInteractive();
		autoSaveToggleButton.on("pointerdown", this.toggleAutoSave, this);
		this.autoSaveStatusText = this.add.text(leftSideSpacing + 25 + 25, topSpacing + 150 + 25, (this.mainGameScene.player.autoSave ? "Enabled" : "Disabled"));

		// Auto-battle/endless mode toggle.
		const autoBattleToggleButton = this.add.text(leftSideSpacing + 25, topSpacing + 200, "Endless Mode (Auto-Battle)", buttonStyling);
		autoBattleToggleButton.setInteractive();
		autoBattleToggleButton.on("pointerdown", this.toggleAutoBattle, this);
		this.autoBattleStatusText = this.add.text(leftSideSpacing + 25 + 25, topSpacing + 200 + 25, (this.mainGameScene.player.endless ? "Enabled" : "Disabled"));
	}

	private toggleAutoSave() {
		this.mainGameScene.player.autoSave = !this.mainGameScene.player.autoSave;
		this.autoSaveStatusText.setText(this.mainGameScene.player.autoSave ? "Enabled" : "Disabled");
	}

	private toggleAutoBattle() {
		if (this.mainGameScene.player.unlock.endlessMode) {
			this.mainGameScene.player.endless = !this.mainGameScene.player.endless;
			this.autoBattleStatusText.setText(this.mainGameScene.player.endless ? "Enabled" : "Disabled");
		}
	}
}
