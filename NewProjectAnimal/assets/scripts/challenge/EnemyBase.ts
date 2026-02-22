import { _decorator, Component, Node, Vec3 } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export enum EnemyType {
    HAMSTER = 'hamster',
    PARROT = 'parrot',
    SUCCULENT = 'succulent',
}

@ccclass('EnemyBase')
export class EnemyBase extends Component {

    protected _type: EnemyType = EnemyType.HAMSTER;
    protected _isAlive: boolean = true;
    protected _moveSpeed: number = 100;
    protected _damage: number = 1;

    public get type(): EnemyType { return this._type; }
    public get isAlive(): boolean { return this._isAlive; }

    public init(type: EnemyType) {
        this._type = type;
        this._isAlive = true;
    }

    public onHitByCharacter(characterNode: Node) {
        // 被角色碰撞时的逻辑，子类覆写
    }

    public onContactCharacter(characterNode: Node) {
        if (!this._isAlive) return;
        EventCenter.emit('enemy-contact', this._type, characterNode, this._damage);
    }

    public die() {
        this._isAlive = false;
        EventCenter.emit('enemy-died', this._type, this.node);
    }

    public reset() {
        this._isAlive = true;
    }
}
