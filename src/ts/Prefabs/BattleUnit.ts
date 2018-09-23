import Unit from "./Unit";
import Stats from "./Stats";
import Utilities from "./Utilities";
import SkillTrees from "../Data/SkillTrees";
import StatGrowth from "../Data/StatGrowth";
import Battle from "./Battle";

export default class BattleUnit extends Unit {
	public battle: Battle;
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
		this.floorBattleStats();

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
			this.battle.player.log(this.name + " attacks " + unit.name);
		}

		if (!dodged) {
			const damage = this.calculateBaseAttackDamageFor(unit) * power;
			const critical = this.willCriticalHit();

			this.incrementStats(StatGrowth.Action.didAttack);
			unit.incrementStats(StatGrowth.Action.wasAttacked);

			if (critical) {
				this.battle.player.log("It's critical!");
			}

			const actualDamage = unit.receiveDamage({damage, mult: critical ? 2 : 1});

			if (this["gameStats"]) {
				this["gameStats"].physicalDamageDealt += actualDamage;
			}

			return true;
		} else {
			this.battle.player.log(unit.name + " dodges the attack");

			return false;
		}
	}

	public defend() {
		// TODO should this actually do something?
		this.battle.player.log(this.name + " is defending");
	}

	public useSkillOn(skillName, unit): boolean {
		const skill = this.skills[skillName];
		const spRequired = SkillTrees.ActiveSkills[skillName].sp;

		if (this.battleStats.sp >= spRequired) {
			this.battleStats.sp -= spRequired;

			if (SkillTrees.ActiveSkills[skillName].magical) {
				this.incrementStats(StatGrowth.Action.usedMagicalSkill);
			} else {
				this.incrementStats(StatGrowth.Action.usedSkill);
			}

			skill.fn = SkillTrees.ActiveSkills[skillName].fn; // Set the function for the skill

			skill.uses++;

			// TODO
			this.battle.player.log(this.name + " uses " + skillName + " on " + unit.name + " " + this.createStatDisplay("sp"));

			skill.fn({
				user: this
				, skill
				, target: unit
				, battle: this.battle
			});

			return true;
		} else {
			return false;
		}
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
		this.battle.player.log(this.name + " receives " + args.damage + " damage " + args.reason + " " + statDisplay);

		if (this.battleStats.hp <= 0) {
			if (this.type === "hero") {
				this.battle.player.log(this.name + " is defeated");
			} else if (this.type === "monster") {
				this.battle.player.log(this.name + " is defeated");
			}
			this.battle.unitDead(this);

		}

		if (this["gameStats"]) {
			this["gameStats"].damagedReceived += args.damage;
		}

		return args.damage;
	}

	public addStatusEffect(statusEffect, turns, power) {
		const effectName = statusEffect.id;

		if (!this.battleStatusEffects[effectName]) {
			this.battleStatusEffects[effectName] = {
				name: effectName
				, power
				, totalTurns: turns
				, turnsRemaining: turns
				, added: statusEffect.added
				, update: statusEffect.update
				, removed: statusEffect.removed
			};

			this.battleStatusEffects[effectName].added(this);
		}
	}

	public removeStatusEffect(effect) {
		console.log(effect);
		// TODO
		this.battleStatusEffects[effect].removed(this);
		this.battleStatusEffects[effect] = null;
	}

	public hasStatusEffect(effectName): boolean {
		if (this.battleStatusEffects[effectName]) {
			return true;
		} else {
			return false;
		}
	}

	public restoreStat(stat: string, amount: number): number {
		this.battleStats[stat] += amount;
		if (this.battleStats[stat] > this.battleStatsMax[stat]) {
			amount = this.battleStatsMax[stat] - this.battleStats[stat];
			this.battleStats[stat] = this.battleStatsMax[stat];
		}

		const statDisplay = this.createStatDisplay("hp");
		this.battle.player.log(this.name + " regained " + amount + " " + Utilities.statDisplayString(stat) + " " + statDisplay);

		return amount;
	}

	public knowsSkill(skillName: string): boolean {
		// TODO needs to be reworked given my change
		if (this.skills[skillName]) {
			return true;
		} else {
			return false;
		}
	}

	public learnSkill(skillName: string) {
		// TODO needs to be reworked given my change
		if (!this.skills[skillName]) {
			const skill = SkillTrees.ActiveSkills[skillName];

			this.skills[skillName] = {
				level: 1
				, uses: 0
			};
		}
	}

	public incrementStats(statAmounts) {
		for (const stat of Object.keys(statAmounts)) {
			this.baseStats[stat] += statAmounts[stat] * (this.battle.level / this.level);
		}
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

		for (const unitSkill of this.skills) {
			// TODO there's a better way to handle this; necessary given how I setup skills
			console.log(unitSkill);

			const skill = SkillTrees.ActiveSkills[unitSkill];
			while (unitSkill.uses >= Utilities.getExpRequiredForSkillLevel(skill.baseExp, skill.growthRate, unitSkill.level)) {
				unitSkill.level++;
			}
		}
	}

	/**
	 * Round all stats down.
	 */
	public floorBattleStats(): void {
		this.battleStats.hp = Math.floor(this.battleStats.hp);
		this.battleStats.sp = Math.floor(this.battleStats.sp);
		this.battleStats.attack = Math.floor(this.battleStats.attack);
		this.battleStats.defense = Math.floor(this.battleStats.defense);
		this.battleStats.dexterity = Math.floor(this.battleStats.dexterity);
		this.battleStats.magic = Math.floor(this.battleStats.magic);
	}
}
