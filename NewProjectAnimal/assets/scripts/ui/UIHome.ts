import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('UIHome')
export class UIHome extends Component {

    @property(Node)
    btnSinglePlay: Node | null = null;

    @property(Node)
    btnMultiPlay: Node | null = null;

    @property(Node)
    btnShop: Node | null = null;

    @property(Node)
    btnRank: Node | null = null;

    onLoad() {
        this.btnSinglePlay?.on(Node.EventType.TOUCH_END, this._onSinglePlay, this);
        this.btnMultiPlay?.on(Node.EventType.TOUCH_END, this._onMultiPlay, this);
        this.btnShop?.on(Node.EventType.TOUCH_END, this._onShop, this);
        this.btnRank?.on(Node.EventType.TOUCH_END, this._onRank, this);
    }

    private _onSinglePlay() {
        EventCenter.emit('ui-enter-single');
    }

    private _onMultiPlay() {
        EventCenter.emit('ui-enter-multi');
    }

    private _onShop() {
        EventCenter.emit('ui-open-shop');
    }

    private _onRank() {
        EventCenter.emit('ui-open-rank');
    }
}
