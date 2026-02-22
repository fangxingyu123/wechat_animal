import { _decorator, Component, Label, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('UIResult')
export class UIResult extends Component {

    @property(Label)
    finalScoreLabel: Label | null = null;

    @property(Label)
    maxComboLabel: Label | null = null;

    @property(Label)
    starsLabel: Label | null = null;

    @property(Node)
    btnRetry: Node | null = null;

    @property(Node)
    btnNext: Node | null = null;

    @property(Node)
    btnHome: Node | null = null;

    @property(Node)
    btnShare: Node | null = null;

    onLoad() {
        this.btnRetry?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-retry'), this);
        this.btnNext?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-next-level'), this);
        this.btnHome?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-go-home'), this);
        this.btnShare?.on(Node.EventType.TOUCH_END, () => EventCenter.emit('ui-share-result'), this);
    }

    public show(data: { score: number; maxCombo: number; stars: number }) {
        this.node.active = true;
        if (this.finalScoreLabel) this.finalScoreLabel.string = String(data.score);
        if (this.maxComboLabel) this.maxComboLabel.string = `最高连击: ${data.maxCombo}`;
        if (this.starsLabel) this.starsLabel.string = '★'.repeat(data.stars) + '☆'.repeat(3 - data.stars);

        if (this.btnNext) this.btnNext.active = data.stars > 0;
    }

    public hide() {
        this.node.active = false;
    }
}
