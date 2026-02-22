export interface LevelDef {
    worldId: number;
    levelIndex: number;
    blockCount: number;
    difficulty: number;
    targetScore: number;
    challengeTypes: string[];
    isBoss: boolean;
    bossId?: string;
    starThresholds: [number, number, number];
}

export class LevelConfigManager {
    private static _levels: Map<string, LevelDef> = new Map();

    static init(data: any[]) {
        this._levels.clear();
        for (const item of data) {
            const key = `${item.worldId}-${item.levelIndex}`;
            this._levels.set(key, item as LevelDef);
        }
    }

    static get(worldId: number, levelIndex: number): LevelDef | undefined {
        return this._levels.get(`${worldId}-${levelIndex}`);
    }

    static getLevelsForWorld(worldId: number): LevelDef[] {
        const results: LevelDef[] = [];
        this._levels.forEach((v) => {
            if (v.worldId === worldId) results.push(v);
        });
        return results.sort((a, b) => a.levelIndex - b.levelIndex);
    }
}
