import BattleUnit from "../Prefabs/BattleUnit";
import Player from "../Prefabs/Player";

export default class Status {
	public static Effects = {
		Paralyzed: {
			name: "Paralyzed"
			, added(unit: BattleUnit, player: Player) {
				player.log('<p class="padding"><b>' + unit.name + '</b> is now <b class="blue_text">paralyzed</b></p>');
			}
			, update(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is <b class="blue_text">paralyzed</b>');
				unit.skipNextTurn = true;
			}
			, removed(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is no longer <b class="blue_text">paralyzed</b>');
			}
		}
		, On_Fire: {
			name: "On Fire"
			, added(unit: BattleUnit, player: Player) {
				player.log('<p class="padding"><b>' + unit.name + '</b> is now <b class="blue_text">on fire!</b></p>');
			}
			, update(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is <b class="blue_text">on fire!</b>');
				unit.receiveDamage({damage: this.power * 5});
			}
			, removed(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is no longer <b class="blue_text">on fire</b>');
			}
		}
		, Poisoned: {
			name: "Poisoned"
			, added(unit: BattleUnit, player: Player) {
				player.log('<p class="padding"><b>' + unit.name + '</b> is now <b class="blue_text">poisoned!</b></p>');
			}
			, update(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is <b class="blue_text">poisoned!</b>');
				unit.receiveDamage({damage: this.power * 5});
			}
			, removed(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + '</b> is no longer <b class="blue_text">poisoned</b>');
			}
		}
		, Attack_Down: {
			name: "Attack Down"
			, added(unit: BattleUnit, player: Player) {
				player.log('<p class="padding"><b>' + unit.name + "</b>'s attack is weakened</p>");
				this.effectAmount = 10;
				unit.battleStats.attack -= this.effectAmount;
			}
			, update(unit: BattleUnit, player: Player) {
				player.log(unit.name + " has decreased attack");
			}
			, removed(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + "</b>'s attack is no longer weakened");
				unit.battleStats.attack += this.effectAmount;
			}
		}
		, Defense_Down: {
			name: "Defense Down"
			, added(unit: BattleUnit, player: Player) {
				player.log('<p class="padding"><b>' + unit.name + "</b>'s defense is weakened</p>");
				this.effectAmount = 10;
				unit.battleStats.defense -= this.effectAmount;
			}
			, update(unit: BattleUnit, player: Player) {
				player.log(unit.name + " has decreased defense");
			}
			, removed(unit: BattleUnit, player: Player) {
				player.log("<b>" + unit.name + "</b>'s defense is no longer weakened");
				unit.battleStats.defense += this.effectAmount;
			}
		}
	};
}
