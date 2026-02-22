import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';
import { LevelConfigManager, LevelDef } from './LevelConfig';
import { WorldConfigHelper } from './WorldConfig';

const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    private _currentWorldId: number = 1;
    private _currentLevelIndex: number = 1;
    private _currentLevel: LevelDef | null = null;

    public get currentWorldId(): number { return this._currentWorldId; }
    public get currentLevelIndex(): number { return this._currentLevelIndex; }

    public loadLevel(worldId: number, levelIndex: number) {
        this._currentWorldId = worldId;
        this._currentLevelIndex = levelIndex;
        this._currentLevel = LevelConfigManager.get(worldId, levelIndex);

        if (!this._currentLevel) {
            console.warn(`Level ${worldId}-${levelIndex} not found`);
            return;
        }

        const worldDef = WorldConfigHelper.getById(worldId);
        EventCenter.emit('level-loaded', this._currentLevel, worldDef);
    }

    public completeLevel(score: number): number {
        if (!this._currentLevel) return 0;

        const stars = this._calculateStars(score, this._currentLevel.starThresholds);
        EventCenter.emit('level-completed', this._currentWorldId, this._currentLevelIndex, stars, score);
        return stars;
    }

    private _calculateStars(score: number, thresholds: [number, number, number]): number {
        if (score >= thresholds[2]) return 3;
        if (score >= thresholds[1]) return 2;
        if (score >= thresholds[0]) return 1;
        return 0;
    }

    public getNextLevel(): { worldId: number; levelIndex: number } | null {
        const world = WorldConfigHelper.getById(this._currentWorldId);
        if (!world) return null;

        if (this._currentLevelIndex < world.levelCount) {
            return { worldId: this._currentWorldId, levelIndex: this._currentLevelIndex + 1 };
        }

        const nextWorld = WorldConfigHelper.getById(this._currentWorldId + 1);
        if (nextWorld) {
            return { worldId: nextWorld.id, levelIndex: 1 };
        }

        return null;
    }
}
