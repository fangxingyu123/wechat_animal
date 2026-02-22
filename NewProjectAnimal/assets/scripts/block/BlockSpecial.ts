import { _decorator, Color, Sprite, Node } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const SPECIAL_COLORS: Record<number, Color> = {
    [BlockType.SPEED_UP]: new Color(255, 255, 0),
    [BlockType.SCORE_BONUS]: new Color(255, 215, 0),
    [BlockType.HEART]: new Color(255, 105, 180),
};

@ccclass('BlockSpecial')
export class BlockSpecial extends BlockBase {

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = SPECIAL_COLORS[this._type] || Color.CYAN;
        }
    }

    public onLand(characterNode: Node) {
        switch (this._type) {
            case BlockType.SPEED_UP:
                EventCenter.emit('effect-speed-up', characterNode);
                break;
            case BlockType.SCORE_BONUS:
                EventCenter.emit('effect-score-bonus', characterNode, 50);
                break;
            case BlockType.HEART:
                EventCenter.emit('effect-heart', characterNode);
                break;
        }
    }
}
