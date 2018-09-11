import Player from "../Prefabs/Player";

export default class Upgrades {
	public Options = [
		{
			name: "Inventory Space"
			, description: "Increase your inventory space by 5"
			, maxValue: 100
			, currentValue(player: Player) {
				return player.inventoryMax;
			}
			, nextValueFunction(player: Player) {
				return this.currentValue(player) + 5;
			}
			, nextValueCostFunction(player: Player) {
				return Math.pow(this.currentValue(player), 2) * 5;
			}
			, upgradeFunction(player: Player) {
				player.inventoryMax = this.nextValueFunction(player);
			}
		}
		, {
			name: "Heroes"
			, description: "Recruit an additional hero"
			, maxValue: 8
			, currentValue(player: Player) {
				return player.heroes.length;
			}
			, nextValueFunction(player: Player) {
				return this.currentValue(player) + 1;
			}
			, nextValueCostFunction(player: Player) {
				return Math.pow(this.currentValue(player) * 10, 2) * 10;
			}
			, upgradeFunction(player: Player) {
				player.createNewHero();
			}
		}
	];
}
