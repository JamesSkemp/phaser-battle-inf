import BattleUnit from "./BattleUnit";
import MonsterGenProperties from "./MonsterGenProperties";
import MonsterData from "../Data/MonsterData";
import Utilities from "./Utilities";

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

		if (!genProperties.type) {
			for (const levelBehaviors of MonsterData.LevelBehaviors) {
				if (genProperties.level < levelBehaviors.maxLevel) {
					const r = Utilities.randomInt(0, levelBehaviors.behaviorIds.length - 1);
					genProperties.type = levelBehaviors.behaviorIds[r];
					break;
				}
			}
		}

		if (!genProperties.name) {
			for (const levelNames of MonsterData.LevelNames) {
				if (genProperties.level < levelNames.maxLevel) {
					const r = Utilities.randomInt(0, levelNames.names.length - 1);
					genProperties.name = levelNames.names[r];
					break;
				}
			}

			if (!genProperties.name) {
				const levelNames = MonsterData.LevelNames[Utilities.randomInt(0, MonsterData.LevelNames.length - 1)];
				const r = Utilities.randomInt(0, levelNames.names.length - 1);
				genProperties.name = levelNames.names[r];
			}
		}

		// TODO

		this.level = genProperties.level;
		if (genProperties.customName) {
			this.name = genProperties.customName;
		} else {
			// TODO
			//this.name = genProperties.name.replace("_", " ") + " ";
		}

		const baseStat = 10 * this.level;

		// TODO
	}
}
