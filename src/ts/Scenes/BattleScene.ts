import MainGame from "./MainGame";

export default class BattleScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "BattleScene";
	public sceneText: Phaser.GameObjects.Text;
	private mainGameScene: MainGame;
	private textStart: number = 0;

	constructor(handle) {
		super(handle);
	}

	public create() {
		const leftSideSpacing = 125;
		const topSpacing = this.cameras.main.centerY;
		const thirdTabWidth = Math.floor((this.cameras.main.width - leftSideSpacing) / 3);

		const background = this.add.graphics();
		background.fillStyle(0x000000);
		background.fillRect(leftSideSpacing, topSpacing, this.cameras.main.width, this.cameras.main.height);

		this.mainGameScene = this.scene.get(MainGame.Name) as MainGame;

		this.add.text(leftSideSpacing, topSpacing, "Battle").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		const pageUpButton = this.add.text(Math.floor(thirdTabWidth * 2), topSpacing, "Page Up");
		pageUpButton.setInteractive();
		pageUpButton.on("pointerdown", this.pageTextUp, this);
		const pageDownButton = this.add.text(Math.floor(thirdTabWidth * 2.75), topSpacing, "Page Down");
		pageDownButton.setInteractive();
		pageDownButton.on("pointerdown", this.pageTextDown, this);

		this.sceneText = this.add.text(leftSideSpacing, topSpacing + 25, "");
		this.sceneText.setWordWrapWidth((this.cameras.main.width - leftSideSpacing) * 0.95);

		const mainGameScene = this.scene.get(MainGame.Name) as MainGame;
		this.sceneText.setText(mainGameScene.player.battleLog.join("\n"));
	}

	public updateText(): void {
		const battleLog = this.mainGameScene.player.battleLog;
		const lastIndex = this.textStart + 10 > battleLog.length ? battleLog.length : this.textStart + 10;
		const textToDisplay = battleLog.slice(this.textStart, lastIndex);
		this.sceneText.setText(textToDisplay.join("\n"));
	}

	private pageTextDown() {
		const battleLog = this.mainGameScene.player.battleLog;
		this.textStart += 10;
		if (this.textStart > battleLog.length) {
			this.textStart = battleLog.length - (battleLog.length % 10);
		}

		const textToDisplay = battleLog.slice(this.textStart, this.getLastBattleLogIndex());
		this.sceneText.setText(textToDisplay.join("\n"));
	}

	private pageTextUp() {
		const battleLog = this.mainGameScene.player.battleLog;
		this.textStart -= 10;
		if (this.textStart < 0) {
			this.textStart = 0;
		}

		const textToDisplay = battleLog.slice(this.textStart, this.getLastBattleLogIndex());
		this.sceneText.setText(textToDisplay.join("\n"));
	}

	/**
	 * Get the last index for a battle log slice based upon the current textStart and the length of the battle log.
	 */
	private getLastBattleLogIndex(): number {
		const battleLogLength = this.mainGameScene.player.battleLog.length;
		return this.textStart + 10 > battleLogLength ? battleLogLength : this.textStart + 10;
	}
}
