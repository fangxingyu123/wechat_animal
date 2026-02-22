import { _decorator, Component, sys } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

const INVITE_REWARDS = [
    { count: 1, snacks: 50, desc: '邀请1人' },
    { count: 3, snacks: 200, desc: '邀请3人' },
    { count: 5, snacks: 500, diamonds: 10, desc: '邀请5人' },
    { count: 10, snacks: 1000, diamonds: 30, desc: '邀请10人' },
];

@ccclass('ShareManager')
export class ShareManager extends Component {

    private _inviteCount: number = 0;

    onLoad() {
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            this._initShareMenu();
        }
    }

    private _initShareMenu() {
        const wx = (window as any).wx;
        if (!wx) return;

        wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });

        wx.onShareAppMessage(() => ({
            title: '喵汪搭伙跳！来一起跳吧~',
            imageUrl: '', // TODO: 替换为分享图
        }));
    }

    public shareResult(score: number, worldName: string) {
        const wx = (window as any).wx;
        if (!wx) return;

        wx.shareAppMessage({
            title: `我在${worldName}拿了${score}分，你能超过我吗？`,
            imageUrl: '',
        });

        EventCenter.emit('share-result');
    }

    public shareInvite() {
        const wx = (window as any).wx;
        if (!wx) return;

        wx.shareAppMessage({
            title: '喵汪搭伙跳，萌宠跳跳乐！一起来玩~',
            imageUrl: '',
        });

        EventCenter.emit('share-invite');
    }

    public onInviteSuccess() {
        this._inviteCount++;
        const tier = INVITE_REWARDS.filter(r => r.count === this._inviteCount);
        if (tier.length > 0) {
            EventCenter.emit('invite-reward', tier[0]);
        }
    }

    public getNextRewardTier(): typeof INVITE_REWARDS[0] | null {
        return INVITE_REWARDS.find(r => r.count > this._inviteCount) || null;
    }
}
