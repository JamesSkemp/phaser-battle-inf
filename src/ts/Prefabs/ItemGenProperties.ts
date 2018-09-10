export default class ItemGenProperties {
	public level: number;
	public rarity: number;
	/**
	 * Type of item, which is generally where it is equipped.
	 */
	public type: string;
	/**
	 * Subtype of item, which is generally what it is made of.
	 */
	public subType: string;

	public constructor(level: number, rarity: number, type: string, subType: string) {
		this.level = level;
		this.rarity = rarity;
		this.type = type;
		this.subType = subType;
	}
}
