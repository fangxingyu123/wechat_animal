import { _decorator, Component, sys } from 'cc';

const { ccclass, property } = _decorator;

const STORAGE_KEY = 'pawjump_data';

export interface PlayerData {
    characters: { id: string; unlocked: boolean; level: number; skinId: string }[];
    currentCharacterId: string;
    levelProgress: Record<string, { stars: number; bestScore: number }>;
    collect: any;
    achievements: any;
    settings: { bgmVolume: number; sfxVolume: number; vibration: boolean };
    guideCompleted: boolean;
    totalPlayTime: number;
    lastLoginDate: string;
}

@ccclass('DataManager')
export class DataManager extends Component {

    private static _instance: DataManager | null = null;
    public static get instance(): DataManager | null { return this._instance; }

    private _data: PlayerData | null = null;
    public get data(): PlayerData | null { return this._data; }

    onLoad() {
        if (DataManager._instance) {
            this.destroy();
            return;
        }
        DataManager._instance = this;
        this._load();
    }

    private _load() {
        try {
            const raw = sys.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                this._data = JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Load data failed:', e);
        }

        if (!this._data) {
            this._data = this._createDefault();
        }
    }

    private _createDefault(): PlayerData {
        return {
            characters: [
                { id: 'fat_cat', unlocked: true, level: 1, skinId: 'default' },
                { id: 'shiba', unlocked: true, level: 1, skinId: 'default' },
                { id: 'ragdoll_cat', unlocked: false, level: 0, skinId: '' },
                { id: 'corgi', unlocked: false, level: 0, skinId: '' },
            ],
            currentCharacterId: 'fat_cat',
            levelProgress: {},
            collect: { snacks: 0, diamonds: 0, dailySnacksEarned: 0, items: {} },
            achievements: { unlocked: [], progress: {} },
            settings: { bgmVolume: 0.8, sfxVolume: 1.0, vibration: true },
            guideCompleted: false,
            totalPlayTime: 0,
            lastLoginDate: '',
        };
    }

    public save() {
        if (!this._data) return;
        try {
            sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
        } catch (e) {
            console.warn('Save data failed:', e);
        }
    }

    public updateLevelProgress(worldId: number, levelIndex: number, stars: number, score: number) {
        if (!this._data) return;
        const key = `${worldId}-${levelIndex}`;
        const existing = this._data.levelProgress[key];
        if (!existing || score > existing.bestScore) {
            this._data.levelProgress[key] = { stars: Math.max(existing?.stars || 0, stars), bestScore: score };
        }
        this.save();
    }

    onDestroy() {
        this.save();
        if (DataManager._instance === this) {
            DataManager._instance = null;
        }
    }
}
