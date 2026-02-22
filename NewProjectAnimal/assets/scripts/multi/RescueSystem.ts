import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const RESCUE_TIME_LIMIT = 10.0;

@ccclass('RescueSystem')
export class RescueSystem extends Component {

    private _isRescueActive: boolean = false;
    private _rescueTimer: number = 0;
    private _failedPlayerId: string = '';

    public get isRescueActive(): boolean { return this._isRescueActive; }
    public get rescueTimeRemaining(): number { return Math.max(0, RESCUE_TIME_LIMIT - this._rescueTimer); }

    public startRescue(failedPlayerId: string) {
        this._isRescueActive = true;
        this._rescueTimer = 0;
        this._failedPlayerId = failedPlayerId;
        EventCenter.emit('rescue-start', failedPlayerId, RESCUE_TIME_LIMIT);
    }

    public attemptRescue(rescuerNode: Node, targetBlock: Node): boolean {
        if (!this._isRescueActive) return false;

        // 救援判定：救援者在安全方块上完成救援操作
        const success = this._validateRescue(rescuerNode, targetBlock);
        if (success) {
            this._isRescueActive = false;
            EventCenter.emit('rescue-success', this._failedPlayerId);
        }
        return success;
    }

    private _validateRescue(rescuerNode: Node, targetBlock: Node): boolean {
        // 判定：救援者是否在有效方块上且距离足够近
        const distance = rescuerNode.position.clone().subtract(targetBlock.position).length();
        return distance < 200;
    }

    update(dt: number) {
        if (!this._isRescueActive) return;
        this._rescueTimer += dt;
        if (this._rescueTimer >= RESCUE_TIME_LIMIT) {
            this._isRescueActive = false;
            EventCenter.emit('rescue-timeout', this._failedPlayerId);
        }
    }
}
