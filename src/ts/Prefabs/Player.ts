export default class Player {

	public money: number = 0;
	public moneyPerMinute: number = 0;

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

	public timeMultiplier = 1;

	public lastShopRefreshTimestamp = 0;
	public lastTrainingCheckTimestamp = 0;

	public unlock = {};

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
}
