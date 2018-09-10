export default class Utilities {

	public static isUndefined(object) { return typeof(object) === "undefined"; }
	public static isArray(object) { return Object.prototype.toString.call(object) === "[object Array]"; }
	public static isObject(object) { return Object.prototype.toString.call(object) === "[object Object]"; }
	public static isFunction(object) { return Object.prototype.toString.call(object) === "[object Function]"; }
	public static mergeObjects(a, b) {
		for (const i in b) {
			if (Utilities.isObject(b[i])) {
				a[i] = (b[i].dontMerge ? null : Utilities.mergeObjects({}, b[i]));
			} else if (Utilities.isArray(b[i])) {
				a[i] = Utilities.mergeObjects([], b[i]);
			} else {
				a[i] = b[i];
			}
		}
		return a;
	}

	public static log10(num: number): number {
		return Math.log(num) / Math.LN10;
	}

	public static randomFloat(min: number, max: number): number {
		return min + Math.abs(min - max) * Math.random();
	}

	/**
	 * Returns an integer between two numbers, inclusive.
	 * @param min Minimum number to return.
	 * @param max Maximum number to return.
	 */
	public static randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * ((max + 1) - min) + min);
	}

	public static selectRandom(array) {
		return array[this.randomInt(0, array.length - 1)];
	}

	public static statDisplayString(statName: string): string {
		switch (statName) {
			case "hp": return "HP";
			case "sp": return "SP";
			case "attack": return "ATK";
			case "defense": return "DEF";
			case "dexterity": return "DEX";
			case "magic": return "MAG";
		}
	}

	public static getExpRequiredForLevel(level: number) {
		return 25 + (level - 1) * level * level * 10;
	}

	public static getExpRequiredForSkillLevel(base, mod, level) {
		return Math.floor(base * Math.pow(mod, level) + base * Math.pow(mod, level - 1) * (level - 1));
	}

	public static addNumberCommas(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}
