import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { ObjectPool } from '../utils/ObjectPool';

const { ccclass, property } = _decorator;

@ccclass('BlockFactory')
export class BlockFactory extends Component {

    @property(Prefab)
    blockPrefab: Prefab | null = null;

    private _pool: ObjectPool | null = null;
    private _activeBlocks: Node[] = [];
    private _maxOnScreen: number = 30;

    onLoad() {
        this._pool = new ObjectPool();
        if (this.blockPrefab) {
            this._pool.init(this.blockPrefab, 20);
        }
    }

    public spawnBlock(type: BlockType, position: Vec3, isMultiMode: boolean = false): Node | null {
        if (isMultiMode && this._isMarioType(type)) {
            return null;
        }

        if (this._activeBlocks.length >= this._maxOnScreen) {
            this._recycleOldest();
        }

        const node = this._pool?.get();
        if (!node) return null;

        node.setPosition(position);
        const block = node.getComponent(BlockBase);
        if (block) {
            block.init(type);
        }

        this.node.addChild(node);
        this._activeBlocks.push(node);
        return node;
    }

    public recycleBlock(node: Node) {
        const idx = this._activeBlocks.indexOf(node);
        if (idx >= 0) {
            this._activeBlocks.splice(idx, 1);
        }
        this._pool?.put(node);
    }

    private _recycleOldest() {
        if (this._activeBlocks.length > 0) {
            const oldest = this._activeBlocks.shift()!;
            this._pool?.put(oldest);
        }
    }

    private _isMarioType(type: BlockType): boolean {
        return type === BlockType.MUSHROOM
            || type === BlockType.BRICK
            || type === BlockType.PIPE;
    }

    public recycleAll() {
        for (const node of this._activeBlocks) {
            this._pool?.put(node);
        }
        this._activeBlocks.length = 0;
    }
}
