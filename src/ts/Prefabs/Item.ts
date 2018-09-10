import Stats from "./Stats";
import ItemGenProperties from "./ItemGenProperties";
import Utilities from "./Utilities";
import Items from "../Data/Items";

export default class Item {
	/**
	 * Get all types of items. Based upon where they are equipped.
	 */
	public static getTypes(): string[] {
		// TODO should be cached
		return Object.keys(Items);
	}

	/**
	 * Get all subtypes of a type of items.
	 * @param type Item type to pull for.
	 */
	public static getSubtypes(type: string): string[] {
		// TODO should be cached
		return Object.keys(Items[type]);
	}

	public stats: Stats;

	public level: number;
	public rarity: number;
	public type: string;
	public subType: string;

	public name: string;
	public moneyValue: number;

	public constructor(genProperties: ItemGenProperties) {
		this.stats = new Stats();

		if (!genProperties) {
			genProperties = new ItemGenProperties(0, 0, null, null);
		}

		if (!genProperties.level || genProperties.level < 1) {
			genProperties.level = 1;
		}

		if (!genProperties.rarity) {
			const total = 5;
			const mod = 1.7;
			const max = Math.ceil(Math.pow(2, total * mod));
			const r = Utilities.randomInt(0, max);

			let rarity = 0;

			for (let i = 1; i <= total; i++) {
				if (r <= Math.pow(2, i * mod)) {
					rarity = total - (i - 1);
					break;
				}
			}

			genProperties.rarity = rarity;
		}

		if (!genProperties.type) {
			const itemType = Utilities.randomInt(0, Item.getTypes().length - 1);
			genProperties.type = Item.getTypes()[itemType];
		}

		if (!genProperties.subType) {
			const itemSubtype = Utilities.randomInt(0, Item.getSubtypes(genProperties.type).length - 1);
			genProperties.subType = Item.getSubtypes(genProperties.type)[itemSubtype];
		}

		this.level = genProperties.level;
		this.rarity = genProperties.rarity;
		this.type = genProperties.type;
		this.subType = genProperties.subType;

		let statBase = this.level * 10;

		const itemProperties = Items[this.type][this.subType];
		if (itemProperties.slots) {
			statBase *= itemProperties.slots;
		}

		let totalStats = 0;
		for (const statModifier of Object.keys(itemProperties.statModifiers)) {
			this.stats[statModifier] += itemProperties.statModifiers[statModifier] * statBase;
			this.stats[statModifier] *= Utilities.randomFloat(0.8, 1.2) + (this.rarity * 0.2);
			this.stats[statModifier] = Math.round(this.stats[statModifier]);
			totalStats += this.stats[statModifier];
		}

		this.name = itemProperties.name;

		this.moneyValue = totalStats * this.level * this.rarity;

		// TODO
	}
}
