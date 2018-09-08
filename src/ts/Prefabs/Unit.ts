import Utilities from "./Utilities";
import Stats from "./Stats";

export default class Unit {
	public name: string;
	public level = 1;
	public exp = 0;
	public stats: Stats;
	// TODO
	public skills;

	public initUnit() {
		this.name = "Unnamed Unit " + Utilities.randomInt(100, 999);
		this.level = 1;
		this.exp = 0;
		// TODO
		this.stats = new Stats();
		this.skills = {};
	}
}
