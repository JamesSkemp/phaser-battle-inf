import Stats from "./Stats";
import ItemGenProperties from "./ItemGenProperties";
import Utilities from "./Utilities";

export default class Item {
	public stats: Stats;

	public level: number;
	public rarity: number;
	public type;
	public subType;

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
			// TODO
		}

		if (!genProperties.subType) {
			// TODO
		}

		// TODO

		this.level = genProperties.level;
		this.rarity = genProperties.rarity;
		this.type = genProperties.type;
		this.subType = genProperties.subType;

		// TODO
	}
}
