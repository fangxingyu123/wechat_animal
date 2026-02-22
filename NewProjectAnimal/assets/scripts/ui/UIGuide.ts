import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('UIGuide')
export class UIGuide extends Component {

    @property([Node])
    guideSteps: Node[] = [];

    private _currentStep: number = 0;
    private _isActive: boolean = false;

    public startGuide() {
        this._isActive = true;
        this._currentStep = 0;
        this.node.active = true;
        this._showStep(0);
        EventCenter.emit('guide-started');
    }

    public nextStep() {
        if (!this._isActive) return;
        this._currentStep++;
        if (this._currentStep >= this.guideSteps.length) {
            this.endGuide();
            return;
        }
        this._showStep(this._currentStep);
    }

    private _showStep(index: number) {
        this.guideSteps.forEach((node, i) => {
            node.active = i === index;
        });
        EventCenter.emit('guide-step', index);
    }

    public endGuide() {
        this._isActive = false;
        this.node.active = false;
        EventCenter.emit('guide-completed');
    }
}
