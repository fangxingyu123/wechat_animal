import { _decorator, Color, Sprite, Node, tween, Vec3 } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const DANGER_COLORS: Record<number, Color> = {
    [BlockType.SPIKE]: new Color(128, 128, 128),
    [BlockType.SLIPPERY]: new Color(100, 149, 237),
    [BlockType.VANISH]: new Color(200, 200, 200, 150),
};

@ccclass('BlockDanger')
export class BlockDanger extends BlockBase {

    @property
    vanishDelay: number = 1.0;

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = DANGER_COLORS[this._type] || Color.RED;
        }
    }

    public onLand(characterNode: Node) {
        switch (this._type) {
            case BlockType.SPIKE:
                EventCenter.emit('danger-spike', characterNode);
                break;
            case BlockType.SLIPPERY:
                EventCenter.emit('danger-slippery', characterNode);
                break;
            case BlockType.VANISH:
                this._startVanish();
                break;
        }
    }

    private _startVanish() {
        tween(this.node)
            .delay(this.vanishDelay)
            .call(() => {
                this.deactivate();
                EventCenter.emit('block-vanished', this.node);
            })
            .start();
    }
}
