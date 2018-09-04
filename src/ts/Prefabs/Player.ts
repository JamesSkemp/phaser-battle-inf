export default class Player {

	public money: number = 0;
	public moneyPerMinute: number = 0;

	public batteLog: string[] = [];

	public inventoryMax = 20;

	public landUsed = 0;
	public maxLand = 10;
	public landProgress = 0;

	public battleLevel = 1;

	public heroMax = 8;

	public autoSave = true;
	public endless = false;
	public paused = false;
	public inBattle = false;

	public constructor() {
		// TODO
	}

	public log(message: string) {
		if (this.batteLog.length > 500) {
			this.batteLog.splice(0, 1);
		}
		this.batteLog.push(message);
	}

	public clearLog(): void {
		this.batteLog = [];
		this.log("Battle log cleared");
	}
}
