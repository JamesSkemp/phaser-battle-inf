import Player from "../Prefabs/Player";
import Utilities from "../Prefabs/Utilities";
import OptionsScene from "./OptionsScene";
import BattleScene from "./BattleScene";
import UpgradesScene from "./UpgradesScene";
import InventoryScene from "./InventoryScene";
import TownScene from "./TownScene";
import ShopScene from "./ShopScene";
import HeroDisplayScene from "./HeroDisplayScene";
import TrainingScene from "./TrainingScene";
import { compressToUTF16 as lzStringCompress } from "lz-string";
import { decompressFromUTF16 as lzStringDecompress } from "lz-string";

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
	public hero0Text: Phaser.GameObjects.Text;
	public hero1Text: Phaser.GameObjects.Text;
	public hero2Text: Phaser.GameObjects.Text;
	public hero3Text: Phaser.GameObjects.Text;
	public hero4Text: Phaser.GameObjects.Text;
	public hero5Text: Phaser.GameObjects.Text;
	public hero6Text: Phaser.GameObjects.Text;
	public hero7Text: Phaser.GameObjects.Text;
	public infoAreaText: Phaser.GameObjects.Text;
	// TODO remove?
	public monstersText: Phaser.GameObjects.Text;

	/**
	 * Scenes to be include as sub-UI within the game.
	 */
	private uiScenes = [BattleScene.Name, UpgradesScene.Name, InventoryScene.Name, TownScene.Name, ShopScene.Name, TrainingScene.Name, OptionsScene.Name, HeroDisplayScene.Name];
	private uiSceneRunning: string = "";

	public preload(): void {
		// TODO?
	}

	public create(): void {
		console.log((new Date()).toISOString() + " : Entered MainGame create()");

		this.player = new Player();
		this.loadPlayer();

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
			callback: this.doOneMinuteActivities,
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

		this.setupTopBar();
		this.setupHeroDisplay();
		this.setupButtons();
		this.setupInfoBox();
	}

	public update(): void {
		// TODO?
	}

	public savePlayer(): boolean {
		const savedPlayer: Player = Utilities.mergeObjects(new Player(), this.player);
		savedPlayer.prepareForSave();

		localStorage.setItem("save_player", lzStringCompress(JSON.stringify(savedPlayer)));
		console.log("Game saved");
		return true;
	}

	public loadPlayer(): boolean {
		let dataLoaded = false;
		this.player = new Player();

		const storageItem = localStorage.getItem("save_player");
		const saveDataString: Player = JSON.parse(
			storageItem === null
				? null
				: lzStringDecompress(localStorage.getItem("save_player"))
		);

		if (saveDataString !== null) {
			this.player.loadPlayer(saveDataString);
			dataLoaded = true;
		} else {
			// TODO ?
			this.player.addInitialLogMessages();
			this.player.initNewPlayer();
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

	private setupTopBar(): void {
		this.add.text(5, 0, "Battle INF: Phaser Edition")
		.setFontFamily("monospace").setFontSize(20).setFill("#fff");
		this.topBarText = this.add.text(10, 20, "")
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
		const heroTextStyling = { cursor: "help", fill: "#fff", fontSize: "14px", width: this.cameras.main.centerX - 25 };
		const heroRowHeight = 60;
		// First column of heroes.
		this.hero0Text = this.add.text(25, 50, " ", heroTextStyling);
		this.hero1Text = this.add.text(25, 50 + heroRowHeight, " ", heroTextStyling);
		this.hero2Text = this.add.text(25, 50 + (heroRowHeight * 2), " ", heroTextStyling);
		this.hero3Text = this.add.text(25, 50 + (heroRowHeight * 3), " ", heroTextStyling);
		// Second column of heroes.
		this.hero4Text = this.add.text(this.cameras.main.width / 2 + 25, 50, " ", heroTextStyling);
		this.hero5Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + heroRowHeight, " ", heroTextStyling);
		this.hero6Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + (heroRowHeight * 2), " ", heroTextStyling);
		this.hero7Text = this.add.text(this.cameras.main.width / 2 + 25, 50 + (heroRowHeight * 3), " ", heroTextStyling);

		for (let i = 0; i < 8; i++) {
			const textBox: Phaser.GameObjects.Text = this["hero" + i + "Text"];
			textBox.setInteractive();
			textBox.on("pointerdown", () => { this.viewHeroData(i); }, this);
		}

		this.updateHeroDisplay();
	}

	private updateHeroDisplay(): void {
		for (let i = 0; i < this.player.heroes.length; i++) {
			const hero = this.player.heroes[i];
			const heroText: Phaser.GameObjects.Text = this["hero" + i + "Text"];
			heroText.setText(hero.buildSimpleHeroDisplay()).setInteractive();
			// Update the hitArea after updating the text so they can be clicked.
			heroText.input.hitArea.setSize(this.cameras.main.width / 2 - 25, 60);

			if (hero.reserve || hero.trainingAreaIndex >= 0) {
				heroText.setFill("#999");
			}
		}
	}

	private viewHeroData(heroPosition: number) {
		if (this.player.heroes[heroPosition] !== null) {
			const sceneToStart = HeroDisplayScene.Name;
			const heroDisplay = this.sleepPreviousParallelScene(sceneToStart) as HeroDisplayScene;
			heroDisplay.updateDisplay(heroPosition);
		}
	}

	private setupButtons() {
		const startBattleButton = this.add.text(this.cameras.main.width - 10, 10, "Start Battle", { fill: "#fff" })
			.setOrigin(1, 0);
		startBattleButton.setInteractive();
		startBattleButton.on("pointerdown", () => { this.player.startBattle(); });

		const buttonStyling = { fill: "#fff" };

		let buttonNumber = 0;
		const battleButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Battle", buttonStyling);
		battleButton.setInteractive();
		battleButton.on("pointerdown", this.viewBattle, this);
		battleButton.setSize(100, 25);
		buttonNumber++;

		const upgradesButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Upgrades", buttonStyling);
		upgradesButton.setInteractive();
		upgradesButton.on("pointerdown", this.viewUpgrades, this);
		upgradesButton.setSize(100, 25);
		buttonNumber++;

		const inventoryButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Inventory", buttonStyling);
		inventoryButton.setInteractive();
		inventoryButton.on("pointerdown", this.viewInventory, this);
		inventoryButton.setSize(100, 25);
		buttonNumber++;

		const townButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Town", buttonStyling);
		townButton.setInteractive();
		townButton.on("pointerdown", this.viewTown, this);
		townButton.setSize(100, 25);
		buttonNumber++;

		const shopButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Shop", buttonStyling);
		shopButton.setInteractive();
		shopButton.on("pointerdown", this.viewShop, this);
		shopButton.setSize(100, 25);
		buttonNumber++;

		const trainingButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Training", buttonStyling);
		trainingButton.setInteractive();
		trainingButton.on("pointerdown", this.viewTraining, this);
		trainingButton.setSize(100, 25);
		buttonNumber++;

		const optionsButton = this.add.text(5, this.cameras.main.centerY + 30 * buttonNumber, "Options", buttonStyling);
		optionsButton.setInteractive();
		optionsButton.on("pointerdown", this.viewOptions, this);
		optionsButton.setSize(100, 25);
		buttonNumber++;
	}

	private viewBattle() {
		const sceneToStart = BattleScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewUpgrades() {
		const sceneToStart = UpgradesScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewInventory() {
		const sceneToStart = InventoryScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewTown() {
		const sceneToStart = TownScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewShop() {
		const sceneToStart = ShopScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewTraining() {
		const sceneToStart = TrainingScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private viewOptions() {
		const sceneToStart = OptionsScene.Name;
		this.infoAreaText.setText("");
		this.sleepPreviousParallelScene(sceneToStart);
	}

	private sleepPreviousParallelScene(sceneToStart: string): Phaser.Scene {
		if (this.uiSceneRunning !== sceneToStart) {
			// Make sure that we properly handle the initial state, when no scene is set as running yet.
			if (this.uiSceneRunning !== "") {
				this.scene.get(this.uiSceneRunning).scene.sleep();
			}
			const newScene = this.scene.get(sceneToStart);
			newScene.scene.start();
			this.scene.bringToTop(sceneToStart);
			this.uiSceneRunning = sceneToStart;

			return newScene;
		} else {
			return this.scene.get(this.uiSceneRunning);
		}
	}

	private setupInfoBox() {
		const leftSideSpacing = 125;
		this.infoAreaText = this.add.text(leftSideSpacing, this.cameras.main.centerY, "");
		this.infoAreaText.setWordWrapWidth((this.cameras.main.width - leftSideSpacing) * .9);

		for (const uiScene of this.uiScenes) {
			this.scene.launch(uiScene);
			this.scene.get(uiScene).scene.sleep();
		}

		//this.uiSceneRunning = BattleScene.Name;
		//this.scene.bringToTop(this.uiSceneRunning).resume();
		this.viewBattle();
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
		} else if (this.player.battle === null && !this.player.paused && this.player.endless) {
			this.player.startBattle();
		}

		this.updateTopBar();
		this.updateHeroDisplay();
	}

	/**
	 * Do anything that should be done once a minute.
	 */
	private doOneMinuteActivities(): void {
		console.log((new Date().toISOString()) +  " One minute activities running.");
		this.player.money += this.player.gpm;

		if (this.player.autoSave) {
			const dataSaved = this.savePlayer();
		}
	}

	/**
	 * Do anything that should be done once every five minutes.
	 */
	private doFiveMinuteActivities(): void {
		console.log((new Date().toISOString()) +  " Five minute activities running.");
	}
}
