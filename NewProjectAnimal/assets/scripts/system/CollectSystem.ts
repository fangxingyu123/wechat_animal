import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const DAILY_SNACK_LIMIT = 500;
const MAX_ITEM_STACK = 99;

@ccclass('CollectSystem')
export class CollectSystem extends Component {

    private _snacks: number = 0;
    private _diamonds: number = 0;
    private _dailySnacksEarned: number = 0;
    private _items: Map<string, number> = new Map();

    public get snacks(): number { return this._snacks; }
    public get diamonds(): number { return this._diamonds; }

    public addSnacks(amount: number): number {
        const canAdd = Math.min(amount, DAILY_SNACK_LIMIT - this._dailySnacksEarned);
        if (canAdd <= 0) {
            EventCenter.emit('snack-limit-reached');
            return 0;
        }
        this._snacks += canAdd;
        this._dailySnacksEarned += canAdd;
        EventCenter.emit('snacks-changed', this._snacks, canAdd);
        return canAdd;
    }

    public spendSnacks(amount: number): boolean {
        if (this._snacks < amount) return false;
        this._snacks -= amount;
        EventCenter.emit('snacks-changed', this._snacks, -amount);
        return true;
    }

    public addDiamonds(amount: number) {
        this._diamonds += amount;
        EventCenter.emit('diamonds-changed', this._diamonds, amount);
    }

    public spendDiamonds(amount: number): boolean {
        if (this._diamonds < amount) return false;
        this._diamonds -= amount;
        EventCenter.emit('diamonds-changed', this._diamonds, -amount);
        return true;
    }

    public addItem(itemId: string, count: number = 1): boolean {
        const current = this._items.get(itemId) || 0;
        if (current + count > MAX_ITEM_STACK) return false;
        this._items.set(itemId, current + count);
        EventCenter.emit('item-changed', itemId, current + count);
        return true;
    }

    public useItem(itemId: string): boolean {
        const current = this._items.get(itemId) || 0;
        if (current <= 0) return false;
        this._items.set(itemId, current - 1);
        EventCenter.emit('item-used', itemId, current - 1);
        return true;
    }

    public getItemCount(itemId: string): number {
        return this._items.get(itemId) || 0;
    }

    public resetDaily() {
        this._dailySnacksEarned = 0;
    }

    public loadData(data: any) {
        this._snacks = data.snacks || 0;
        this._diamonds = data.diamonds || 0;
        this._dailySnacksEarned = data.dailySnacksEarned || 0;
        if (data.items) {
            this._items = new Map(Object.entries(data.items));
        }
    }

    public saveData(): any {
        return {
            snacks: this._snacks,
            diamonds: this._diamonds,
            dailySnacksEarned: this._dailySnacksEarned,
            items: Object.fromEntries(this._items),
        };
    }
}
