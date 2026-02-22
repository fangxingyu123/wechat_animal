import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {

    private _score: number = 0;
    private _distance: number = 0;
    private _combo: number = 0;
    private _maxCombo: number = 0;

    public get score(): number { return this._score; }
    public get distance(): number { return this._distance; }
    public get combo(): number { return this._combo; }
    public get maxCombo(): number { return this._maxCombo; }

    onLoad() {
        EventCenter.on('block-landed', this._onBlockLanded, this);
        EventCenter.on('combo-break', this._onComboBreak, this);
    }

    private _onBlockLanded(blockScore: number, isPerfect: boolean) {
        this._combo++;
        if (this._combo > this._maxCombo) {
            this._maxCombo = this._combo;
        }

        const comboMultiplier = 1 + Math.floor(this._combo / 5) * 0.1;
        const addScore = Math.floor(blockScore * comboMultiplier * (isPerfect ? 1.5 : 1));
        this._score += addScore;

        EventCenter.emit('score-updated', this._score, this._combo, addScore);
    }

    private _onComboBreak() {
        this._combo = 0;
        EventCenter.emit('combo-reset');
    }

    public addDistance(delta: number) {
        this._distance += delta;
        EventCenter.emit('distance-updated', this._distance);
    }

    public reset() {
        this._score = 0;
        this._distance = 0;
        this._combo = 0;
        this._maxCombo = 0;
    }

    public getResult() {
        return {
            score: this._score,
            distance: this._distance,
            maxCombo: this._maxCombo,
        };
    }

    onDestroy() {
        EventCenter.off('block-landed', this._onBlockLanded, this);
        EventCenter.off('combo-break', this._onComboBreak, this);
    }
}
