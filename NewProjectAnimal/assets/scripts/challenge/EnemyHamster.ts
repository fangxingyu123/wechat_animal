import { _decorator, Sprite, Color, Node } from 'cc';
import { EnemyBase, EnemyType } from './EnemyBase';

const { ccclass, property } = _decorator;

/** 刺球仓鼠 — 不可踩，需要通过跳跃躲避或使用技能消除 */
@ccclass('EnemyHamster')
export class EnemyHamster extends EnemyBase {

    onLoad() {
        this._type = EnemyType.HAMSTER;
        this._moveSpeed = 80;
        const sprite = this.getComponent(Sprite);
        if (sprite) sprite.color = new Color(169, 169, 169);
    }

    public onHitByCharacter(characterNode: Node) {
        // 刺球仓鼠不可踩，直接造成伤害
        this.onContactCharacter(characterNode);
    }
}
