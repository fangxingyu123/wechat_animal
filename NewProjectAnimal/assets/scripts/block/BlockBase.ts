import { _decorator, Component, Node, Color, Sprite, UITransform, Size, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

export enum BlockType {
    NORMAL = 0,
    SPEED_UP = 1,
    SCORE_BONUS = 2,
    HEART = 3,
    SPIKE = 10,
    SLIPPERY = 11,
    VANISH = 12,
    MUSHROOM = 20,
    BRICK = 21,
    PIPE = 22,
    MULTI_SYNC = 30,
    MULTI_SEESAW = 31,
    MULTI_SWITCH = 32,
    MULTI_MAGNET = 33,
}

@ccclass('BlockBase')
export class BlockBase extends Component {

    protected _type: BlockType = BlockType.NORMAL;
    protected _isActive: boolean = true;

    public get type(): BlockType { return this._type; }
    public get isActive(): boolean { return this._isActive; }

    public init(type: BlockType) {
        this._type = type;
        this._isActive = true;
        this._applyVisual();
    }

    protected _applyVisual() {
        // 子类覆写，设置占位色块颜色
    }

    public onLand(characterNode: Node) {
        // 角色落到此方块上时的效果，子类覆写
    }

    public onLeave(characterNode: Node) {
        // 角色离开此方块时的效果，子类覆写
    }

    public reset() {
        this._isActive = true;
    }

    public deactivate() {
        this._isActive = false;
    }
}
