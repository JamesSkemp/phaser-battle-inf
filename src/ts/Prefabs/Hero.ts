import BattleUnit from "./BattleUnit";
import NameGenerator from "./NameGenerator";

export default class Hero extends BattleUnit {

	public totalExp = 0;

	public trainingAreaIndex = -1;
	public index = -1;

	public constructor() {
		super();
		this.type = "hero";

		this.name = NameGenerator.randomName(2, 5) + " " + NameGenerator.randomName(2, 5);
	}

	public setup(index: number) {
		this.index = index;

		// TODO
	}
}
