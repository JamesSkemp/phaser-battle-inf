import MainGame from "./MainGame";

export default class BattleScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "BattleScene";
	public sceneText: Phaser.GameObjects.Text;
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

		this.add.text(leftSideSpacing, topSpacing, "Battle").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		this.sceneText = this.add.text(leftSideSpacing, topSpacing + 25, "");
		this.sceneText.setWordWrapWidth((this.cameras.main.width - leftSideSpacing) * 0.95);

		const mainGameScene = this.scene.get(MainGame.Name) as MainGame;
		this.sceneText.setText(mainGameScene.player.battleLog.join("\n"));

	}
}
