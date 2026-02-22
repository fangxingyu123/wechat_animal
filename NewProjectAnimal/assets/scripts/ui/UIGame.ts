import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {

    @property(Label)
    scoreLabel: Label | null = null;

    @property(Label)
    comboLabel: Label | null = null;

    @property(Label)
    distanceLabel: Label | null = null;

    @property(ProgressBar)
    chargeBar: ProgressBar | null = null;

    @property(ProgressBar)
    skillCDBar: ProgressBar | null = null;

    @property(Node)
    btnPause: Node | null = null;

    @property(Node)
    btnSkill: Node | null = null;

    onLoad() {
        EventCenter.on('score-updated', this._onScoreUpdated, this);
        EventCenter.on('distance-updated', this._onDistanceUpdated, this);
        EventCenter.on('charge-update', this._onChargeUpdate, this);
        EventCenter.on('combo-reset', this._onComboReset, this);

        this.btnPause?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-pause'), this);
        this.btnSkill?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-use-skill'), this);
    }

    private _onScoreUpdated(score: number, combo: number, addScore: number) {
        if (this.scoreLabel) this.scoreLabel.string = String(score);
        if (this.comboLabel) {
            this.comboLabel.string = combo > 1 ? `${combo} Combo!` : '';
        }
    }

    private _onDistanceUpdated(distance: number) {
        if (this.distanceLabel) this.distanceLabel.string = `${Math.floor(distance)}m`;
    }

    private _onChargeUpdate(ratio: number) {
        if (this.chargeBar) this.chargeBar.progress = ratio;
    }

    private _onComboReset() {
        if (this.comboLabel) this.comboLabel.string = '';
    }

    public updateSkillCD(ratio: number) {
        if (this.skillCDBar) this.skillCDBar.progress = 1 - ratio;
    }

    onDestroy() {
        EventCenter.off('score-updated', this._onScoreUpdated, this);
        EventCenter.off('distance-updated', this._onDistanceUpdated, this);
        EventCenter.off('charge-update', this._onChargeUpdate, this);
        EventCenter.off('combo-reset', this._onComboReset, this);
    }
}
