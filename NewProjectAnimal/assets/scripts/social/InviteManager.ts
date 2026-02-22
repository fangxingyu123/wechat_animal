import { _decorator, Component, sys } from 'cc';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

@ccclass('InviteManager')
export class InviteManager extends Component {

    public inviteFriend() {
        const wx = (window as any).wx;
        if (!wx) return;

        wx.shareAppMessage({
            title: '来一起搭伙跳吧！',
            imageUrl: '',
            query: 'invite=1',
        });

        EventCenter.emit('invite-sent');
    }

    public checkInviteParam() {
        const wx = (window as any).wx;
        if (!wx) return;

        const launchOptions = wx.getLaunchOptionsSync();
        if (launchOptions.query && launchOptions.query.invite) {
            EventCenter.emit('invite-accepted', launchOptions.query);
        }
    }
}
