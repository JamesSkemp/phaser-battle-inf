export default class BattleActions {
	public currentPerformingParty = null;
	public currentPerformingUnit = null;

	public selectedOpponent = null;
	public selectedAlly = null;

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
}
