import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export enum MultiState {
    IDLE,
    MATCHING,
    READY,
    PLAYING,
    RESULT,
}

@ccclass('MultiManager')
export class MultiManager extends Component {

    private _state: MultiState = MultiState.IDLE;
    private _roomId: string = '';
    private _isHost: boolean = false;
    private _partnerCharacterId: string = '';

    public get state(): MultiState { return this._state; }
    public get roomId(): string { return this._roomId; }
    public get isHost(): boolean { return this._isHost; }

    public startMatch() {
        this._state = MultiState.MATCHING;
        EventCenter.emit('multi-matching');
        // TODO: 调用微信实时对战组件匹配
    }

    public onMatchSuccess(roomId: string, isHost: boolean) {
        this._roomId = roomId;
        this._isHost = isHost;
        this._state = MultiState.READY;
        EventCenter.emit('multi-matched', roomId);
    }

    public startGame() {
        this._state = MultiState.PLAYING;
        EventCenter.emit('multi-game-start');
    }

    public endGame() {
        this._state = MultiState.RESULT;
        EventCenter.emit('multi-game-end');
    }

    public leaveRoom() {
        this._state = MultiState.IDLE;
        this._roomId = '';
        EventCenter.emit('multi-leave');
    }

    public sendQuickMessage(msgId: number) {
        EventCenter.emit('multi-quick-msg-send', msgId);
    }
}
