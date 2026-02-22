import { _decorator, Component, Node, Vec3, tween, Sprite, Color } from 'cc';
import { EventCenter } from '../utils/EventCenter';
import { MathUtils } from '../utils/MathUtils';

const { ccclass, property } = _decorator;

export enum CharacterState {
    IDLE,
    CHARGING,
    JUMPING,
    LANDING,
    FALLING,
    DEAD,
}

@ccclass('CharacterBase')
export class CharacterBase extends Component {

    @property
    characterId: string = '';

    protected _state: CharacterState = CharacterState.IDLE;
    protected _isJumping: boolean = false;
    protected _currentBlock: Node | null = null;

    public get state(): CharacterState { return this._state; }

    onLoad() {
        EventCenter.on('jump', this._onJump, this);
        EventCenter.on('charge-start', this._onChargeStart, this);
    }

    private _onChargeStart() {
        if (this._state !== CharacterState.IDLE) return;
        this._state = CharacterState.CHARGING;
    }

    private _onJump(power: number) {
        if (this._state !== CharacterState.CHARGING) return;
        this._state = CharacterState.JUMPING;
        this._performJump(power);
    }

    protected _performJump(power: number) {
        const startPos = this.node.position.clone();
        const jumpDistance = power * 80;
        const jumpHeight = power * 40;
        const duration = 0.3 + power * 0.1;

        const endPos = new Vec3(startPos.x + jumpDistance, startPos.y, startPos.z);

        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            startPos.y + jumpHeight,
            startPos.z
        );

        let elapsed = 0;
        tween(this.node)
            .to(duration, { position: endPos }, {
                onUpdate: (target: any, ratio: number) => {
                    if (ratio === undefined) return;
                    const pos = MathUtils.bezierQuadratic(startPos, controlPoint, endPos, ratio);
                    this.node.setPosition(pos);
                }
            })
            .call(() => {
                this._state = CharacterState.LANDING;
                this._onLandComplete();
            })
            .start();
    }

    protected _onLandComplete() {
        EventCenter.emit('character-landed', this.node);
        this._state = CharacterState.IDLE;
    }

    public setCurrentBlock(block: Node | null) {
        this._currentBlock = block;
    }

    public die() {
        this._state = CharacterState.DEAD;
        EventCenter.emit('character-died', this.characterId);
    }

    onDestroy() {
        EventCenter.off('jump', this._onJump, this);
        EventCenter.off('charge-start', this._onChargeStart, this);
    }
}
