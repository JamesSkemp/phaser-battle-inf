export default class InventoryActionCompiler {
	public static compileActions(actions): string {
		let code = "";

		for (const action of actions) {
			switch (action.type) {
				case "Condition":
					code += this.compileCondition(action);
					break;
				case "Sell":
					code += this.compileSell(action);
					break;
			}
		}

		return code;
	}

	public static compileCondition(condition): string {
		let conditionCode = "";

		conditionCode += "if ";

		const functionCode = this.compileFunction(condition);

		conditionCode += "(" + functionCode + ") {";
		conditionCode += this.compileActions(condition.actions);
		conditionCode += "}";

		return conditionCode;
	}

	public static compileFunction(condition): string {
		let args = [];
		let functionName = null;

		switch (condition.condition) {
			case "Rarity":
				functionName = "player.itemComp";
				args = [
					"item" // The item variable
					, this.makeStr("rarity")
					, this.makeStr(condition.comp)
					, condition.rarity
				];
				break;
			case "Level":
				functionName = "player.itemComp";
				args = [
					"item" // The item variable
					, this.makeStr("level")
					, this.makeStr(condition.comp)
					, condition.level
				];
				break;
		}

		if (functionName !== null) {
			return functionName + "(" + args.join(",") + ")";
		}
	}

	public static makeStr(text): string {
		return "'" + text + "'";
	}

	public static compileSell(action): string {
		return "result='sell'; return;";
	}
}
