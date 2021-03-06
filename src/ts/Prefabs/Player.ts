import Hero from "./Hero";
import Utilities from "./Utilities";
import Monster from "./Monster";
import PlayerUnlocks from "./PlayerUnlocks";
import Buildings from "../Data/Buildings";
import Item from "./Item";
import ItemGenProperties from "./ItemGenProperties";
import Battle from "./Battle";
import Stats from "./Stats";

export default class Player {

	public money: number = 0;
	public gpm: number = 0;

	public battleLog: string[] = [];

	public inventory = [];
	public inventoryMax = 20;
	public inventoryActions = { type: "root", actions: []};
	public inventoryActionCode = "";

	public landUsed = 0;
	public landMax = 10;
	public landProgress = 0;

	public shopItems = [];

	public buildings = {};

	public battleLevel = 1;

	public heroMax = 8;
	public heroes: Hero[] = [];
	public monsters = [];
	public battleHeroes = [];

	public trainingSlots = [];

	public autoSave = true;
	public endless = false;
	public paused = false;
	public inBattle = false;
	public battle: Battle = null;

	public timeMultiplier = 1;

	public lastShopRefreshTimestamp = 0;
	public lastTrainingCheckTimestamp = 0;

	public unlock: PlayerUnlocks;

	public constructor() {
		this.unlock = new PlayerUnlocks();
		// TODO
	}

	public log(message: string) {
		if (this.battleLog.length > 500) {
			this.battleLog.splice(0, 1);
		}
		this.battleLog.push(message);
		// TODO remove
		console.log("Battle Log: " + message);
	}

	public clearLog(): void {
		this.battleLog = [];
		this.log("Battle log cleared");
	}

	public addInitialLogMessages() {
		this.battleLog = [];
		this.log("Welcome to Battle INF.");
		this.log("This is where you will see most game messages, but the more important ones will popup at the top of the window.");
		this.log("Your goal is to complete challanges, which are waves of enemies, but there is a catch.");
		this.log("Each enemy is designed with its own logic, so it is your job to design your heroes with even better logic!");
		this.log("Your heroes will grow based on every little action. Stat points and skills will all grow based on what a hero does and has done to them in battle.");
		this.log("");
		this.log('Start off by clicking "Start Battle"');
	}

	public initNewPlayer() {
		this.createNewHero();
		this.heroes[0].reserve = false;

		// Add initial default buildings.
		this.buildBuilding(Buildings.getBuildingByName("Townhall"));
		this.buildBuilding(Buildings.getBuildingByName("Weapon Smith"));
		this.buildBuilding(Buildings.getBuildingByName("Armor Smith"));
		this.buildBuilding(Buildings.getBuildingByName("Housing"));
		this.buildBuilding(Buildings.getBuildingByName("Housing"));

		for (let i = 0; i < 10; i++) {
			const startingItemProperties = new ItemGenProperties(1, 1, null, null);
			this.addItem(new Item(startingItemProperties));
		}
	}

	public createNewHero() {
		if (this.heroes.length >= this.heroMax) {
			return;
		}
		const hero = new Hero();
		hero.setup(this.heroes.length, this);
		this.heroes.push(hero);
	}

	public createMonsterParty(max) {
		let numberOfMonsters = Utilities.randomInt(max - 1, max + 1);
		if (numberOfMonsters < 1) {
			numberOfMonsters = 1;
		}

		const monsters = [];

		for (let i = 0; i < numberOfMonsters; i++) {
			const monster = new Monster(this.battleLevel, null);
			// TODO not sure what this should have been?
			monster.initForBattle(null);
			this.log(monster.name + " appeared " + monster.createStatDisplay("hp"));
			monsters.push(monster);
		}

		this.monsters = monsters;
	}

	public buildBuilding(building) {
		const name = building.name;

		if (!this.buildings[name]) {
			this.buildings[name] = [];
		}

		this.buildings[name].push({
			name,
			level: 1
		});

		if (building.onBuild) {
			building.onBuild(this.buildings[name].length, this);
		}

		this.calculateLand();
		this.calculateGPM();

		// TODO add gem building too?
		if (name === "Weapon Smith" || name === "Armor Smith") {
			this.restockShopItems();
		}
	}

