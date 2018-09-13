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

		// Add a main timer that runs every second.
		this.time.addEvent({
			delay: 1000,
			callback: this.activityCheck,
			callbackScope: this,
			loop: true
		});
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

		this.heroesText = this.add.text(this.cameras.main.width / 4 + 25, this.cameras.main.height / 5 * 2, "", { fill: "#fff", fontSize: "14px" });

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

	private activityCheck(): void {
		if (this.player.battle !== null && !this.player.paused) {
			this.player.battle.nextTurn();
			if (this.player.battle.done) {
				this.player.battleDone();
				this.player.updateHeroStats();

				this.player.battle = null;

				if (!this.player.unlock.equip) {
					this.player.unlock.equip = true;
					this.player.log("\n");
					this.player.log("You just fought your first opponent! Your hero gained one experience and progress toward increasing its stats.");
					this.player.log("Your heroes will always start fresh with each new battle. You don't need to worry about restoring HP or removing status effects.");
					this.player.log("You now have access to your hero's equipment. Go check it out.");
				}
			}
		}
	}
}
