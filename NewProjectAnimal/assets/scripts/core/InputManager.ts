import { _decorator, Component, Node, EventTouch, UITransform, Vec2, sys } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const MAX_CHARGE_TIME = 2.0;
const MIN_JUMP_POWER = 1;
const MAX_JUMP_POWER = 4;

@ccclass('InputManager')
export class InputManager extends Component {

    @property(Node)
    jumpButton: Node | null = null;

    private _isCharging: boolean = false;
    private _chargeTime: number = 0;
    private _enabled: boolean = true;

    onLoad() {
        this._registerEvents();
    }

    private _registerEvents() {
        if (this.jumpButton) {
            this.jumpButton.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.jumpButton.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.jumpButton.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        }
    }

    private _onTouchStart(event: EventTouch) {
        if (!this._enabled) return;
        this._isCharging = true;
        this._chargeTime = 0;
        EventCenter.emit('charge-start');
    }

    private _onTouchEnd(event: EventTouch) {
        if (!this._isCharging) return;
        this._isCharging = false;

        const ratio = Math.min(this._chargeTime / MAX_CHARGE_TIME, 1.0);
        const power = MIN_JUMP_POWER + ratio * (MAX_JUMP_POWER - MIN_JUMP_POWER);

        EventCenter.emit('jump', power);

        if (ratio >= 1.0) {
            this._vibrateShort();
        }

        this._chargeTime = 0;
    }

    update(dt: number) {
        if (!this._isCharging) return;
        this._chargeTime += dt;

        const ratio = Math.min(this._chargeTime / MAX_CHARGE_TIME, 1.0);
        EventCenter.emit('charge-update', ratio);

        if (this._chargeTime >= MAX_CHARGE_TIME && this._isCharging) {
            this._vibrateShort();
        }
    }

    private _vibrateShort() {
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            (window as any).wx?.vibrateShort({ type: 'light' });
        }
    }

    public setEnabled(enabled: boolean) {
        this._enabled = enabled;
        if (!enabled) {
            this._isCharging = false;
            this._chargeTime = 0;
        }
    }

    onDestroy() {
        if (this.jumpButton) {
            this.jumpButton.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.jumpButton.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.jumpButton.off(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        }
    }
}
