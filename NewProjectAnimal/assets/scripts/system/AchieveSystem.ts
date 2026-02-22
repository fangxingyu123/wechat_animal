import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export interface AchievementDef {
    id: string;
    name: string;
    desc: string;
    condition: string;
    rewardType: string;
    rewardAmount: number;
}

@ccclass('AchieveSystem')
export class AchieveSystem extends Component {

    private _achievements: AchievementDef[] = [];
    private _unlocked: Set<string> = new Set();
    private _progress: Map<string, number> = new Map();

    public init(defs: AchievementDef[]) {
        this._achievements = defs;
    }

    public isUnlocked(achieveId: string): boolean {
        return this._unlocked.has(achieveId);
    }

    public updateProgress(achieveId: string, value: number) {
        this._progress.set(achieveId, value);
        EventCenter.emit('achieve-progress', achieveId, value);
    }

    public unlock(achieveId: string) {
        if (this._unlocked.has(achieveId)) return;
        this._unlocked.add(achieveId);

        const def = this._achievements.find(a => a.id === achieveId);
        if (def) {
            EventCenter.emit('achieve-unlocked', def);
        }
    }

    public getAll(): Array<AchievementDef & { unlocked: boolean; progress: number }> {
        return this._achievements.map(a => ({
            ...a,
            unlocked: this._unlocked.has(a.id),
            progress: this._progress.get(a.id) || 0,
        }));
    }

    public loadData(data: any) {
        if (data.unlocked) {
            this._unlocked = new Set(data.unlocked);
        }
        if (data.progress) {
            this._progress = new Map(Object.entries(data.progress));
        }
    }

    public saveData(): any {
        return {
            unlocked: Array.from(this._unlocked),
            progress: Object.fromEntries(this._progress),
        };
    }
}
