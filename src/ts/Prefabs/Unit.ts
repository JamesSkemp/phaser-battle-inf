import Utilities from "./Utilities";
import Stats from "./Stats";

export default class Unit {
	public name: string;
	public type: string;
	public level = 1;
	public exp = 0;
	public stats: Stats;
	// TODO
	public skills;

	public constructor() {
		this.level = 1;
		this.exp = 0;
		this.stats = new Stats();
		this.skills = {};
	}

	public initUnit() {
		this.name = "Unnamed Unit " + Utilities.randomInt(100, 999);
	}
}
