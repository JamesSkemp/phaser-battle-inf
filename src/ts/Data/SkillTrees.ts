import Utilities from "../Prefabs/Utilities";
import Status from "./Status";

export default class SkillTrees {
	public ActiveSkills = {
		"Slash": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Slash at your opponent"
			, magical: false
			, sp: 5
			, cost: 200
			, fn(args) {
				args.user.attack(args.target, (1.3 + args.skill.level * 0.2), true);
			}
			, type: "active"
		}
		, "Bash": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Bash your opponent and possibly paralyze them"
			, magical: false
			, sp: 5
			, cost: 200
			, fn(args) {
				const successful = args.user.attack(args.target, (1.2 + args.skill.level * 0.1), true);
				if (successful && Utilities.randomInt(0, 100) < (10 + args.skill.level)) {
					args.target.addStatusEffect(Status.Effects.Paralyzed, 2, 1);
				}
			}
			, type: "active"
		}
		, "Ignite": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Set your opponent on fire"
			, magical: true
			, sp: 5
			, cost: 200
			, fn(args) {
				const power = 1 + this.level * 0.2 + args.user.battleStats.magic * 0.01;
				if (Utilities.randomInt(0, 100) < 50) {
					args.target.addStatusEffect(Status.Effects.On_Fire, 3, power);
				}

				args.target.receiveDamage({damage: 5, mult: power});
			}
			, type: "active"
		}
		, "Fireball": {
			req: ["Ignite"]
			, reqLevel: [5]
			, baseExp: 150
			, growthRate: 1.5
			, desc: "Throw a fireball at your opponent"
			, magical: true
			, sp: 10
			, cost: 1000
			, fn(args) {
				const power = 1 + this.level * 0.5 + args.user.battleStats.magic * 0.03;
				if (Utilities.randomInt(0, 100) < 25) {
					args.target.addStatusEffect(Status.Effects.On_Fire, 2, power);
				}

				args.target.receiveDamage({damage: 5, mult: power});
			}
			, type: "active"
		}
		, "Fire Slash": {
			req: ["Slash", "Ignite"]
			, reqLevel: [5, 5]
			, baseExp: 150
			, growthRate: 1.5
			, desc: "Ignite your weapon and slash your opponent"
			, magical: true
			, sp: 10
			, cost: 1000
			, fn(args) {
				const successful = args.user.attack(args.target, (2 + args.skill.level * 0.2), true);

				const power = 1 + this.level * 0.2 + args.user.battleStats.magic * 0.01;

				if (successful) {
					if (Utilities.randomInt(0, 100) < 50) {
						args.target.addStatusEffect(Status.Effects.On_Fire, 2, power);
					}
					args.target.receiveDamage({damage: 5, mult: power});
				}
			}
			, type: "active"
		}
		, "Attack Down": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Weaken the attack of an opponent"
			, magical: true
			, sp: 5
			, cost: 500
			, fn(args) {
				const power = 1 + this.level * 0.2 + args.user.battleStats.magic * 0.01;
				args.target.addStatusEffect(Status.Effects.Attack_Down, 3, power);
			}
			, type: "active"
		}
		, "Defense Down": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Weaken the defence of an opponent"
			, magical: true
			, sp: 5
			, cost: 500
			, fn(args) {
				const power = 1 + this.level * 0.2 + args.user.battleStats.magic * 0.01;
				args.target.addStatusEffect(Status.Effects.Defense_Down, 3, power);
			}
			, type: "active"
		}
		, "Heal": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, desc: "Restore some HP of an ally"
			, magical: true
			, sp: 5
			, cost: 500
			, fn(args) {
				const power = 1 + this.level * 0.2 + args.user.battleStats.magic * 0.01;
				const amountRestored = args.target.restoreStat("hp", Math.round(power * 10));

			}
			, type: "active"
		}
	};

	public PassiveSkills = {
		"Critical Strike": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, cost: 500
			, desc: "Learn how to critically strike an opponent"
			, type: "passive"
		}
		, "Dodge": {
			req: []
			, reqLevel: []
			, baseExp: 100
			, growthRate: 1.5
			, cost: 500
			, desc: "Learn how to dodge opponents attacks"
			, type: "passive"
		}
	};
}
