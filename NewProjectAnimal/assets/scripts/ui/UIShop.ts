import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('UIShop')
export class UIShop extends Component {

    @property(Node)
    btnClose: Node | null = null;

    @property(Node)
    itemListContainer: Node | null = null;

    onLoad() {
        this.btnClose?.on(Node.EventType.TOUCH_END, () => this.hide(), this);
    }

    public show() {
        this.node.active = true;
        EventCenter.emit('shop-opened');
    }

    public hide() {
        this.node.active = false;
        EventCenter.emit('shop-closed');
    }

    public onItemClicked(shopItemId: string) {
        EventCenter.emit('shop-buy', shopItemId);
    }
}
