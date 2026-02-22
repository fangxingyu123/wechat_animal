import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('BossBase')
export class BossBase extends Component {

    @property
    bossId: string = '';

    @property
    maxHp: number = 10;

    @property
    attackInterval: number = 3.0;

    protected _hp: number = 0;
    protected _isActive: boolean = false;
    protected _attackTimer: number = 0;

    public get hp(): number { return this._hp; }
    public get hpRatio(): number { return this.maxHp > 0 ? this._hp / this.maxHp : 0; }

    public activate() {
        this._hp = this.maxHp;
        this._isActive = true;
        this._attackTimer = 0;
        EventCenter.emit('boss-activated', this.bossId);
    }

    public takeDamage(amount: number) {
        if (!this._isActive) return;
        this._hp = Math.max(0, this._hp - amount);
        EventCenter.emit('boss-damaged', this.bossId, this._hp, this.maxHp);

        if (this._hp <= 0) {
            this._onDefeated();
        }
    }

    protected _onDefeated() {
        this._isActive = false;
        EventCenter.emit('boss-defeated', this.bossId);
    }

    protected _performAttack() {
        // 子类覆写具体攻击模式
    }

    update(dt: number) {
        if (!this._isActive) return;
        this._attackTimer += dt;
        if (this._attackTimer >= this.attackInterval) {
            this._attackTimer = 0;
            this._performAttack();
        }
    }
}
