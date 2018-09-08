import BattleUnit from "./BattleUnit";

export default class Monster extends BattleUnit {

	public constructor(genProperties) {
		super();

		this.initBattleUnit();
		this.type = "monster";
	}
}
