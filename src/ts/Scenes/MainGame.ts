import Player from "../Prefabs/Player";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainGame";

	public player: Player;

	public consoleText: Phaser.GameObjects.Text;
	public heroesText: Phaser.GameObjects.Text;
	public monstersText: Phaser.GameObjects.Text;

	public preload(): void {
		// TODO?
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.consoleText = this.add.text(50, 50, "");
		this.consoleText.setWordWrapWidth(this.cameras.main.width * .9);

		this.player = new Player();

		this.player.addInitialLogMessages();

		this.player.initNewPlayer();

		console.log(this.player);

		// Add a timer to check for automatic money.
		/*this.time.addEvent({
			// Run every sixty seconds.
			delay: 60000,
			callback: this.checkMoneyGeneration,
			callbackScope: this,
			loop: true
		});*/

		// TODO remove this
		window["GamePlayer"] = this.player;

		const startBattleButton = this.add.text(25, this.cameras.main.height - 25, "Start Battle", { fill: "#fff" });
		startBattleButton.setInteractive();
		startBattleButton.on("pointerdown", () => { this.player.startBattle(); console.log(this.player); });

		console.log(startBattleButton.style.fontSize);

		this.heroesText = this.add.text(this.cameras.main.width / 4 + 25, this.cameras.main.height / 4 * 3, "", { fill: "#fff", fontSize: "14px" });

		console.log(this.player.heroes);
	}

	public update(): void {
		// TODO this needs to be moved elsewhere
		this.consoleText.setText(this.player.battleLog.join("\n"));

		let heroesData = "";
		for (const hero of this.player.heroes) {
			heroesData += hero.buildSimpleHeroDisplay();
		}
		this.heroesText.setText(heroesData);
	}
}
