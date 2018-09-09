export default class ActionCompiler {
	public static compileActions(actions) {
		let code = "";

		for (const action of actions) {
			switch (action.type) {
				case "Condition":
				code += ActionCompiler.compileCondition(action);
				break;
			case "Action":
				code += ActionCompiler.compileAction(action);
				break;
			case "Select Target":
				code += ActionCompiler.compileSelectTarget(action);
				break;
			}
		}

		return code;
	}

	public static compileCondition(condition) {
		let conditionCode = "";

		conditionCode += "if ";

		const functionCode = ActionCompiler.compileFunction(condition);

		conditionCode += "(" + functionCode + ") {";
		conditionCode += ActionCompiler.compileActions(condition.actions);
		conditionCode += "}";

		return conditionCode;
	}

	public static compileFunction(condition) {
		let args = [];
		let functionName = null;

		switch (condition.functionName) {
			case "Stat":
				functionName = "battle.targetStatComp";
				args = [
					ActionCompiler.makeStr(condition.target)
					, ActionCompiler.makeStr(condition.stat)
					, ActionCompiler.makeStr(condition.comp)
					, ActionCompiler.makeStr(condition.constant)
				];
				break;
			case "Status Effected By":
				functionName = "battle.targetHasStatusEffect";
				args = [
					ActionCompiler.makeStr(condition.target)
					, ActionCompiler.makeStr(condition.effect)
				];
				break;
			case "Status Not Effected By":
				functionName = "!battle.targetHasStatusEffect";
				args = [
					ActionCompiler.makeStr(condition.target)
					, ActionCompiler.makeStr(condition.effect)
				];
				break;
		}

		if (functionName !== null) {
			return functionName + "(" + args.join(",") + ")";
		}
	}

	public static compileAction(action) {
		switch (action.code) {
			case "Attack":
			case "Defend":
				return "if (battle.currentUnitPerformAction('" + action.code + "','" + action.target + "')) return;";
			case "Use Skill":
				return "if (battle.currentUnitPerformAction('Use Skill','" + action.target + "', '" + action.skillName + "')) return;";
		}
	}

	public static compileSelectTarget(action) {
		switch (action.select) {
			case "With Status Effect":
				return "battle.selectTarget('" + action.targetType + "', '" + action.select + "', '" + action.effect + "');";
			case "With Least":
			case "With Most":
				return "battle.selectTarget('" + action.targetType + "', '" + action.select + "', '" + action.stat + "');";
			default:
				return "battle.selectTarget('" + action.targetType + "', '" + action.select + "');";
		}
	}

	private static makeStr(text) {
		return "'" + text + "'";
	}
}
