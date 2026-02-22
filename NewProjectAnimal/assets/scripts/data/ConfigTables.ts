import { resources, JsonAsset } from 'cc';
import { LevelConfigManager } from '../level/LevelConfig';
import { AchievementDef } from '../system/AchieveSystem';
import { ShopItem } from '../system/ShopSystem';

export class ConfigTables {

    private static _loaded: boolean = false;
    private static _achievements: AchievementDef[] = [];
    private static _shopItems: ShopItem[] = [];

    public static get achievements(): AchievementDef[] { return this._achievements; }
    public static get shopItems(): ShopItem[] { return this._shopItems; }

    public static async loadAll(): Promise<void> {
        if (this._loaded) return;

        await Promise.all([
            this._loadJson('data/levels', (data) => LevelConfigManager.init(data)),
            this._loadJson('data/achievements', (data) => { this._achievements = data; }),
            this._loadJson('data/shop', (data) => { this._shopItems = data; }),
        ]);

        this._loaded = true;
    }

    private static _loadJson(path: string, callback: (data: any) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load(path, JsonAsset, (err, asset) => {
                if (err) {
                    console.warn(`Load ${path} failed:`, err);
                    resolve();
                    return;
                }
                if (asset?.json) {
                    callback(asset.json as any);
                }
                resolve();
            });
        });
    }
}
