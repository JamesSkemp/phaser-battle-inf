export default class MonsterData {
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