	public calculateLand() {
		let landUsed = 0;

		for (const building of Buildings.Options) {
			if (this.buildings[building.name]) {
				landUsed += building.space * this.buildings[building.name].length;
			}
		}

		this.landUsed = landUsed;
	}

	public calculateGPM() {
		let gpm = 0;

		for (const building of Buildings.Options) {
			if (this.buildings[building.name]) {
				for (const j of this.buildings[building.name]) {
					gpm += building.gpm * j.level;
				}
			}
		}

		this.gpm = gpm;
	}

	public addHeroToTraining(hero: Hero, buildingIndex: number) {
		hero.trainingAreaIndex = buildingIndex;
	}

	public removeHeroInTraining(buildingIndex: number) {
		for (const hero of this.heroes) {
			if (hero.trainingAreaIndex === buildingIndex) {
				hero.trainingAreaIndex = -1;
				break;
			}
		}
	}

	/**
	 * Compare item properties.
	 * @param item 
	 * @param prop Item property to look at.
	 * @param comp Type of comparision to do, either >= or <=.
	 * @param value 
	 */
	public itemComp(item: Item, prop: string, comp: string, value) {
		const valueA = item[prop];
		const valueB = value;

		switch (comp) {
			case ">=":
				return valueA >= valueB;
				break;
			case "<=":
				return valueA <= valueB;
				break;
		}
	}

	public addItem(item: Item) {
		let result = "keep";

		let itemFn = function(item) { };
		eval("itemFn = function(item) {" + this.inventoryActionCode + "}");
		itemFn(item);

		if (result === "sell" || this.inventory.length >= this.inventoryMax) {
			this.addMoneyFromItemSale(item);
		} else if (this.inventory.length < this.inventoryMax) {
			this.inventory.push(item);
		}
	}

	public removeItem(item: Item) {
		this.inventory.splice(this.inventory.indexOf(item), 1);
	}

	public sellItem(item: Item) {
		this.removeItem(item);
		this.addMoneyFromItemSale(item);
	}

	public restockShopItems() {
		const armorTypes = ["body", "feet", "hands", "head", "legs"];

		this.shopItems = [];

		if (this.buildings["Armor Smith"]) {
			const armorCostMod = 1 - Utilities.log10(this.buildings["Armor Smith"].length + 10) / 2 + 0.5;
			const armorAmount = this.buildings["Armor Smith"].length < 50 ? this.buildings["Armor Smith"].length : 50;

			// Create armor
			for (let i = 0; i < armorAmount; i++) {
				const type = armorTypes[Utilities.randomInt(0, armorTypes.length - 1)];
				const building = this.buildings["Armor Smith"][i];
				const item = new Item(new ItemGenProperties(building.level, null, type, null));
				this.shopItems.push(item);
			}
		}

		if (this.buildings["Weapon Smith"]) {
			const weaponCostMod = 1 - Utilities.log10(this.buildings["Weapon Smith"].length + 10) / 2 + 0.5;
			const weaponAmount = this.buildings["Weapon Smith"].length < 50 ? this.buildings["Weapon Smith"].length : 50;

			// Create weapons
			for (let i = 0; i < weaponAmount; i++) {
				const building = this.buildings["Weapon Smith"][i];
				const item = new Item(new ItemGenProperties(building.level, null, "hand", null));
				this.shopItems.push(item);
			}
		}

		// TODO add gem code
	}

	public getShopPercentOff(buildingName: string): number {
		if (this.buildings[buildingName]) {
			let amountOff = 1 - Utilities.log10(this.buildings[buildingName].length + 10) / 2 + 0.5;
			amountOff = parseInt(((1 - amountOff) * 100).toFixed(0), 10);
			return amountOff;
		}

		return 0;
	}

	public startBattle() {
		this.battleHeroes = [];
		for (const hero of this.heroes) {
			if (!hero.reserve) {
				this.battleHeroes.push(hero);
			}
		}

		if (this.battleHeroes.length === 0) {
			return;
		}

		this.createMonsterParty(this.battleHeroes.length);

		this.battle = new Battle(this);
		this.battle.addParty(this.battleHeroes);
		this.battle.addParty(this.monsters);

		let level = 0;
		for (const monster of this.monsters) {
			level += monster.level;
		}
		this.battle.level = this.battleLevel;

		this.battle.initBattle();

		this.inBattle = true;
	}

