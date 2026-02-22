import { _decorator, Component, Node, Vec3, math } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Node)
    target: Node | null = null;

    @property
    followSpeed: number = 5.0;

    @property
    offsetX: number = 0;

    @property
    offsetY: number = 3;

    private _targetPos: Vec3 = new Vec3();

    update(dt: number) {
        if (!this.target) return;

        const targetWorldPos = this.target.worldPosition;
        this._targetPos.set(
            targetWorldPos.x + this.offsetX,
            Math.max(targetWorldPos.y + this.offsetY, this.node.worldPosition.y),
            this.node.worldPosition.z
        );

        const currentPos = this.node.worldPosition.clone();
        Vec3.lerp(currentPos, currentPos, this._targetPos, dt * this.followSpeed);
        this.node.setWorldPosition(currentPos);
    }

    public resetPosition(pos: Vec3) {
        this.node.setWorldPosition(pos.x + this.offsetX, pos.y + this.offsetY, this.node.worldPosition.z);
    }
}
