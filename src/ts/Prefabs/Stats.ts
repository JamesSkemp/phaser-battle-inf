export default class Stats {
	public hp: number = 0;
	public sp: number = 0;
	public attack: number = 0;
	public defense: number = 0;
	public dexterity: number = 0;
	public magic: number = 0;

	public constructor() {
		this.hp = 0;
		this.sp = 0;
		this.attack = 0;
		this.defense = 0;
		this.dexterity = 0;
		this.magic = 0;
	}

	/**
	 * Round all stats down.
	 */
	public floorStats() {
		this.hp = Math.floor(this.hp);
		this.sp = Math.floor(this.sp);
		this.attack = Math.floor(this.attack);
		this.defense = Math.floor(this.defense);
		this.dexterity = Math.floor(this.dexterity);
		this.magic = Math.floor(this.magic);
	}
}
