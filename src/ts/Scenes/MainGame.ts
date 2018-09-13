import Player from "../Prefabs/Player";
import Utilities from "../Prefabs/Utilities";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "MainGame";

	public player: Player;

	/**
	 * Text at the top of the display that shows information about current money, heroes, and land.
	 */
	public topBarText: Phaser.GameObjects.Text;
	public consoleText: Phaser.GameObjects.Text;
	public hero0Text: Phaser.GameObjects.Text;
	public hero1Text: Phaser.GameObjects.Text;
	public hero2Text: Phaser.GameObjects.Text;
	public hero3Text: Phaser.GameObjects.Text;
	public hero4Text: Phaser.GameObjects.Text;
	public hero5Text: Phaser.GameObjects.Text;
	public hero6Text: Phaser.GameObjects.Text;
	public hero7Text: Phaser.GameObjects.Text;
	public monstersText: Phaser.GameObjects.Text;

	public preload(): void {
		// TODO?
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.consoleText = this.add.text(50, this.cameras.main.centerY, "");
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
		// Add a timer that should run every minute.
		this.time.addEvent({
			delay: 60000,
			callback: this.doMinuteActivities,
			callbackScope: this,
			loop: true
		});

		this.time.addEvent({
			delay: 1000 * 60 * 5,
			callback: this.doFiveMinuteActivities,
			callbackScope: this,
			loop: true
		});

		// TODO remove this
		window["GamePlayer"] = this.player;

		const startBattleButton = this.add.text(this.cameras.main.width - 10, 10, "Start Battle", { fill: "#fff" })
			.setOrigin(1, 0);
		startBattleButton.setInteractive();
		startBattleButton.on("pointerdown", () => { this.player.startBattle(); console.log(this.player); });

		console.log(this.player.heroes);

		this.setupTopBar();
		this.setupHeroDisplay();
	}

	public update(): void {
		// TODO this needs to be moved elsewhere
		this.consoleText.setText(this.player.battleLog.join("\n"));
	}

	private setupTopBar(): void {
		this.add.text(0, 0, "Battle INF: Phaser Edition")
		.setFontFamily("monospace").setFontSize(20).setFill("#fff");
		this.topBarText = this.add.text(0, 20, "")
			.setFontFamily("monospace").setFontSize(16).setFill("#fff");
		this.updateTopBar();
	}

	private updateTopBar(): void {
		this.topBarText.setText("Money: " + Utilities.addNumberCommas(this.player.money) + " (" + this.player.gpm + "/min)"
			+ " Heroes: " + this.player.heroes.length + "/" + this.player.heroMax
			+ " Inventory: " + this.player.inventory.length + "/" + this.player.inventoryMax
			+ " Land: " + this.player.landUsed + "/" + this.player.landMax);
	}

	private setupHeroDisplay(): void {
		const heroTextStyling = { fill: "#fff", fontSize: "14px" };
		const heroRowHeight = 60;
		// First column of heroes.
		this.hero0Text = this.add.text(25, 50, "", heroTextStyling);
		this.hero1Text = this.add.text(25, 50 + heroRowHeight, "", heroTextStyling);
		this.hero2Text = this.add.text(25, 50 + (heroRowHeight * 2), "", heroTextStyling);
		this.hero3Text = this.add.text(25, 50 + (heroRowHeight * 3), "", heroTextStyling);
		// Second column of heroes.
		this.hero4Text = this.add.text(this.cameras.main.width / 2 + 25, 50, "", heroTextStyling);
		this.hero5Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + heroRowHeight, "", heroTextStyling);
		this.hero6Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + (heroRowHeight * 2), "", heroTextStyling);
		this.hero7Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + (heroRowHeight * 3), "", heroTextStyling);

		this.updateHeroDisplay();
	}

	private updateHeroDisplay(): void {
		for (let i = 0; i < this.player.heroes.length; i++) {
			const hero = this.player.heroes[i];
			this["hero" + i + "Text"].setText(hero.buildSimpleHeroDisplay());
			if (hero.reserve || hero.trainingAreaIndex >= 0) {
				this["hero" + i + "Text"].setFill("#999");
			}
		}
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

		this.updateTopBar();
		this.updateHeroDisplay();
	}

	/**
	 * Do anything that should be done once a minute.
	 */
	private doMinuteActivities(): void {
		console.log((new Date().toISOString()) +  " One minute activities running.");
		this.player.money += this.player.gpm;
	}

	/**
	 * Do anything that should be done once every five minutes.
	 */
	private doFiveMinuteActivities(): void {
		console.log((new Date().toISOString()) +  " Five minute activities running.");
		if (this.player.autoSave) {
			console.log("Data saved: " + this.savePlayer());
		}
	}

	private savePlayer(): boolean {
		const savedPlayer = Utilities.mergeObjects({}, this.player);
		savedPlayer.prepareForSave();

		localStorage.setItem("save_player", savedPlayer);
		return true;
	}

	private loadPlayer(): boolean {
		let dataLoaded = false;
		this.player = new Player();

		const saveDataString = localStorage.getItem('save_player');

		if (saveDataString !== null) {
			this.player = Utilities.mergeObjects(this.player, saveDataString);

			this.player.loadHeroes();
			dataLoaded = true;
		} else {
			// TODO
		}

		// Reset the shop refresh time each page load
		const date = new Date();
		this.player.lastShopRefreshTimestamp = date.getTime();

		if (this.player.lastTrainingCheckTimestamp === 0) {
			this.player.lastTrainingCheckTimestamp = date.getTime();
		}

		// TODO
		//updateShopRestockTimer();

		return dataLoaded;
	}
}
