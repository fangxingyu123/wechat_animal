type EventCallback = (...args: any[]) => void;

interface EventEntry {
    callback: EventCallback;
    target: any;
}

export class EventCenter {

    private static _events: Map<string, EventEntry[]> = new Map();

    public static on(eventName: string, callback: EventCallback, target?: any) {
        let list = this._events.get(eventName);
        if (!list) {
            list = [];
            this._events.set(eventName, list);
        }
        list.push({ callback, target });
    }

    public static once(eventName: string, callback: EventCallback, target?: any) {
        const wrapper = (...args: any[]) => {
            callback.apply(target, args);
            this.off(eventName, wrapper, target);
        };
        this.on(eventName, wrapper, target);
    }

    public static off(eventName: string, callback: EventCallback, target?: any) {
        const list = this._events.get(eventName);
        if (!list) return;

        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].callback === callback && list[i].target === target) {
                list.splice(i, 1);
            }
        }

        if (list.length === 0) {
            this._events.delete(eventName);
        }
    }

    public static emit(eventName: string, ...args: any[]) {
        const list = this._events.get(eventName);
        if (!list) return;

        for (const entry of [...list]) {
            entry.callback.apply(entry.target, args);
        }
    }

    public static clear() {
        this._events.clear();
    }
}
