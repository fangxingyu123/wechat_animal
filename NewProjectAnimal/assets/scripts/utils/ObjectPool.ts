import { Prefab, Node, instantiate } from 'cc';

export class ObjectPool {

    private _prefab: Prefab | null = null;
    private _pool: Node[] = [];

    public init(prefab: Prefab, preloadCount: number = 10) {
        this._prefab = prefab;
        for (let i = 0; i < preloadCount; i++) {
            const node = instantiate(prefab);
            node.active = false;
            this._pool.push(node);
        }
    }

    public get(): Node | null {
        if (this._pool.length > 0) {
            const node = this._pool.pop()!;
            node.active = true;
            return node;
        }

        if (this._prefab) {
            return instantiate(this._prefab);
        }

        return null;
    }

    public put(node: Node) {
        node.removeFromParent();
        node.active = false;
        this._pool.push(node);
    }

    public clear() {
        for (const node of this._pool) {
            node.destroy();
        }
        this._pool.length = 0;
    }

    public get size(): number {
        return this._pool.length;
    }
}
