import MainGame from "./MainGame";

export default class BattleScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "BattleScene";
	public sceneText: Phaser.GameObjects.Text;
	private mainGameScene: MainGame;
	private pointerStartY: number;
	private textStart: number = 0;

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

		this.add.text(leftSideSpacing, topSpacing, "Battle").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		this.sceneText = this.add.text(leftSideSpacing, topSpacing + 25, "");
		this.sceneText.setWordWrapWidth((this.cameras.main.width - leftSideSpacing) * 0.95);

		const mainGameScene = this.scene.get(MainGame.Name) as MainGame;
		this.sceneText.setText(mainGameScene.player.battleLog.join("\n"));

		this.input.on("pointerdown", (pointer) => {
			this.pointerStartY = pointer.y;
			if (pointer.x >= leftSideSpacing && pointer.y >= topSpacing) {
				this.input.stopPropagation();
			}
		}, this);
		this.input.on("pointerup", (pointer) => {
			if (this.pointerStartY < pointer.y) {
				this.panTextUp(100);
			} else if (this.pointerStartY > pointer.y) {
				this.panTextDown(100);
			}
		}, this);
	}

	public updateText(): void {
		const battleLog = this.mainGameScene.player.battleLog;
		const textToDisplay = battleLog.slice(this.textStart, 10);
		this.sceneText.setText(textToDisplay.join("\n"));
	}

	private panTextDown(amount: number) {
		const battleLog = this.mainGameScene.player.battleLog;
		this.textStart += 10;
		if (this.textStart > battleLog.length - 5) {
			this.textStart = battleLog.length - 10;
		}

		console.log("text down");
		console.log(battleLog.length);
		console.log(this.textStart);
		console.log(battleLog);
		const textToDisplay = battleLog.slice(this.textStart, 10);
		console.log(textToDisplay);
		this.sceneText.setText(textToDisplay.join("\n"));
	}

	private panTextUp(amount: number) {
		const battleLog = this.mainGameScene.player.battleLog;
		this.textStart -= 10;
		if (this.textStart < 0) {
			this.textStart = 0;
		}

		console.log("text up");
		console.log(this.textStart);
		console.log(battleLog);

		const textToDisplay = battleLog.slice(this.textStart, 10);
		console.log(textToDisplay);
		this.sceneText.setText(textToDisplay.join("\n"));
		//this.cameras.main.pan(this.cameras.main.centerX, this.cameras.main.centerY + amount);
	}
}
