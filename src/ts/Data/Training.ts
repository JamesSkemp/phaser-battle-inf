export default class Training {
	public Options = {
		attack: {
			name: "Weapons Training"
			, level: 1
			, stats: {
				attack: 0.02
				, dexterity: 0.005
			}
		}
		, defense: {
			name: "Defensive Training"
			, level: 1
			, stats: {
				defense: 0.02
				, dexterity: 0.005
			}
		}
		, dexterity: {
			name: "Obstacle Course"
			, level: 2
			, stats: {
				dexterity: 0.02
			}
		}
		, magic: {
			name: "Mental Training"
			, level: 2
			, stats: {
				magic: 0.02
			}
		}
	};
}
