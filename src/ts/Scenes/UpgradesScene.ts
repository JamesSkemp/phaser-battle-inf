import MainGame from "./MainGame";
import Styling from "../Prefabs/Styling";
import Upgrades from "../Data/Upgrades";

export default class UpgradesScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "UpgradesScene";
	private mainGameScene: MainGame;
	private inventoryUpgradeText: Phaser.GameObjects.Text;
	private heroesUpgradeText: Phaser.GameObjects.Text;

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

		this.add.text(leftSideSpacing, topSpacing, "Upgrades").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		const buttonStyling = Styling.actionButtonStyling();

		let buttonNumber = 0;
		// Inventory space upgrade.
		const inventoryButton = this.add.text(leftSideSpacing + 25, topSpacing + 50 + 50 * buttonNumber, "Upgrade Inventory Space", buttonStyling);
		inventoryButton.setInteractive();
		inventoryButton.on("pointerdown", this.upgradeInventory, this);
		this.inventoryUpgradeText = this.add.text(leftSideSpacing + 25 + 25, topSpacing + 50 + 25 + 50 * buttonNumber, "");
		this.inventoryUpgradeText.setInteractive();
		this.inventoryUpgradeText.on("pointerdown", this.upgradeInventory, this);
		this.updateInventoryUpgradeText();
		buttonNumber++;

		// Heroes upgrade.
		const heroesButton = this.add.text(leftSideSpacing + 25, topSpacing + 50 + 100 * buttonNumber, "Upgrade Hero Count", buttonStyling);
		heroesButton.setInteractive();
		heroesButton.on("pointerdown", this.upgradeHeroes, this);
		this.heroesUpgradeText = this.add.text(leftSideSpacing + 25 + 25, topSpacing + 50 + 25 + 100 * buttonNumber, "");
		this.heroesUpgradeText.setInteractive();
		this.heroesUpgradeText.on("pointerdown", this.upgradeHeroes, this);
		this.updateHeroesUpgradeText();
		buttonNumber++;
	}

	private updateInventoryUpgradeText() {
		const upgrade = Upgrades.Options["Inventory Space"];
		const player = this.mainGameScene.player;
		this.inventoryUpgradeText.setText(upgrade.description + "\nCost: " + upgrade.nextValueCostFunction(player));
		this.inventoryUpgradeText.input.hitArea.setSize(this.inventoryUpgradeText.width, this.inventoryUpgradeText.width);
	}

	private updateHeroesUpgradeText() {
		const upgrade = Upgrades.Options.Heroes;
		const player = this.mainGameScene.player;
		this.heroesUpgradeText.setText(upgrade.description + "\nCost: " + upgrade.nextValueCostFunction(player));
		this.heroesUpgradeText.input.hitArea.setSize(this.heroesUpgradeText.width, this.heroesUpgradeText.width);
	}

	private upgradeInventory() {
		const upgrade = Upgrades.Options["Inventory Space"];
		const player = this.mainGameScene.player;
		if (upgrade.currentValue(player) < upgrade.maxValue && player.money >= upgrade.nextValueCostFunction(player)) {
			player.money -= upgrade.nextValueCostFunction(player);
			upgrade.upgradeFunction(player);
		}
		this.updateInventoryUpgradeText();
	}

	private upgradeHeroes() {
		const upgrade = Upgrades.Options.Heroes;
		const player = this.mainGameScene.player;
		if (upgrade.currentValue(player) < upgrade.maxValue && player.money >= upgrade.nextValueCostFunction(player)) {
			player.money -= upgrade.nextValueCostFunction(player);
			upgrade.upgradeFunction(player);
		}
		this.updateHeroesUpgradeText();
	}
}
