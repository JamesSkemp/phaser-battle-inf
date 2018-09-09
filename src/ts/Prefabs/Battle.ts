import BattleActions from "./BattleActions";
import Party from "./Party";
import BattleUnit from "./BattleUnit";

export default class Battle extends BattleActions {
	// Won't be necessary once mergeObjects is refactored.
	public dontMerge = true;

	public parties: Party[] = [];
	/**
	 * All units in the battle. Determines action order.
	 */
	public allUnits = [];
	public round: number = 0;
	public level: number = 0;
	public done = false;
	public winningIndex = 0;

	public constructor() {
		super();
		this.parties = [];
		this.allUnits = [];
		this.round = 0;
		this.level = 0;
		this.done = false;
		this.winningIndex = 0;
	}

	public addParty(units) {
		let unitList = [];
		for (const i of units) {
			unitList.push(units[i]);
			this.allUnits.push(units[i]);
		}

		this.parties.push({
			livingUnits: unitList,
			deadUnits: []
		});
	}

	/**
	 * Sorts units in a descending order.
	 * @param a First unit to compare.
	 * @param b Second unit to compare.
	 */
	public unitSorter(a: BattleUnit, b: BattleUnit) {
		return b.actScore - a.actScore;
	}

	public getPartyOfUnit(unit) {
		for (const party of this.parties) {
			for (const i in party.livingUnits) {
				if (party.livingUnits[i] === unit) {
					return party;
				}
			}

			for (const j in party.deadUnits) {
				if (party.deadUnits[j] === unit) {
					return party;
				}
			}
		}
	}
}
