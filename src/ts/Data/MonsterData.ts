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

	public static Types = {
		Rat_Man: {
			name: "Rat Man",
			hp: 3,
			attack: 1.5,
			defense: 0,
			dexterity: 1.2,
			magic: 0,
			sp: 1
		},
		Wolf: {
			name: "Wolf",
			hp: 3.3,
			attack: 1.7,
			defense: 0,
			dexterity: 1,
			magic: 0,
			sp: 1
		},
		Spider: {
			name: "Spider",
			hp: 2.5,
			attack: 1.7,
			defense: 0,
			dexterity: 1.2,
			magic: 0,
			sp: 1
		},
		Kobold: {
			name: "Kobold",
			hp: 4,
			attack: 2.2,
			defense: 0,
			dexterity: 1,
			magic: 1,
			sp: 2
		},
		Boar: {
			name: "Board",
			hp: 6,
			attack: 2,
			defense: 0,
			dexterity: 1.2,
			magic: 0,
			sp: 2
		},
		Slime: {
			name: "Slime",
			hp: 4,
			attack: 1.5,
			defense: 0,
			dexterity: 0.8,
			magic: 2,
			sp: 2
		},
		Zombie: {
			name: "Zombie",
			hp: 8,
			attack: 2,
			defense: 0,
			dexterity: 0.8,
			magic: 0,
			sp: 3
		},
		Harpy: {
			name: "Harpy",
			hp: 4,
			attack: 2,
			defense: 0,
			dexterity: 1,
			magic: 2,
			sp: 3
		},
		Bear: {
			name: "Bear",
			hp: 8,
			attack: 1,
			defense: 0,
			dexterity: 1,
			magic: 0,
			sp: 3
		},
		Troll: {
			name: "Troll",
			hp: 8,
			attack: 2.4,
			defense: 0,
			dexterity: 0.9,
			magic: 0,
			sp: 4
		},
		Golem: {
			name: "Golem",
			hp: 8,
			attack: 2,
			defense: 0,
			dexterity: 0.7,
			magic: 2,
			sp: 4
		},
		Giant_Scorpion: {
			name: "Giant Scorpion",
			hp: 7,
			attack: 2,
			defense: 0,
			dexterity: 1.2,
			magic: 0,
			sp: 4
		},
	};
}
