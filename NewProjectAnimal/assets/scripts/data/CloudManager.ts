import { _decorator, Component, sys } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CloudManager')
export class CloudManager extends Component {

    private _db: any = null;
    private _isInited: boolean = false;

    public get isInited(): boolean { return this._isInited; }

    public init() {
        if (sys.platform !== sys.Platform.WECHAT_GAME) return;

        const wx = (window as any).wx;
        if (!wx?.cloud) return;

        wx.cloud.init({
            traceUser: true,
        });

        this._db = wx.cloud.database();
        this._isInited = true;
    }

    public async callFunction(name: string, data: any): Promise<any> {
        const wx = (window as any).wx;
        if (!wx?.cloud) return null;

        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name,
                data,
                success: (res: any) => resolve(res.result),
                fail: (err: any) => reject(err),
            });
        });
    }

    public async getDoc(collection: string, docId: string): Promise<any> {
        if (!this._db) return null;
        return new Promise((resolve, reject) => {
            this._db.collection(collection).doc(docId).get({
                success: (res: any) => resolve(res.data),
                fail: (err: any) => reject(err),
            });
        });
    }

    public async addDoc(collection: string, data: any): Promise<string> {
        if (!this._db) return '';
        return new Promise((resolve, reject) => {
            this._db.collection(collection).add({
                data,
                success: (res: any) => resolve(res._id),
                fail: (err: any) => reject(err),
            });
        });
    }

    public async updateDoc(collection: string, docId: string, data: any): Promise<boolean> {
        if (!this._db) return false;
        return new Promise((resolve, reject) => {
            this._db.collection(collection).doc(docId).update({
                data,
                success: () => resolve(true),
                fail: (err: any) => reject(err),
            });
        });
    }
}
