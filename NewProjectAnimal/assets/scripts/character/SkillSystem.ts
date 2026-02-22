import { _decorator, Component } from 'cc';
import { EventCenter } from '../utils/EventCenter';
import { CharacterDataManager } from './CharacterData';

const { ccclass, property } = _decorator;

@ccclass('SkillSystem')
export class SkillSystem extends Component {

    private _currentCharacterId: string = '';
    private _skillCD: number = 0;
    private _cdRemaining: number = 0;
    private _skillLevel: number = 1;

    public get isReady(): boolean { return this._cdRemaining <= 0; }
    public get cdRemaining(): number { return this._cdRemaining; }
    public get cdRatio(): number { return this._skillCD > 0 ? this._cdRemaining / this._skillCD : 0; }

    public setCharacter(characterId: string) {
        this._currentCharacterId = characterId;
        const config = CharacterDataManager.getById(characterId);
        if (config) {
            this._skillCD = config.skillCD;
        }
        this._cdRemaining = 0;
    }

    public useSkill(): boolean {
        if (!this.isReady) return false;

        this._cdRemaining = this._skillCD;
        EventCenter.emit('skill-activated', this._currentCharacterId);
        this._applySkillEffect();
        return true;
    }

    private _applySkillEffect() {
        const config = CharacterDataManager.getById(this._currentCharacterId);
        if (!config) return;

        switch (config.skillId) {
            case 'invincible':
                EventCenter.emit('skill-invincible', 1.0);
                break;
            case 'auto_adsorb':
                EventCenter.emit('skill-auto-adsorb');
                break;
            case 'trap_warning':
                EventCenter.emit('skill-trap-warning', 2, 5.0);
                break;
            case 'dash_jump':
                EventCenter.emit('skill-dash-jump', 1.5);
                break;
        }
    }

    update(dt: number) {
        if (this._cdRemaining > 0) {
            this._cdRemaining = Math.max(0, this._cdRemaining - dt);
            if (this._cdRemaining <= 0) {
                EventCenter.emit('skill-ready', this._currentCharacterId);
            }
        }
    }
}
