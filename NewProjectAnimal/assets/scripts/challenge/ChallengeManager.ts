import { _decorator, Component, Node, Prefab } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export interface ChallengeConfig {
    type: string;
    minLevel: number;
    weight: number;
    params: Record<string, any>;
}

@ccclass('ChallengeManager')
export class ChallengeManager extends Component {

    private _activeChallenges: Node[] = [];
    private _playerFailCount: number = 0;

    public generateChallenge(worldId: number, levelIndex: number, difficulty: number): ChallengeConfig | null {
        const pool = this._getChallengePool(worldId, levelIndex);
        if (pool.length === 0) return null;

        const adjusted = this._applyDifficultyAdaptation(pool, difficulty);
        return this._weightedRandom(adjusted);
    }

    private _getChallengePool(worldId: number, levelIndex: number): ChallengeConfig[] {
        // TODO: 从配置表加载当前世界/关卡可用的挑战池
        return [];
    }

    private _applyDifficultyAdaptation(pool: ChallengeConfig[], difficulty: number): ChallengeConfig[] {
        if (this._playerFailCount >= 2) {
            return pool.filter(c => c.params['difficulty'] <= difficulty * 0.7);
        }
        return pool;
    }

    private _weightedRandom(pool: ChallengeConfig[]): ChallengeConfig | null {
        if (pool.length === 0) return null;
        const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const c of pool) {
            rand -= c.weight;
            if (rand <= 0) return c;
        }
        return pool[pool.length - 1];
    }

    public onChallengeFailed() {
        this._playerFailCount++;
        EventCenter.emit('challenge-failed');
    }

    public onChallengeCleared() {
        this._playerFailCount = Math.max(0, this._playerFailCount - 1);
        EventCenter.emit('challenge-cleared');
    }

    public clearAll() {
        this._activeChallenges.forEach(n => n.destroy());
        this._activeChallenges.length = 0;
    }
}
