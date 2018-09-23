import MainGame from "./MainGame";

export default class HeroDisplayScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "HeroDisplayScene";
	public sceneText: Phaser.GameObjects.Text;

	public selectedHeroIndex: number = 0;
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

		this.add.text(leftSideSpacing, topSpacing, this.mainGameScene.player.heroes[this.selectedHeroIndex].name).setFontFamily("monospace").setFontSize(20).setFill("#fff");

		this.sceneText = this.add.text(leftSideSpacing, topSpacing + 25, "");
		this.sceneText.setWordWrapWidth((this.cameras.main.width - leftSideSpacing) * 0.95);

		this.updateDisplay(this.selectedHeroIndex);
	}

	public updateDisplay(heroIndex: number) {
		this.selectedHeroIndex = heroIndex;
		const hero = this.mainGameScene.player.heroes[this.selectedHeroIndex];

		let heroContent = hero.buildSimpleHeroDisplay();
		for (const equipment of hero.equipmentList) {
			// TODO fix item display
			heroContent += "\n" + equipment.display();
		}

		this.sceneText.setText(heroContent);
	}
}
