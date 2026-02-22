import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';
import { CollectSystem } from './CollectSystem';

const { ccclass, property } = _decorator;

export interface ShopItem {
    id: string;
    name: string;
    desc: string;
    costType: 'snack' | 'diamond';
    costAmount: number;
    itemType: string;
    itemId: string;
    itemCount: number;
    dailyLimit: number;
}

@ccclass('ShopSystem')
export class ShopSystem extends Component {

    @property(CollectSystem)
    collectSystem: CollectSystem | null = null;

    private _shopItems: ShopItem[] = [];
    private _dailyPurchaseCount: Map<string, number> = new Map();

    public init(items: ShopItem[]) {
        this._shopItems = items;
    }

    public getShopItems(): ShopItem[] {
        return this._shopItems;
    }

    public purchase(shopItemId: string): boolean {
        const item = this._shopItems.find(s => s.id === shopItemId);
        if (!item || !this.collectSystem) return false;

        const purchased = this._dailyPurchaseCount.get(shopItemId) || 0;
        if (item.dailyLimit > 0 && purchased >= item.dailyLimit) {
            EventCenter.emit('shop-limit-reached', shopItemId);
            return false;
        }

        let success = false;
        if (item.costType === 'snack') {
            success = this.collectSystem.spendSnacks(item.costAmount);
        } else {
            success = this.collectSystem.spendDiamonds(item.costAmount);
        }

        if (success) {
            this.collectSystem.addItem(item.itemId, item.itemCount);
            this._dailyPurchaseCount.set(shopItemId, purchased + 1);
            EventCenter.emit('shop-purchased', shopItemId);
        }
        return success;
    }

    public resetDaily() {
        this._dailyPurchaseCount.clear();
    }
}
