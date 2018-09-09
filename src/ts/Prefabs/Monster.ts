import BattleUnit from "./BattleUnit";
import MonsterGenProperties from "./MonsterGenProperties";
import MonsterData from "../Data/MonsterData";
import Utilities from "./Utilities";
import Stats from "./Stats";

export default class Monster extends BattleUnit {
	public stats: Stats;

	public constructor(battleLevel: number, genProperties: MonsterGenProperties) {
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

		const monsterBehavior = MonsterData.Behaviors[genProperties.type];
		const monsterName = MonsterData.Types[genProperties.name];

		this.level = genProperties.level;
		if (genProperties.customName) {
			this.name = genProperties.customName;
		} else {
			this.name = genProperties.name.replace("_", " ") + " " + monsterBehavior.name(this.level);
		}

		const baseStat = 10 * this.level;

		this.stats = new Stats();
		// Loop through all stats to see if the monster type or behavior (class) gives stat changes.
		for (const statProperty of Object.keys(this.stats)) {
			if (monsterName[statProperty]) {
				this.stats[statProperty] = monsterName[statProperty] * baseStat;
			}
			if (monsterBehavior.statMods[statProperty]) {
				this.stats[statProperty] *= monsterBehavior.statMods[statProperty];
			}
		}

		// Give the monster all skills, but only one will be called from the actions.
		if (monsterBehavior.skills) {
			for (const skillName of monsterBehavior.skills) {
				this.skills[skillName] = {
					level: this.level,
					uses: 0,
					next: 0
				};
			}
		}

		// TODO
	}
}
