import Hero from "./Hero";
import Utilities from "./Utilities";
import Monster from "./Monster";
import PlayerUnlocks from "./PlayerUnlocks";
import Buildings from "../Data/Buildings";
import Item from "./Item";
import ItemGenProperties from "./ItemGenProperties";
import Battle from "./Battle";

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
	public heroes = [];
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
		// TODO
	}

	public log(message: string) {
		if (this.battleLog.length > 500) {
			this.battleLog.splice(0, 1);
		}
		this.battleLog.push(message);
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
		this.unlock = new PlayerUnlocks();
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
		const hero = new Hero();
		hero.setup(this.heroes.length);
		this.heroes.push(Utilities.mergeObjects({}, hero));
		// TODO switch to the following?
		//this.heroes.push(hero);
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

	public addItem(item: Item) {
		let result = "keep";

		// TODO
		//eval("itemFn = function(item) {" + this.inventoryActionCode + "}");
		//itemFn(item);

		if (result === "sell" || this.inventory.length >= this.inventoryMax) {
			// TODO take into account shop discount?
			this.money += Math.floor(item.moneyValue * 0.4);
		} else if (this.inventory.length < this.inventoryMax) {
			this.inventory.push(item);
		}
	}

	public removeItem(item: Item) {
		this.inventory.splice(this.inventory.indexOf(item), 1);
	}

	public restockShopItems() {
		// TODO
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

		// TODO this should be stored somewhere else
		this.battle = new Battle();
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
}
