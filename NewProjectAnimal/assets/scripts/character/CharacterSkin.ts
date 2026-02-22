import { _decorator, Component, Sprite, SpriteFrame, Color } from 'cc';

const { ccclass, property } = _decorator;

export interface SkinConfig {
    id: string;
    characterId: string;
    name: string;
    color: string;
    unlockCondition: string;
}

@ccclass('CharacterSkin')
export class CharacterSkin extends Component {

    private _currentSkinId: string = '';

    public get currentSkinId(): string { return this._currentSkinId; }

    public applySkin(skinId: string, color: string) {
        this._currentSkinId = skinId;

        const sprite = this.getComponent(Sprite);
        if (sprite) {
            const c = new Color();
            Color.fromHEX(c, color);
            sprite.color = c;
        }
    }

    public applyPlaceholderColor(hexColor: string) {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            const c = new Color();
            Color.fromHEX(c, hexColor);
            sprite.color = c;
        }
    }
}
