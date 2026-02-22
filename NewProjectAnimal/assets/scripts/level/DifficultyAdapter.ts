import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('DifficultyAdapter')
export class DifficultyAdapter extends Component {

    private _consecutiveFailures: number = 0;
    private _difficultyMultiplier: number = 1.0;
    private _isNewbieAdapted: boolean = false;

    public get difficultyMultiplier(): number { return this._difficultyMultiplier; }

    onLoad() {
        EventCenter.on('level-failed', this._onLevelFailed, this);
        EventCenter.on('level-completed', this._onLevelCompleted, this);
    }

    private _onLevelFailed() {
        this._consecutiveFailures++;
        if (this._consecutiveFailures >= 2) {
            this._difficultyMultiplier = Math.max(0.5, this._difficultyMultiplier - 0.15);
            this._isNewbieAdapted = true;
            EventCenter.emit('difficulty-reduced', this._difficultyMultiplier);
        }
    }

    private _onLevelCompleted() {
        if (this._isNewbieAdapted) {
            this._difficultyMultiplier = Math.min(1.0, this._difficultyMultiplier + 0.1);
            if (this._difficultyMultiplier >= 1.0) {
                this._isNewbieAdapted = false;
            }
        }
        this._consecutiveFailures = 0;
    }

    public getDangerBlockRatio(baseRatio: number): number {
        return baseRatio * this._difficultyMultiplier;
    }

    public getSkillCDMultiplier(): number {
        return this._isNewbieAdapted ? 0.7 : 1.0;
    }

    public reset() {
        this._consecutiveFailures = 0;
        this._difficultyMultiplier = 1.0;
        this._isNewbieAdapted = false;
    }

    onDestroy() {
        EventCenter.off('level-failed', this._onLevelFailed, this);
        EventCenter.off('level-completed', this._onLevelCompleted, this);
    }
}
