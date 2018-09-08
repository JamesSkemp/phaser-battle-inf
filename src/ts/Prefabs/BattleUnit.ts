import Unit from "./Unit";
import Stats from "./Stats";
import Utilities from "./Utilities";

export default class BattleUnit extends Unit {
	public battle;
	public baseStats: Stats;

	public battleStats: Stats = null;
	public battleStatsMax = null;
	public battleStatusEffects = {};
	public actScore: number = 0;

	public actionCode = "";

	public initBattleUnit() {
		this.initUnit();

		this.battle = null;

		this.baseStats = new Stats();

		this.battleStats = null;
		this.battleStatsMax = null;
		this.battleStatusEffects = {};
		this.actScore = 0;

		this.actionCode = "";
	}

	public initForBattle(battle) {
		this.battle = battle;
		// TODO
		this.battleStats = Utilities.mergeObjects({}, this.stats);
		this.battleStats.floorStats();

		// TODO
		this.battleStatsMax = Utilities.mergeObjects({}, this.battleStats);
		this.battleStatusEffects = {};
	}
}
