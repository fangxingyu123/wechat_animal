import { _decorator, Sprite, Color, Node, tween, Vec3 } from 'cc';
import { EnemyBase, EnemyType } from './EnemyBase';

const { ccclass, property } = _decorator;

/** 飞毛球鹦鹉 — 在空中飞行的敌人，需要时机躲避 */
@ccclass('EnemyParrot')
export class EnemyParrot extends EnemyBase {

    @property
    flyHeight: number = 150;

    @property
    flySpeed: number = 2.0;

    onLoad() {
        this._type = EnemyType.PARROT;
        this._moveSpeed = 120;
        const sprite = this.getComponent(Sprite);
        if (sprite) sprite.color = new Color(0, 191, 255);
    }

    start() {
        this._startFlyPattern();
    }

    private _startFlyPattern() {
        const startY = this.node.position.y;
        tween(this.node)
            .repeatForever(
                tween()
                    .to(this.flySpeed, { position: new Vec3(this.node.position.x, startY + this.flyHeight, 0) })
                    .to(this.flySpeed, { position: new Vec3(this.node.position.x, startY, 0) })
            )
            .start();
    }

    public onHitByCharacter(characterNode: Node) {
        this.die();
    }
}
