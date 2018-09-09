import BattleUnit from "./BattleUnit";
import MonsterGenProperties from "./MonsterGenProperties";

export default class Monster extends BattleUnit {

	public constructor(genProperties: MonsterGenProperties, battleLevel: number) {
		super();

		this.initBattleUnit();
		this.type = "monster";

		if (!genProperties) {
			genProperties = new MonsterGenProperties();
		}

		if (!genProperties.level || genProperties.level < 1) {
			genProperties.level = battleLevel;
		}
	}
}
