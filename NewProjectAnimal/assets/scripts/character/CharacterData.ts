export interface CharacterConfig {
    id: string;
    name: string;
    rarity: 'basic' | 'rare';
    baseColor: string;
    skillId: string;
    skillName: string;
    skillDesc: string;
    skillCD: number;
    unlockCondition: string;
    upgradeCosts: number[];
}

export const CHARACTER_TABLE: CharacterConfig[] = [
    {
        id: 'fat_cat',
        name: '胖橘',
        rarity: 'basic',
        baseColor: '#FF8C00',
        skillId: 'invincible',
        skillName: '肉垫护体',
        skillDesc: '落地瞬间无敌1秒，免疫一次危险方块伤害',
        skillCD: 15,
        unlockCondition: '初始角色',
        upgradeCosts: [0, 100, 300, 600],
    },
    {
        id: 'shiba',
        name: '阿柴',
        rarity: 'basic',
        baseColor: '#D2691E',
        skillId: 'auto_adsorb',
        skillName: '嗅觉定位',
        skillDesc: '跳跃后自动吸附至最近方块边缘，减少掉落概率',
        skillCD: 12,
        unlockCondition: '初始角色',
        upgradeCosts: [0, 100, 300, 600],
    },
    {
        id: 'ragdoll_cat',
        name: '布偶猫',
        rarity: 'rare',
        baseColor: '#F5F5DC',
        skillId: 'trap_warning',
        skillName: '灵敏预警',
        skillDesc: '提前标记前方2个方块中的危险方块，持续5秒',
        skillCD: 20,
        unlockCondition: '收集200零食解锁',
        upgradeCosts: [200, 400, 800, 1500],
    },
    {
        id: 'corgi',
        name: '柯基',
        rarity: 'rare',
        baseColor: '#F4A460',
        skillId: 'dash_jump',
        skillName: '弹簧短腿',
        skillDesc: '下次跳跃距离+50%，持续1次',
        skillCD: 18,
        unlockCondition: '通关公园世界解锁',
        upgradeCosts: [0, 400, 800, 1500],
    },
];

export class CharacterDataManager {
    static getById(id: string): CharacterConfig | undefined {
        return CHARACTER_TABLE.find(c => c.id === id);
    }

    static getBasicCharacters(): CharacterConfig[] {
        return CHARACTER_TABLE.filter(c => c.rarity === 'basic');
    }

    static getRareCharacters(): CharacterConfig[] {
        return CHARACTER_TABLE.filter(c => c.rarity === 'rare');
    }
}
