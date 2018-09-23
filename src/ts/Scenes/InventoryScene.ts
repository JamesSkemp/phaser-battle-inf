import MainGame from "./MainGame";
import Item from "../Prefabs/Item";
import Stats from "../Prefabs/Stats";
import Utilities from "../Prefabs/Utilities";

export default class InventoryScene extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name: string = "InventoryScene";
	private mainGameScene: MainGame;
	private leftSideSpacing = 125;
	private currentPage = 0;
	private previousButton: Phaser.GameObjects.Text;
	private currentPageText: Phaser.GameObjects.Text;
	private nextButton: Phaser.GameObjects.Text;
	private inventorySlot0Text: Phaser.GameObjects.Text;
	private inventorySlot1Text: Phaser.GameObjects.Text;
	private inventorySlot2Text: Phaser.GameObjects.Text;
	private inventorySlot3Text: Phaser.GameObjects.Text;
	private inventorySlot4Text: Phaser.GameObjects.Text;
	private inventorySlot5Text: Phaser.GameObjects.Text;
	private inventorySlot6Text: Phaser.GameObjects.Text;
	private inventorySlot7Text: Phaser.GameObjects.Text;
	private inventorySlot8Text: Phaser.GameObjects.Text;
	private inventorySlot9Text: Phaser.GameObjects.Text;

	constructor(handle) {
		super(handle);
	}

	public create() {
		const topSpacing = this.cameras.main.centerY;
		const leftColumnStart = this.leftSideSpacing;
		const rightColumnStart = Math.ceil(this.cameras.main.width - ((this.cameras.main.width - this.leftSideSpacing) / 2));
		const thirdTabWidth = Math.floor((this.cameras.main.width - this.leftSideSpacing) / 3);

		const background = this.add.graphics();
		background.fillStyle(0x000000);
		background.fillRect(this.leftSideSpacing, topSpacing, this.cameras.main.width, this.cameras.main.height);

		this.mainGameScene = this.scene.get(MainGame.Name) as MainGame;

		this.add.text(this.leftSideSpacing, topSpacing, "Inventory").setFontFamily("monospace").setFontSize(20).setFill("#fff");

		this.currentPageText = this.add.text(this.leftSideSpacing, topSpacing + 25, "Page 1");
		this.currentPageText.setFontSize(14);

		this.previousButton = this.add.text(this.leftSideSpacing + thirdTabWidth, topSpacing, "Previous Page");
		this.previousButton.setInteractive();
		this.previousButton.on("pointerdown", this.decreasePage, this);
		this.nextButton = this.add.text(this.leftSideSpacing + thirdTabWidth * 2, topSpacing, "Next Page");
		this.nextButton.setInteractive();
		this.nextButton.on("pointerdown", this.increasePage, this);

		for (let i = 0; i < 10; i++) {
			const slotName = "inventorySlot" + i + "Text";
			const xPosition = (i % 2) === 0 ? leftColumnStart : rightColumnStart;
			const yPosition = topSpacing + 50 + 50 * Math.floor(i / 2);
			this[slotName] = this.add.text(xPosition, yPosition, "", { fontSize: "14px" });
			this[slotName].setInteractive();
			// TODO should be able to sell items after confirming
			this[slotName].on("pointerdown", () => { this.sellItem(i); }, this);
			//this.mainGameScene.player.sellItem
		}

		this.updateInventoryDisplay();
	}

	private decreasePage() {
		if (this.currentPage > 0) {
			this.currentPage--;
			this.updateInventoryDisplay();
		}
	}

	private increasePage() {
		const totalPages = Math.ceil(this.mainGameScene.player.inventory.length / 10);
		if (this.currentPage < (totalPages - 1)) {
			this.currentPage++;
			this.updateInventoryDisplay();
		}
	}

	/**
	 * Loop through items based upon page and populate each text item.
	 * @param page Zero-based page number to display inventory for.
	 */
	private updateInventoryDisplay() {
		const totalPages = Math.ceil(this.mainGameScene.player.inventory.length / 10);
		if (this.currentPage < 0) {
			this.currentPage = 0;
		}

		this.currentPageText.setText("Page " + (this.currentPage + 1) + "/" + (totalPages === 0 ? 1 : totalPages));

		for (let i = 0; i < 10; i++) {
			const slotName = "inventorySlot" + i + "Text";
			const slotText = this[slotName] as Phaser.GameObjects.Text;
			const inventoryItem = this.mainGameScene.player.inventory[i + 10 * this.currentPage] as Item;

			if (inventoryItem === undefined) {
				slotText.setText("");
			} else {
				slotText.setText("Lv" + inventoryItem.level + " " + inventoryItem.name + "\n " + this.itemStatsDisplay(inventoryItem.stats) + "\n Sale price: " + inventoryItem.sellPrice());
				slotText.input.hitArea.setSize(slotText.width, slotText.width);
			}
		}
	}

	private itemStatsDisplay(itemStats: Stats): string {
		return ""
			+ this.getItemStat(itemStats, "hp")
			+ this.getItemStat(itemStats, "sp")
			+ this.getItemStat(itemStats, "attack")
			+ this.getItemStat(itemStats, "defense")
			+ this.getItemStat(itemStats, "dexterity")
			+ this.getItemStat(itemStats, "magic");
	}

	private getItemStat(stats: Stats, statName: string): string {
		const value = (stats[statName] as number).toFixed(0);
		return value === "0"
			? ""
			: ("" + stats[statName].toFixed(0) + " " + Utilities.statDisplayString(statName) + " ");
	}

	private sellItem(pagePosition: number) {
		const player = this.mainGameScene.player;
		const item = player.inventory[pagePosition + (this.currentPage * 10)] as Item;
		if (item !== undefined) {
			player.sellItem(item);
		}
		this.updateInventoryDisplay();
	}
}
