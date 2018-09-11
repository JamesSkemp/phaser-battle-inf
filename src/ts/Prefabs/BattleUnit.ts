import Unit from "./Unit";
import Stats from "./Stats";
import Utilities from "./Utilities";
import SkillTrees from "../Data/SkillTrees";
import StatGrowth from "../Data/StatGrowth";

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
		// TODO?
		this.battleStats = Utilities.mergeObjects({}, this.stats);
		this.battleStats.floorStats();

		// TODO?
		this.battleStatsMax = Utilities.mergeObjects({}, this.battleStats);
		this.battleStatusEffects = [];
	}

	public createStatDisplay(stat: string) {
		// TODO this was used for display previously
		let ratio = this.battleStats[stat] / (this.battleStatsMax[stat] * 1.0);

		return "[" + this.battleStats[stat] + " / " + this.battleStatsMax[stat] + " " + Utilities.statDisplayString(stat) + "]";
	}

	public willCriticalHit(): boolean {
		const skill = this.skills["Critical Dodge"];
		if (skill) {
			skill.uses++;
			if (Utilities.randomInt(0, 100) < skill.level) {
				return true;
			}
		}
		return false;
	}

	public willDodge() {
		const skill = this.skills["Dodge"];
		if (skill) {
			skill.uses++;
			if (Utilities.randomInt(0, 100) < skill.level) {
				return true;
			}
		}
	}

	public attack(unit: BattleUnit, power, supressAttackMessage: boolean): boolean {
		const dodged = unit.willDodge();

		if (!supressAttackMessage) {
			// TODO
			//player.log('<b>' + this.name + '</b> attacks <b>' + unit.name + '</b>');
			console.log(this.name + " attacks " + unit.name);
		}

		if (!dodged) {
			const damage = this.calculateBaseAttackDamageFor(unit) * power;
			const critical = this.willCriticalHit();

			this.incrementStats(StatGrowth.Action.didAttack);
			unit.incrementStats(StatGrowth.Action.wasAttacked);

			if (critical) {
				// TODO
				//player.log('<p class="padding">It\'s critical!</p>');
				console.log("It's critical!");
			}

			const actualDamage = unit.receiveDamage({damage, mult: critical ? 2 : 1});

			if (this["gameStats"]) {
				this["gameStats"].physicalDamageDealt += actualDamage;
			}

			return true;
		} else {
			// TODO
			//player.log('<b>' + unit.name + '</b> dodges the attack');
			console.log(unit.name + " dodges the attack");

			return false;
		}
	}

	public defend() {
		// TODO should this actually do something?
		//player.log(this.name + ' is defending');
		console.log(this.name + " is defending");
	}

	public useSkillOn(skillName, unit) {
		// TODO
		console.log(arguments);
	}

	public calculateBaseAttackDamageFor(unit) {
		let damage = this.battleStats.attack - (unit.battleStats.defense / 2);

		// Dexterity modifies damage
		damage *= (1 + (this.battleStats.dexterity * 0.005));
		damage *= Utilities.randomFloat(0.8, 1.2);

		return damage;
	}
	public receiveDamage(args): number {
		if (!args.reason) {
			args.reason = "";
		}
		if (!args.mult) {
			args.mult = 1;
		}

		args.damage *= args.mult;
		args.damage /= (1 + (this.battleStats.dexterity * 0.001));

		if (args.damage < 1) {
			args.damage = 1;
		}
		args.damage = Math.floor(args.damage);

		this.battleStats.hp -= args.damage;

		this.incrementStats(StatGrowth.Action.receivedDamage);

		const statDisplay = this.createStatDisplay("hp");
		console.log(this.name + "receives " + args.damage + " damage " + args.reason + " " + statDisplay);

		if (this.battleStats.hp <= 0) {
			if (this.type === "hero") {
				console.log(this.name + " is defeated");
			} else if (this.type === "monster") {
				console.log(this.name + " is defeated");
			}
			console.log(this.battle);
			this.battle.unitDead(this);

		}

		if (this["gameStats"]) {
			this["gameStats"].damagedReceived += args.damage;
		}

		return args.damage;
	}

	public removeStatusEffect(effect) {
		console.log(effect);
		// TODO
		//this.battleStatusEffects[effect].removed(this);
		//this.battleStatusEffects[effect] = null;
	}

	public incrementStats(statAmounts) {
		// TODO
		console.log(statAmounts);
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
