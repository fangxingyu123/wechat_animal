import { _decorator, Color, Sprite, Node } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const MARIO_COLORS: Record<number, Color> = {
    [BlockType.MUSHROOM]: new Color(220, 20, 60),
    [BlockType.BRICK]: new Color(205, 133, 63),
    [BlockType.PIPE]: new Color(34, 139, 34),
};

/** 超级玛丽联动方块（仅单人模式生成） */
@ccclass('BlockMario')
export class BlockMario extends BlockBase {

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = MARIO_COLORS[this._type] || Color.RED;
        }
    }

    public onLand(characterNode: Node) {
        switch (this._type) {
            case BlockType.MUSHROOM:
                EventCenter.emit('mario-mushroom', characterNode);
                break;
            case BlockType.BRICK:
                EventCenter.emit('mario-brick', this.node, characterNode);
                break;
            case BlockType.PIPE:
                EventCenter.emit('mario-pipe', this.node, characterNode);
                break;
        }
    }
}
