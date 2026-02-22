import { _decorator, Component, Node } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export enum TrapType {
    FALLING_OBJECT,
    WIND_GUST,
    GROUND_SHAKE,
}

@ccclass('TrapSystem')
export class TrapSystem extends Component {

    private _activeTraps: Node[] = [];

    public spawnTrap(type: TrapType, position: any): Node | null {
        // TODO: 根据类型生成陷阱
        return null;
    }

    public checkTrapCollision(characterPos: any): TrapType | null {
        // TODO: 检测角色是否触发陷阱
        return null;
    }

    public clearAll() {
        this._activeTraps.forEach(n => n.destroy());
        this._activeTraps.length = 0;
    }
}
