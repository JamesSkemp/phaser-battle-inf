import Player from "../Prefabs/Player";

export default class Buildings {
	public static Options = [
		{
			name: "Townhall"
			, single: true
			, space: 5
			, description: "You live and work in the townhall."
			, cost: 0
			, gpm: 20
			, upgradeCost: 10000
			, cannotSell: true
		}, {
			name: "Arena"
			, single: true
			, space: 10
			, description: "Complete challenges here for bonuses."
			, cost: 100000
			, gpm: 200
			, upgradeCost: 100000
			, onBuild(count: number, player: Player) {
				player.unlock.arena = true;
			}
		}, {
			name: "Weapon Smith"
			, single: false
			, space: 1
			, description: "Reduce the cost of weapons, make one more weapon available for purchase. Upgrade to increase the level of weapons produced."
			, cost: 1500
			, gpm: 10
			, upgradeCost: 3000
			, onBuild(count: number, player: Player) {
				player.unlock.shop = true;
			}
		}, {
			name: "Armor Smith"
			, single: false
			, space: 1
			, description: "Reduce the cost of armor, make one more piece of armor available for purchase. Upgrade to increase the level of armor produced."
			, cost: 1500
			, gpm: 10
			, upgradeCost: 3000
			, onBuild(count: number, player: Player) {
				player.unlock.shop = true;
			}
		}, {
			name: "Gemcutter"
			, single: false
			, space: 1
			, description: "Reduce the cost of gems, make one more gem available for purchase. Upgrade to increase the level of gems produced."
			, cost: 2500
			, gpm: 10
			, upgradeCost: 5000
			, onBuild(count: number, player: Player) {
				player.unlock.shop = true;
			}
		}, {
			name: "Market"
			, single: false
			, space: 2
			, description: "Markets increase the chance that a traveling merchant will come to your town and reduces the amount of time for weapons and armor to restock."
			, cost: 1000
			, gpm: 10
			, upgradeCost: 2000
		}, {
			name: "Training Ground"
			, single: false
			, space: 4
			, description: "Train your heroes so that they can increase their stats outside of battle. Upgrade to unlock new training options."
			, cost: 500
			, gpm: 0
			, upgradeCost: 1000
			, onBuild(count: number, player: Player) {
				player.unlock.training = true;
			}
			, onDemolish(index: number, player: Player) {
				player.removeHeroInTraining(index);

				// Correct all other heroes
				for (const hero of player.heroes) {
					if (hero.trainingAreaIndex > index) {
						hero.trainingAreaIndex--;
					}
				}
			}
		}, {
			name: "Housing"
			, single: false
			, space: 1
			, description: "Housing for additional citizens."
			, cost: 250
			, gpm: 5
			, upgradeCost: 500
		}
	];

	public static getBuildingByName(name: string) {
		for (const building of Buildings.Options) {
			if (building.name === name) {
				return building;
			}
		}

		return null;
	}
}
