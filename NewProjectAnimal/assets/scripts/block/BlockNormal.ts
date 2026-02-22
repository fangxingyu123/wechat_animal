import { _decorator, Color, Sprite } from 'cc';
import { BlockBase, BlockType } from './BlockBase';

const { ccclass, property } = _decorator;

@ccclass('BlockNormal')
export class BlockNormal extends BlockBase {

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = Color.WHITE;
        }
    }
}
