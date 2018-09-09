import Utilities from "../Prefabs/Utilities";

export default class MonsterData {
	public static Act = {
		target_opponent_with_least(stat: string) {
			return {
				type: "Select Target",
				targetType: "Opponent",
				select: "With Least",
				stat
			};
		}

		, target_ally_with_least(stat: string) {
			return {
				type: "Select Target",
				targetType: "Ally",
				select: "With Least",
				stat
			};
		}

		, attack_opponent() {
			return {
				type: "Action",
				code: "Attack",
				target: "Selected Opponent"
			};
		}

		, skill_on_ally(skillName: string) {
			return {
				type: "Action",
				code: "Use Skill",
				target: "Selected Ally",
				skillName
			};
		}

		, skill_on_opponent(skillName: string) {
			return {
				type: "Action",
				code: "Use Skill",
				target: "Selected Opponent",
				skillName
			};
		}

		, condition_ally_stat(stat: string, comp: string, constant: string, actions) {
			return {
				type: "Condition",
				target: "Selected Ally",
				actions,
				functionName: "Stat",
				stat,
				comp,
				constant
			};
		}
	};

	// TODO change to an array instead?
	public static Behaviors = {
		basic_attack: {
			name(level) {
				return "";
			}
			, actions() {
				return [
					MonsterData.Act.target_opponent_with_least("hp")
					, MonsterData.Act.attack_opponent()
				];
			}
			, statMods: {
			}
		}

		, basic_soldier: {
			name(level) {
				return "Soldier";
			}
			, actions() {
				const skillName = Utilities.selectRandom(this.skills);

				return [
					MonsterData.Act.target_opponent_with_least("hp")
					, MonsterData.Act.skill_on_opponent(skillName)
					, MonsterData.Act.attack_opponent()
				];
			}
			, statMods: {
				hp: 1.2
				, sp: 1
				, attack: 1.2
			}
			, skills: ["Slash", "Bash"]
			, skillLevel: 1
		}

		, basic_healer: {
			name(level) {
				return "Healer";
			}
			, actions() {
				return [
					MonsterData.Act.target_ally_with_least("hp")
					, MonsterData.Act.condition_ally_stat(
						"hp", "<", "50%",
						[MonsterData.Act.skill_on_ally("Heal")]
					)
					, MonsterData.Act.target_opponent_with_least("hp")
					, MonsterData.Act.attack_opponent()
				];
			}
			, statMods: {
				hp: 0.8
				, sp: 2
				, attack: 0.6
			}
			, skills: ["Heal"]
			, skillLevel: 1
		}
	};

	public static LevelBehaviors = [
		{
			maxLevel: 5,
			behaviorIds: [
				"basic_attack"
				, "basic_soldier"
				, "basic_healer"
			]
		}, {
			maxLevel: 10,
			behaviorIds: [
				"basic_attack"
				, "basic_soldier"
				, "basic_healer"
			]
		}, {
			// Past the last defined level, anything goes
			maxLevel: 9007199254740992, // Max int
			behaviorIds: [
				"basic_attack"
				, "basic_soldier"
				, "basic_healer"
			]
		}
	];

	public static LevelNames = [
		{
			maxLevel: 5,
			names: [
				"Rat_Man"
				, "Wolf"
				, "Spider"
			]
		}, {
			maxLevel: 10,
			names: [
				"Kobold"
				, "Boar"
				, "Slime"
			]
		}, {
			maxLevel: 15,
			names: [
				"Zombie"
				, "Harpy"
				, "Bear"
			]
		}, {
			maxLevel: 20,
			names: [
				"Troll"
				, "Golem"
				, "Giant_Scorpion"
			]
		}
		// Dont need to define a max/end level, a random group and a random monster will be chosen
	];
}
