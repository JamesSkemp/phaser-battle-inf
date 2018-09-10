export default class Items {
	public static body = {
		PLATE: {
			name: "Plate Armor"
			, material: "metal"
			, statModifiers: {
				defense: 0.6
			}
		}
		, CHAIN: {
			name: "Chain Armor"
			, material: "metal"
			, statModifiers: {
				defense: 0.4
				, dexterity: 0.2
			}
		}
		, CLOTH: {
			name: "Cloth Armor"
			, material: "cloth"
			, statModifiers: {
				defense: 0.2
				, magic: 0.4
			}
		}
	};

	public static feet = {
		PLATE: {
			name: "Plate Boots"
			, material: "metal"
			, statModifiers: {
				defense: 0.2
			}
		}
		, CHAIN: {
			name: "Chain Boots"
			, material: "metal"
			, statModifiers: {
				defense: 0.1
				, dexterity: 0.1
			}
		}
		, CLOTH: {
			name: "Cloth Shoes"
			, material: "cloth"
			, statModifiers: {
				defense: 0.1
				, magic: 0.1
			}
		}
	};

	public static hand = {
		// Stats should sum to 1.0
		SWORD: {
			name: "Sword"
			, slots: 1
			, statModifiers: {
				attack: 0.8
				, defense: 0.1
				, dexterity: 0.1
			}
		}
		, TWOHANDED_SWORD: {
			name: "2-Handed Sword"
			, slots: 2
			, statModifiers: {
				attack: 0.9
				, defense: 0.1
			}
		}
		, AXE: {
			name: "Axe"
			, slots: 1
			, statModifiers: {
				attack: 0.9
				, defense: 0.1
			}
		}
		, BATTLE_AXE: {
			name: "Battle Axe"
			, slots: 2
			, statModifiers: {
				attack: 1.0
			}
		}
		, DAGGER: {
			name: "Dagger"
			, slots: 1
			, statModifiers: {
				attack: 0.7
				, defense: 0.1
				, dexterity: 0.2
			}
		}
		, WAND: {
			name: "Wand"
			, slots: 1
			, statModifiers: {
				attack: 0.3
				, dexterity: 0.1
				, magic: 0.6
			}
		}
		, STAFF: {
			name: "Staff"
			, slots: 2
			, statModifiers: {
				attack: 0.3
				, magic: 0.7
			}
		}
	};

	public static hands = {
		PLATE: {
			name: "Plate Gloves"
			, material: "metal"
			, statModifiers: {
				defense: 0.2
			}
		}
		, CHAIN: {
			name: "Chain Gloves"
			, material: "metal"
			, statModifiers: {
				defense: 0.1
				, dexterity: 0.1
			}
		}
		, CLOTH: {
			name: "Cloth Gloves"
			, material: "cloth"
			, statModifiers: {
				defense: 0.1
				, magic: 0.1
			}
		}
	};

	public static head = {
		FULL_HELMET: {
			name: "Plate Helmet"
			, material: "metal"
			, statModifiers: {
				defense: 0.5
			}
		}
		, CAP: {
			name: "Chain Coif"
			, material: "metal"
			, statModifiers: {
				defense: 0.3
				, dexterity: 0.2
			}
		}
		, HAT: {
			name: "Cloth Coif"
			, material: "cloth"
			, statModifiers: {
				defense: 0.2
				, magic: 0.3
			}
		}
	};

	public static legs = {
		PLATE: {
			name: "Plate Leggings"
			, material: "metal"
			, statModifiers: {
				defense: 0.4
			}
		}
		, CHAIN: {
			name: "Chain Leggings"
			, material: "metal"
			, statModifiers: {
				defense: 0.2
				, dexterity: 0.2
			}
		}
		, CLOTH: {
			name: "Cloth Leggings"
			, material: "cloth"
			, statModifiers: {
				defense: 0.1
				, magic: 0.3
			}
		}
	};

}
