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

	public constructor() {
		super();
	}

	public initBattleUnit() {
		// TODO might be able to just move this into the BattleUnit constructor.
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

	public createStatDisplay(stat: string) {
		// TODO this was used for display previously
		let ratio = this.battleStats[stat] / (this.battleStatsMax[stat] * 1.0);

		return "[" + this.battleStats[stat] + " / " + this.battleStatsMax[stat] + " " + Utilities.statDisplayString(stat) + "]";
	}
}
