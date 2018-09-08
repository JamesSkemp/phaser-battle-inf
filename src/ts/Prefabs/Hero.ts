import BattleUnit from "./BattleUnit";

export default class Hero extends BattleUnit {

	public totalExp = 0;

	public trainingAreaIndex = -1;
	public index = -1;

	public constructor() {
		super();
		this.type = "hero";
	}

	public setup(index: number) {
		this.index = index;

		// TODO
	}
}
