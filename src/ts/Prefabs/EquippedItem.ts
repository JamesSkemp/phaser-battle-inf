import Item from "./Item";
import Utilities from "./Utilities";

export default class EquippedItem {
	public displayName: string;
	public item: Item = null;

	public constructor(displayName: string, item: Item) {
		this.displayName = displayName;
		this.item = item;
	}

	public display(): string {
		return this.displayName + " : " + (this.item !== null ? this.item.display() : "Empty");
	}
}
