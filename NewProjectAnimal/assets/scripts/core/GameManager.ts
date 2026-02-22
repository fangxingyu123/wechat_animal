import { _decorator, Component, director } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export enum GameState {
    NONE,
    LOADING,
    HOME,
    PLAYING,
    PAUSED,
    REVIVING,
    RESULT,
}

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager | null = null;
    public static get instance(): GameManager | null { return this._instance; }

    private _state: GameState = GameState.NONE;
    public get state(): GameState { return this._state; }

    onLoad() {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
    }

    public changeState(newState: GameState) {
        const oldState = this._state;
        this._state = newState;
        EventCenter.emit('game-state-changed', newState, oldState);
    }

    public startGame(isMulti: boolean = false) {
        this.changeState(GameState.PLAYING);
    }

    public pauseGame() {
        this.changeState(GameState.PAUSED);
    }

    public resumeGame() {
        this.changeState(GameState.PLAYING);
    }

    public endGame() {
        this.changeState(GameState.RESULT);
    }

    onDestroy() {
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }
    }
}
