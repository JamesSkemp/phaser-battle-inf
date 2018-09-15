import BattleUnit from "./BattleUnit";
import NameGenerator from "./NameGenerator";
import Stats from "./Stats";
import GameStats from "./GameStats";
import Equipment from "./Equipment";
import Utilities from "./Utilities";
import Item from "./Item";
import ItemGenProperties from "./ItemGenProperties";
import Items from "../Data/Items";
import Player from "./Player";
import EquippedItem from "./EquippedItem";

export default class Hero extends BattleUnit {

	public totalExp = 0;

	public trainingAreaIndex = -1;
	public reserve: boolean = true;
	public index = -1;

	public gameStats: GameStats = null;
	public equipment: Equipment;
	public equipmentList: EquippedItem[] = [];

	public actionsRoot;

	public constructor() {
		super();
		this.initBattleUnit();

		this.type = "hero";

		this.name = NameGenerator.randomName(2, 5) + " " + NameGenerator.randomName(2, 5);
		this.stats = new Stats();
		this.totalExp = 0;
		this.baseStats.hp = 50;
		this.baseStats.sp = 10;
		this.baseStats.attack = 1;
		this.baseStats.defense = 1;

		this.trainingAreaIndex = -1;
		this.reserve = true;
		this.index = -1;

		this.gameStats = new GameStats();

		this.equipment = new Equipment();

		this.actionsRoot = {type: "root", actions: [{type: "Select Target", targetType: "Opponent", select: "With Least", stat: "hp"}, {type: "Action", code: "Attack", target: "Selected Opponent"}]};
		this.actionCode = "battle.selectTarget('Opponent', 'With Least', 'hp');if (battle.currentUnitPerformAction('Attack','Selected Opponent')) return;";

		this.buildEquipmentList();
	}

	public setup(index: number, player: Player) {
		this.index = index;

		// Add starting equipment to the hero.
		this.equip(new Item(new ItemGenProperties(1, 1, "hand", "SWORD")), true, player);
		this.equip(new Item(new ItemGenProperties(1, 1, "body", "CHAIN")), true, player);
		this.equip(new Item(new ItemGenProperties(1, 1, "legs", "CHAIN")), true, player);
	}

	public calculateStats() {
		for (const statName of Object.keys(this.baseStats)) {
			this.stats[statName] = this.baseStats[statName];
		}

		for (const slotKey of Object.keys(this.equipment)) {
			const slot = this.equipment[slotKey];
			if (Utilities.isArray(slot)) {
				for (const item of slot) {
					if (item !== null) {
						for (const stat of Object.keys(item.stats)) {
							this.stats[stat] += item.stats[stat];
						}
					}
				}
			} else if (slot !== null) {
				const item = slot;
				for (const stat of Object.keys(item.stats)) {
					this.stats[stat] += item.stats[stat];
				}
			}
		}
	}

	public equip(item: Item, keepInInventory: boolean, player: Player) {
		if (item.level > this.level) {
			// TODO
			console.log("The item is too high a level for the hero to equip.");
			return;
		}

		if (Utilities.isArray(this.equipment[item.type])) {
			const slots = this.equipment[item.type];
			const requiredSlots = Items[item.type][item.subType].slots;
			let spaceFound = false;
			let firstEmptySlot = -1;
			let sequentialSlots = 0;

			// Look for enough sequential slots
			// i is incremented in the body
			for (let i = 0; i < slots.length;) {
				const slotItem = this.equipment[item.type][i];

				if (slotItem === null) {
					if (firstEmptySlot === -1) {
						firstEmptySlot = i;
					}

					sequentialSlots++;
					i++;
				} else {
					firstEmptySlot = -1;
					sequentialSlots = 0;
					i += Items[slotItem.type][slotItem.subType].slots;
				}

				if (sequentialSlots === requiredSlots) {

					this.equipment[item.type][firstEmptySlot] = item;
					spaceFound = true;
					break;
				}
			}

			// No space was found
			if (!spaceFound) {
				for (let i = 0; i < requiredSlots; i++) {
					if (this.equipment[item.type][i] !== null) {
						this.unequip(this.equipment[item.type][i], keepInInventory, player);
					}
				}
				this.equipment[item.type][0] = item;
			}
		} else {
			// Unequip the original item.
			if (this.equipment[item.type] !== null) {
				this.unequip(this.equipment[item.type], keepInInventory, player);
			}

			this.equipment[item.type] = item;
		}

		if (!keepInInventory) {
			player.removeItem(item);
		}

		this.calculateStats();
		this.buildEquipmentList();
	}

	public unequip(item: Item, keepInventory: boolean, player: Player) {
		if (!keepInventory) {
			player.addItem(item);
		}

		// TODO
		console.log("unequip");
		console.log(this.equipment);
		console.log(item);
		// TODO add break;
		/*
        for (var e in this.equipment)
        {
            var slot = this.equipment[e];
            if (isArray(slot))
            {
                for (var j in slot)
                    if (slot[j] === unequipItem)
                        this.equipment[e][j] = null;
            }
            else if (slot !== null)
            {
                if (slot === unequipItem)
                    this.equipment[e] = null;
            }
        }
		*/

		this.calculateStats();
		this.buildEquipmentList();
	}

	public addExp(amount: number) {
		this.exp += amount;
		this.totalExp += amount;
		this.gameStats.totalExp += amount;
	}

	public buildSimpleHeroDisplay() {
		return this.name + " L" + this.level + " (" + this.exp + "/" + Utilities.getExpRequiredForLevel(this.level) + " EXP)\n"
			+ (this.trainingAreaIndex >= 0 ? "   TRAINING\n" : this.reserve ? "   RESERVE\n" : "")
			+ this.stats.hp.toFixed(0) + " " + Utilities.statDisplayString("hp")
			+ " " + this.stats.sp.toFixed(0) + " " + Utilities.statDisplayString("sp")
			+ " " + this.stats.attack.toFixed(0) + " " + Utilities.statDisplayString("attack")
			+ " " + this.stats.defense.toFixed(0) + " " + Utilities.statDisplayString("defense")
			+ " " + this.stats.dexterity.toFixed(0) + " " + Utilities.statDisplayString("dexterity")
			+ " " + this.stats.magic.toFixed(0) + " " + Utilities.statDisplayString("magic") + "\n"
			;
	}

	public buildEquipmentList() {
		this.equipmentList = [
			new EquippedItem("L-HAND", this.equipment.hand[0]),
			new EquippedItem("R-HAND", this.equipment.hand[1]),
			new EquippedItem("HEAD", this.equipment.head),
			new EquippedItem("BODY", this.equipment.body),
			new EquippedItem("HANDS", this.equipment.hands),
			new EquippedItem("LEGS", this.equipment.legs),
			new EquippedItem("FEET", this.equipment.feet),
		];
	}
}