	public battleDone() {
		this.inBattle = false;

		// Only award EXP, money, and land progress if the player won
		if (this.battle.winningIndex === 1) {
			this.log("YOU WON");

			let totalLevels = 0;
			for (const deadUnit of this.battle.parties[1].deadUnits) {
				totalLevels += deadUnit.level;
			}

			const addMoney = totalLevels;
			this.log("+" + addMoney + " money");
			this.money += addMoney;

			this.addLandProgress(this.battle.parties[1].deadUnits.length);

			const addExp = Math.round(totalLevels);
			for (const hero of this.battleHeroes) {
				hero.addExp(addExp);
				this.log(hero.name + " +" + addExp + " exp");
			}

			const r = Utilities.randomInt(0, 100);
			const chance = 20;

			// Chance to get a random item of the battle level
			if (r <= chance) {
				const newItem = new Item(new ItemGenProperties(this.battle.level, null, null, null));
				this.log("Found " + newItem.rarity + " " + newItem.name);
				this.addItem(newItem);
			}
		} else {
			this.log("YOU LOST");
		}

		if (!this.unlock.endlessMode) {
			// Unlock endless mode after the first battle is done.
			this.unlock.endlessMode = true;
		}
	}

	public updateHeroStats() {
		for (const hero of this.heroes) {
			const oldStats = Utilities.mergeObjects(new Stats(), hero.stats);
			hero.calculateStats();

			const statChanges = [];
			for (const stat of Object.keys(oldStats)) {
				const diff = hero.stats[stat] - oldStats[stat];
				if (diff !== 0) {
					statChanges.push(Utilities.statDisplayString(stat) + " +" + diff.toFixed(2));
				}
			}

			if (statChanges.length > 0) {
				this.log(hero.name + " " + statChanges.join(" / "));
			}
		}
	}

	public getMaxHeroLevel(): number {
		let level = 0;
		for (const hero of this.heroes) {
			if (hero.level > level) {
				level = hero.level;
			}
		}

		return level;
	}

	public getActiveHeroCount(): number {
		let count = 0;
		for (const hero of this.heroes) {
			if (!hero.reserve) {
				count++;
			}
		}
		return count;
	}

	public addLandProgress(mult) {
		const divisor = (this.landMax * (this.getMaxHeroLevel() / this.battle.level));
		const min = 0.1 / divisor;
		const max = 0.2 / divisor;
		const progress = Utilities.randomFloat(min, max) * mult;

		this.log("+" + (progress * 100).toFixed(2) + "% land progress");

		this.landProgress += progress;
		if (this.landProgress > 1) {
			this.landProgress -= 1;
			this.landMax += 1;
		}
	}

	public prepareForSave() {
		this.inBattle = false;
		this.battleHeroes = [];

		for (const hero of this.heroes) {
			hero.battle = null;
		}

		for (const monster of this.monsters) {
			monster.battle = null;
		}
	}

	public loadPlayer(savedPlayer: Player) {
		for (const key of Object.keys(savedPlayer)) {
			if (key === "heroes" || key === "inventory") {
				// We'll handle these keys later.
				continue;
			}
			this[key] = savedPlayer[key];
		}
		this.loadHeroes(savedPlayer.heroes);
		this.loadInventory(savedPlayer.inventory);
	}

	/**
	 * Add new hero objects when data is loaded from storage.
	 */
	public loadHeroes(savedHeroes) {
		for (const savedHero of savedHeroes) {
			const hero = new Hero();
			hero.load(savedHero);
			this.heroes.push(hero);
		}
	}

	public loadInventory(savedInventory: Item[]) {
		for (const savedItem of savedInventory) {
			const savedItemProperties = new ItemGenProperties(savedItem.level, savedItem.rarity, savedItem.type, savedItem.subType);

			const item = new Item(savedItemProperties);
			item.load(savedItem);
			this.addItem(item);
		}
	}

	/**
	 * Give the player money for selling an item.
	 * @param item Item to sell.
	 */
	private addMoneyFromItemSale(item: Item) {
		this.money += item.sellPrice();
	}
}
