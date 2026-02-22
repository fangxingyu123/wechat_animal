import { _decorator, Component, Vec3 } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export interface FrameData {
    frame: number;
    playerId: string;
    position: { x: number; y: number };
    action: string;
    params?: any;
}

@ccclass('SyncManager')
export class SyncManager extends Component {

    private _frameCount: number = 0;
    private _localBuffer: FrameData[] = [];
    private _remoteBuffer: FrameData[] = [];
    private _latency: number = 0;

    public get latency(): number { return this._latency; }

    public sendFrame(playerId: string, position: Vec3, action: string, params?: any) {
        const data: FrameData = {
            frame: this._frameCount++,
            playerId,
            position: { x: position.x, y: position.y },
            action,
            params,
        };
        this._localBuffer.push(data);
        // TODO: 通过微信实时对战组件发送帧数据
    }

    public onReceiveFrame(data: FrameData) {
        this._remoteBuffer.push(data);
        this._applyRemoteFrame(data);
    }

    private _applyRemoteFrame(data: FrameData) {
        EventCenter.emit('sync-remote-frame', data);
    }

    public onLatencyUpdate(ms: number) {
        this._latency = ms;
        if (ms > 200) {
            EventCenter.emit('sync-lag-warning', ms);
        }
        if (ms > 500) {
            EventCenter.emit('sync-lag-severe', ms);
        }
    }

    public reset() {
        this._frameCount = 0;
        this._localBuffer.length = 0;
        this._remoteBuffer.length = 0;
    }
}
