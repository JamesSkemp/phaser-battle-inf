export default class ItemGenProperties {
	public level: number;
	public rarity: number;
	public type: string;
	public subType: string;

	public constructor(level: number, rarity: number, type: string, subType: string) {
		this.level = level;
		this.rarity = rarity;
		this.type = type;
		this.subType = subType;
	}
}
