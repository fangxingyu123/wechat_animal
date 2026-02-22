import { _decorator, Component, sys } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('RankSystem')
export class RankSystem extends Component {

    public submitScore(score: number) {
        if (sys.platform !== sys.Platform.WECHAT_GAME) return;

        // 微信开放数据域排行榜
        const wx = (window as any).wx;
        if (!wx) return;

        wx.setUserCloudStorage({
            KVDataList: [
                { key: 'score', value: String(score) },
            ],
            success: () => {
                EventCenter.emit('rank-submitted', score);
            },
            fail: (err: any) => {
                console.warn('Submit rank failed:', err);
            },
        });
    }

    public showRankList() {
        EventCenter.emit('rank-show');
        // 通过开放数据域显示排行榜
    }

    public hideRankList() {
        EventCenter.emit('rank-hide');
    }
}
