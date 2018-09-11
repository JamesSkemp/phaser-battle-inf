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
	public allUnits: BattleUnit[] = [];
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
		const unitList = [];
		for (const unit of units) {
			unitList.push(unit);
			this.allUnits.push(unit);
		}

		this.parties.push({
			livingUnits: unitList,
			deadUnits: []
		});
	}

	public initBattle() {
		for (const party of this.parties) {
			for (const livingUnit of party.livingUnits) {
				livingUnit.initForBattle(this);
			}
		}

		// Initialize the act order.
		for (const unit of this.allUnits) {
			unit.actScore = unit.battleStats.dexterity;
		}

		console.log("Battle Started");
	}

	public nextTurn() {
		this.allUnits.sort(this.unitSorter);
		// TODO remove
		console.log("After sorting");
		for (const unit of this.allUnits) {
			console.log(unit.name + " : " + unit.actScore);
		}

		const performingUnit = this.allUnits[0];

		const performingParty = this.getPartyOfUnit(performingUnit);
		let opposingParty = null;

		if (this.parties[0] === performingParty) {
			opposingParty = this.parties[1];
		} else {
			opposingParty = this.parties[0];
		}

		this.unitTakeTurn(performingUnit, performingParty, opposingParty);

		// TODO I feel like the original logic below isn't that good ...
		for (const unit of this.allUnits) {
			if (unit === performingUnit) {
				unit.actScore -= unit.battleStats.dexterity;
			} else {
				unit.actScore += unit.battleStats.dexterity;
			}
		}

		// TODO remove
		console.log("After actScore changing");
		for (const unit of this.allUnits) {
			console.log(unit.name + " : " + unit.actScore);
		}

		if (this.done) {
			return this.finalizeBattle();
		}
	}

	public unitTakeTurn(unit: BattleUnit, performingParty, opposingParty) {
		this.currentPerformingUnit = unit;
		this.currentPerformingParty = performingParty;
		this.currentOpposingParty = opposingParty;

		this.checkStatusEffects(unit);

		if (unit.skipNextTurn) {
			unit.skipNextTurn = false;
			return;
		}

		// TODO this is super messy.
		let battleFn = function(battle) { };
		eval("battleFn = function(battle) { " + unit.actionCode + "}");
		battleFn(this);
	}

	public checkStatusEffects(unit: BattleUnit) {
		const effectsToRemove = [];

		// Check status effecs and reduce all by 1, remove those at 0
		for (const statusEffect of unit.battleStatusEffects) {
			// TODO
			console.log(statusEffect);
			if (statusEffect) {
				if (statusEffect.turnsRemaining <= 0) {
					effectsToRemove.push(statusEffect.name);
					continue;
				}

				statusEffect.update(unit);

				statusEffect.turnsRemaining--;
			}
		}

		for (const effectToRemove of effectsToRemove) {
			unit.removeStatusEffect(effectToRemove);
		}
	}

	public finalizeBattle() {
		console.log("Battle Over");

		for (const party of this.parties) {
			for (const livingUnit of party.livingUnits) {
				livingUnit.updateAfterBattle();
			}
			for (const deadUnit of party.deadUnits) {
				deadUnit.updateAfterBattle();
			}
		}
	}

	public unitDead(unit: BattleUnit) {
		let partyIndex = 0;
		for (const party of this.parties) {
			partyIndex++;
			let foundUnit = false;

			for (const livingUnit of party.livingUnits) {
				if (livingUnit === unit) {
					foundUnit = true;
					party.livingUnits.splice(party.livingUnits.indexOf(unit), 1);
					party.deadUnits.push(unit);
					break;
				}
			}

			if (foundUnit) {
				// Check if there are any more living units
				if (party.livingUnits.length === 0) {
					this.done = true;
				}
			}

			if (party.livingUnits.length > 0) {
				this.winningIndex = partyIndex; // If the battle is done, this will be set to the winning party
			}
		}

		if (unit["gameStats"]) {
			unit["gameStats"].totalTimesDefeated++;
		}
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
