import { _decorator, Color, Sprite, Node } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const MULTI_COLORS: Record<number, Color> = {
    [BlockType.MULTI_SYNC]: new Color(138, 43, 226),
    [BlockType.MULTI_SEESAW]: new Color(255, 140, 0),
    [BlockType.MULTI_SWITCH]: new Color(0, 206, 209),
    [BlockType.MULTI_MAGNET]: new Color(199, 21, 133),
};

/** 多人专属方块 */
@ccclass('BlockMulti')
export class BlockMulti extends BlockBase {

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = MULTI_COLORS[this._type] || Color.MAGENTA;
        }
    }

    public onLand(characterNode: Node) {
        switch (this._type) {
            case BlockType.MULTI_SYNC:
                EventCenter.emit('multi-sync-block', this.node, characterNode);
                break;
            case BlockType.MULTI_SEESAW:
                EventCenter.emit('multi-seesaw', this.node, characterNode);
                break;
            case BlockType.MULTI_SWITCH:
                EventCenter.emit('multi-switch', this.node, characterNode);
                break;
            case BlockType.MULTI_MAGNET:
                EventCenter.emit('multi-magnet', this.node, characterNode);
                break;
        }
    }
}
