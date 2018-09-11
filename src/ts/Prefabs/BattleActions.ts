export default class BattleActions {
	public currentPerformingUnit = null;
	public currentPerformingParty = null;
	public currentOpposingParty = null;

	public selectedOpponent = null;
	public selectedAlly = null;

	public currentUnitPerformAction(action, targetSelector, extra1) {
		const target = this.getTargetFromSelector(targetSelector);

		if (!target) {
			return false;
		}

		// TODO should the second and third be else if?
		// Perform the action
		if (action === "Attack") {
			this.currentPerformingUnit.attack(target, 1);
		}
		if (action === "Defend") {
			this.currentPerformingUnit.defend();
		}
		if (action === "Use Skill") { // Skills can return false if the unit does not have the SP
			return this.currentPerformingUnit.useSkillOn(extra1, target);
		}

		return true;
	}

	public getTargetFromSelector(targetSelector: string) {
		let target = null;

		if (targetSelector === "Self") {
			target = this.currentPerformingUnit;
		} else if (targetSelector === "Selected Opponent") {
			target = this.selectedOpponent;
		} else if (targetSelector === "Selected Ally") {
			target = this.selectedAlly;
		}

		return target;
	}

	public selectTarget(type, selector, extra1) {
		let units = [];

		if (type === "Ally") {
			units = this.currentPerformingParty.livingUnits;
		} else if (type === "Opponent") {
			units = this.currentOpposingParty.livingUnits;
		}

		let selectedUnit = null;

		switch (selector) {
			case "With Most":
				selectedUnit = this.findUnitWithExtremeStat(units, extra1, "max");
				break;
			case "With Least":
				selectedUnit = this.findUnitWithExtremeStat(units, extra1, "min");
				break;
			case "With Status Effect":
				selectedUnit = this.findUnitWithStatusEffect(units, extra1);
				break;
		}

		// Decide which unit selection to set
		if (type === "Ally") {
			this.selectedAlly = selectedUnit;
		} else if (type === "Opponent") {
			this.selectedOpponent = selectedUnit;
		}
	}

	public findUnitWithExtremeStat(units, stat, extreme) {
		// TODO verify that this is correct
		// Always at least select the first unit
		// Could be that all units are dead
		if (units.length > 0) {
			let selectedUnit = units[0];

			let currentValue = units[0].battleStats[stat];
			for (const unit of units) {
				if (extreme === "max" && unit.battleStats[stat] > currentValue) {
					selectedUnit = unit;
					currentValue = unit.battleStats[stat];
				} else if (extreme === "min" && unit.battleStats[stat] < currentValue) {
					selectedUnit = unit;
					currentValue = unit.battleStats[stat];
				}
			}

			return selectedUnit;
		}

		return null;
	}

	public findUnitWithStatusEffect(units, effectName) {
		for (const unit of units) {
			if (unit.hasStatusEffect(effectName)) {
				return unit;
			}
		}

		return null;
	}

	public targetStatComp(targetSelector, stat, comp: string, constant): boolean {
		const target = this.getTargetFromSelector(targetSelector);

		if (target !== null) {
			let percent = target.battleStats[stat] / (target.battleStatsMax[stat] * 1.0);
			percent = Math.round(percent * 100);
			constant = parseInt(constant, 10);

			switch (comp) {
				case "<":
					return percent < constant;
					break;
				case ">":
					return percent > constant;
					break;
			}
		}
	}

	public targetHasStatusEffect(targetSelector, effectName): boolean {
		const target = this.getTargetFromSelector(targetSelector);

		if (target !== null) {
			if (target.battleStatusEffects[effectName]) {
				return true;
			}
		}

		return false;
	}
}
