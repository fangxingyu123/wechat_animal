export interface WorldDef {
    id: number;
    name: string;
    theme: string;
    levelCount: number;
    bossLevel: number;
    unlockCondition: string;
    bgColor: string;
    normalBlockRatio: number;
    specialBlockRatio: number;
    dangerBlockRatio: number;
    marioBlockRatio: number;
    hidden: boolean;
}

export const WORLDS: WorldDef[] = [
    {
        id: 1,
        name: '庭院世界',
        theme: 'yard',
        levelCount: 18,
        bossLevel: 18,
        unlockCondition: '初始解锁',
        bgColor: '#87CEEB',
        normalBlockRatio: 0.6,
        specialBlockRatio: 0.25,
        dangerBlockRatio: 0.1,
        marioBlockRatio: 0.05,
        hidden: false,
    },
    {
        id: 2,
        name: '公园世界',
        theme: 'park',
        levelCount: 18,
        bossLevel: 18,
        unlockCondition: '通关庭院世界',
        bgColor: '#90EE90',
        normalBlockRatio: 0.45,
        specialBlockRatio: 0.25,
        dangerBlockRatio: 0.2,
        marioBlockRatio: 0.1,
        hidden: false,
    },
    {
        id: 3,
        name: '宠物店世界',
        theme: 'petshop',
        levelCount: 18,
        bossLevel: 18,
        unlockCondition: '通关公园世界',
        bgColor: '#FFB6C1',
        normalBlockRatio: 0.35,
        specialBlockRatio: 0.2,
        dangerBlockRatio: 0.3,
        marioBlockRatio: 0.15,
        hidden: false,
    },
    {
        id: 4,
        name: '森林世界',
        theme: 'forest',
        levelCount: 18,
        bossLevel: 18,
        unlockCondition: '通关宠物店世界',
        bgColor: '#228B22',
        normalBlockRatio: 0.2,
        specialBlockRatio: 0.15,
        dangerBlockRatio: 0.45,
        marioBlockRatio: 0.2,
        hidden: false,
    },
    {
        id: 5,
        name: '星空世界',
        theme: 'starry',
        levelCount: 17,
        bossLevel: 17,
        unlockCondition: '通关森林世界 + 收集全部星空碎片',
        bgColor: '#191970',
        normalBlockRatio: 0.15,
        specialBlockRatio: 0.2,
        dangerBlockRatio: 0.5,
        marioBlockRatio: 0.15,
        hidden: true,
    },
];

export class WorldConfigHelper {
    static getById(id: number): WorldDef | undefined {
        return WORLDS.find(w => w.id === id);
    }

    static getVisibleWorlds(): WorldDef[] {
        return WORLDS.filter(w => !w.hidden);
    }

    static getTotalLevels(): number {
        return WORLDS.reduce((sum, w) => sum + w.levelCount, 0);
    }
}
