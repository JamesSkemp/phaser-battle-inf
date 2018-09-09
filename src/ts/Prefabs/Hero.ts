import BattleUnit from "./BattleUnit";
import NameGenerator from "./NameGenerator";
import Stats from "./Stats";
import GameStats from "./GameStats";
import Equipment from "./Equipment";

export default class Hero extends BattleUnit {

	public totalExp = 0;

	public trainingAreaIndex = -1;
	public reserve: boolean = true;
	public index = -1;

	public gameStats: GameStats = null;
	public equipment: Equipment;

	public actionsRoot;

	public constructor() {
		super();
		this.initBattleUnit();

		this.type = "hero";

		this.name = NameGenerator.randomName(2, 5) + " " + NameGenerator.randomName(2, 5);
		this.stats = new Stats();
		this.totalExp = 0;
		this.baseStats.hp = 50;
		this.baseStats.sp = 10;
		this.baseStats.attack = 1;
		this.baseStats.defense = 1;

		this.trainingAreaIndex = -1;
		this.reserve = true;
		this.index = -1;

		this.gameStats = new GameStats();

		this.equipment = new Equipment();

		this.actionsRoot = {type: "root", actions: [{type: "Select Target", targetType: "Opponent", select: "With Least", stat: "hp"}, {type: "Action", code: "Attack", target: "Selected Opponent"}]};
		this.actionCode = "battle.selectTarget('Opponent', 'With Least', 'hp');if (battle.currentUnitPerformAction('Attack','Selected Opponent')) return;";
	}

	public setup(index: number) {
		this.index = index;

		// TODO
	}
}
