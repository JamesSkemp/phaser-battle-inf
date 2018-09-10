import Unit from "./Unit";
import Stats from "./Stats";
import Utilities from "./Utilities";
import SkillTrees from "../Data/SkillTrees";

export default class BattleUnit extends Unit {
	public battle;
	public baseStats: Stats;

	public battleStats: Stats = null;
	public battleStatsMax = null;
	public battleStatusEffects = [];
	public actScore: number = 0;
	public skipNextTurn: boolean = false;

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
		this.battleStatusEffects = [];
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
		this.battleStatusEffects = [];
	}

	public createStatDisplay(stat: string) {
		// TODO this was used for display previously
		let ratio = this.battleStats[stat] / (this.battleStatsMax[stat] * 1.0);

		return "[" + this.battleStats[stat] + " / " + this.battleStatsMax[stat] + " " + Utilities.statDisplayString(stat) + "]";
	}

	public attack(unit: BattleUnit, power, supressAttackMessage) {
		// TODO
		console.log(this.name + " attacks " + unit.name);
	}

	public receiveDamage(args) {
		if (!args.reason) {
			args.reason = "";
		}
		if (!args.mult) {
			args.mult = 1;
		}

		args.damage *= args.mult;
		// TODO
	}

	public removeStatusEffect(effect) {
		console.log(effect);
		// TODO
		//this.battleStatusEffects[effect].removed(this);
		//this.battleStatusEffects[effect] = null;
	}

	public updateAfterBattle() {
		while (true) {
			const reqExp = Utilities.getExpRequiredForLevel(this.level);

			if (this.exp >= reqExp) {
				this.level++;
				// TODO should this be zero, or take reqExp away from exp? if the latter, we might want to throw a break here and set exp = next level reqExp - 1?
				this.exp = 0;
			} else {
				break;
			}
		}

		for (const skillName of this.skills) {
			// TODO there's a better way to handle this; necessary given how I setup skills
			console.log(skillName);

			// TODO
		}
	}
}
