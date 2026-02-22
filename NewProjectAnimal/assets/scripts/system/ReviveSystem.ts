import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('ReviveSystem')
export class ReviveSystem extends Component {

    private _freeReviveUsed: boolean = false;
    private _adReviveCount: number = 0;
    private _maxAdRevive: number = 2;

    public canFreeRevive(worldId: number, levelIndex: number, isFirstAttempt: boolean): boolean {
        if (this._freeReviveUsed) return false;
        return worldId === 1 && levelIndex <= 10 && isFirstAttempt;
    }

    public freeRevive(): boolean {
        if (this._freeReviveUsed) return false;
        this._freeReviveUsed = true;
        EventCenter.emit('revive-free');
        return true;
    }

    public canAdRevive(): boolean {
        return this._adReviveCount < this._maxAdRevive;
    }

    public adRevive(): boolean {
        if (!this.canAdRevive()) return false;
        this._adReviveCount++;
        EventCenter.emit('revive-ad');
        // TODO: 触发激励视频广告
        return true;
    }

    public canItemRevive(itemCount: number): boolean {
        return itemCount > 0;
    }

    public itemRevive(): boolean {
        EventCenter.emit('revive-item');
        return true;
    }

    public resetForLevel() {
        this._freeReviveUsed = false;
        this._adReviveCount = 0;
    }
}
