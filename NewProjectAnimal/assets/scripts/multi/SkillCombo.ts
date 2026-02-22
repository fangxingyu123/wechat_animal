import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

export interface ComboEffect {
    name: string;
    char1: string;
    char2: string;
    description: string;
}

const COMBO_TABLE: ComboEffect[] = [
    {
        name: '轻盈稳落',
        char1: 'fat_cat',
        char2: 'shiba',
        description: '胖橘+阿柴同时释放技能，双方均获得无敌+吸附效果3秒',
    },
    {
        name: '灵敏弹跳',
        char1: 'ragdoll_cat',
        char2: 'corgi',
        description: '布偶猫+柯基同时释放技能，标记所有危险方块+跳跃加成叠加',
    },
];

@ccclass('SkillCombo')
export class SkillCombo extends Component {

    private _char1SkillPending: boolean = false;
    private _char2SkillPending: boolean = false;
    private _comboWindow: number = 1.5;
    private _timer: number = 0;

    onLoad() {
        EventCenter.on('skill-activated', this._onSkillActivated, this);
    }

    private _onSkillActivated(characterId: string) {
        if (!this._char1SkillPending) {
            this._char1SkillPending = true;
            this._timer = 0;
        } else {
            this._checkCombo(characterId);
        }
    }

    private _checkCombo(char2Id: string) {
        // 在联动窗口内两人都释放了技能
        const combo = COMBO_TABLE.find(c =>
            (c.char1 === char2Id || c.char2 === char2Id)
        );

        if (combo && this._timer <= this._comboWindow) {
            EventCenter.emit('skill-combo-triggered', combo);
        }

        this._char1SkillPending = false;
        this._char2SkillPending = false;
    }

    update(dt: number) {
        if (this._char1SkillPending) {
            this._timer += dt;
            if (this._timer > this._comboWindow) {
                this._char1SkillPending = false;
            }
        }
    }

    onDestroy() {
        EventCenter.off('skill-activated', this._onSkillActivated, this);
    }
}
