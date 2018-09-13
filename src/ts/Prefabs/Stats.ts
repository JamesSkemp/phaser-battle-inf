export default class Stats {
	/**
	 * Determine the difference between two Stats. First - Second.
	 * @param statsA First set of stats.
	 * @param statsB Second set of stats.
	 */
	public static getStatDifference(statsA: Stats, statsB: Stats): Stats {
		const statsC = new Stats();

		for (const stat of Object.keys(statsA)) {
			statsC[stat] = statsA[stat] - statsB[stat];
		}
		return statsC;
	}

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
}
