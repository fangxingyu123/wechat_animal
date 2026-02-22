import { _decorator, Sprite, Color, Node, tween, Vec3 } from 'cc';
import { EnemyBase, EnemyType } from './EnemyBase';

const { ccclass, property } = _decorator;

/** 伸缩多肉 — 周期性伸缩，伸出时阻挡通行 */
@ccclass('EnemySucculent')
export class EnemySucculent extends EnemyBase {

    @property
    extendDuration: number = 1.5;

    @property
    retractDuration: number = 1.0;

    private _isExtended: boolean = false;

    onLoad() {
        this._type = EnemyType.SUCCULENT;
        const sprite = this.getComponent(Sprite);
        if (sprite) sprite.color = new Color(50, 205, 50);
    }

    start() {
        this._startCycle();
    }

    private _startCycle() {
        tween(this.node)
            .repeatForever(
                tween()
                    .call(() => { this._isExtended = true; })
                    .to(0.3, { scale: new Vec3(1, 1.8, 1) })
                    .delay(this.extendDuration)
                    .call(() => { this._isExtended = false; })
                    .to(0.3, { scale: new Vec3(1, 1, 1) })
                    .delay(this.retractDuration)
            )
            .start();
    }

    public onHitByCharacter(characterNode: Node) {
        if (this._isExtended) {
            this.onContactCharacter(characterNode);
        }
    }
}
