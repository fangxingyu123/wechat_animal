---
name: pawjump-dev
description: 喵汪搭伙跳微信小游戏开发规范。基于 Cocos Creator 3.8 + 微信小游戏平台，涵盖组件编写、事件通信、对象池、方块/角色/关卡系统、微信API调用等开发规范。当编写或修改 TypeScript 游戏脚本、添加新方块/角色/敌人/关卡、实现微信小游戏功能、调试游戏逻辑时使用。
---

# 喵汪搭伙跳 — 开发规范

## 项目概述

- **引擎**：Cocos Creator 3.8（TypeScript）
- **平台**：微信小游戏
- **后端**：微信小游戏云开发
- **多人**：微信实时对战组件（帧同步）
- **策略**：先编码后贴图，占位色块开发

## 核心约定

### 中文注释规范

所有代码注释必须使用中文，包括：
- 文件头部说明注释
- 类/接口注释
- 关键方法注释
- 复杂逻辑行内注释
- TODO/FIXME 标记

```typescript
/** 方块工厂 — 负责方块的生成、回收与对象池管理 */
@ccclass('BlockFactory')
export class BlockFactory extends Component {

    /** 当前屏幕上最大方块数（超出时回收最早的） */
    private _maxOnScreen: number = 30;

    /**
     * 生成方块
     * @param type 方块类型
     * @param position 世界坐标
     * @param isMultiMode 是否多人模式（多人模式不生成马里奥联动方块）
     */
    public spawnBlock(type: BlockType, position: Vec3, isMultiMode: boolean = false): Node | null {
        // 多人模式过滤马里奥联动方块
        if (isMultiMode && this._isMarioType(type)) {
            return null;
        }
        // ...
    }
}
```

不写无意义的注释：
```typescript
// 错误：score加1
this._score += 1;

// 正确：连击额外奖励，每5连击加10%倍率
const comboMultiplier = 1 + Math.floor(this._combo / 5) * 0.1;
```

### 组件编写模板

```typescript
import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

/** [模块说明] */
@ccclass('ClassName')
export class ClassName extends Component {

    // —— 编辑器属性 ——
    @property
    someValue: number = 0;

    // —— 私有状态 ——
    private _internalState: boolean = false;

    // —— 生命周期 ——
    onLoad() { }
    start() { }
    update(dt: number) { }
    onDestroy() { }

    // —— 公共方法 ——
    // —— 私有方法（下划线前缀） ——
}
```

**命名规则**：
- 类名：PascalCase（`BlockFactory`）
- 私有属性/方法：`_camelCase`（下划线前缀）
- 公共属性/方法：`camelCase`
- 常量：`UPPER_SNAKE_CASE`
- 枚举值：`UPPER_SNAKE_CASE`
- 事件名：`kebab-case`（`'block-landed'`, `'score-updated'`）

## 项目架构

### 目录结构

```
assets/
├── scripts/
│   ├── core/          # 核心（GameManager, InputManager, CameraController, ScoreManager）
│   ├── block/         # 方块（BlockBase → Normal/Special/Danger/Mario/Multi + Factory）
│   ├── character/     # 角色（CharacterBase, CharacterData, SkillSystem, CharacterSkin）
│   ├── challenge/     # 挑战（ChallengeManager, EnemyBase → Hamster/Parrot/Succulent, TrapSystem）
│   ├── level/         # 关卡（LevelManager, LevelConfig, WorldConfig, BossBase, DifficultyAdapter）
│   ├── multi/         # 多人（MultiManager, SyncManager, RescueSystem, SkillCombo）
│   ├── system/        # 系统（CollectSystem, AchieveSystem, RankSystem, ShopSystem, ReviveSystem）
│   ├── social/        # 社交（ShareManager, InviteManager）
│   ├── ui/            # 界面（UIHome, UIGame, UIResult, UIShop, UIGuide）
│   ├── data/          # 数据（DataManager, CloudManager, ConfigTables）
│   └── utils/         # 工具（EventCenter, ObjectPool, MathUtils）
├── data/              # JSON配置表（levels, characters, blocks, achievements, shop）
├── scenes/            # 场景（loading, home, game, result）
├── prefabs/           # 预制体
├── textures/          # 贴图
└── audio/             # 音频
```

### 全局事件总线 — EventCenter

模块间通信**必须**通过 `EventCenter`，禁止组件间直接引用：

```typescript
import { EventCenter } from '../utils/EventCenter';

// 发送事件
EventCenter.emit('block-landed', blockScore, isPerfect);

// 监听事件（onLoad中注册，onDestroy中注销）
onLoad() {
    EventCenter.on('block-landed', this._onBlockLanded, this);
}
onDestroy() {
    EventCenter.off('block-landed', this._onBlockLanded, this);
}
```

**常用事件清单**：

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `game-state-changed` | `newState, oldState` | 游戏状态切换 |
| `charge-start` | — | 开始蓄力 |
| `charge-update` | `ratio: number` | 蓄力进度(0~1) |
| `jump` | `power: number` | 跳跃（力度1~4） |
| `character-landed` | `characterNode` | 角色落地 |
| `character-died` | `characterId` | 角色死亡 |
| `block-landed` | `score, isPerfect` | 落到方块上 |
| `block-vanished` | `blockNode` | 消失方块消失 |
| `combo-break` | — | 连击中断 |
| `score-updated` | `total, combo, add` | 积分更新 |
| `skill-activated` | `characterId` | 技能释放 |
| `skill-ready` | `characterId` | 技能CD结束 |
| `level-loaded` | `levelDef, worldDef` | 关卡加载 |
| `level-completed` | `worldId, levelIdx, stars, score` | 关卡完成 |
| `level-failed` | — | 关卡失败 |
| `boss-activated` | `bossId` | BOSS战开始 |
| `boss-defeated` | `bossId` | BOSS被击败 |
| `difficulty-reduced` | `multiplier` | 难度下调 |

### 对象池 — ObjectPool

所有频繁创建/销毁的节点（方块、敌人、特效）必须使用对象池：

```typescript
import { ObjectPool } from '../utils/ObjectPool';

private _pool: ObjectPool = new ObjectPool();

onLoad() {
    this._pool.init(this.prefab, 20); // 预创建20个
}

// 取出
const node = this._pool.get();

// 回收（会自动 removeFromParent + 设置 active=false）
this._pool.put(node);
```

### 状态机模式

角色、BOSS、游戏流程均使用有限状态机：

```typescript
export enum CharacterState {
    IDLE,      // 站立
    CHARGING,  // 蓄力中
    JUMPING,   // 跳跃中
    LANDING,   // 落地
    FALLING,   // 坠落
    DEAD,      // 死亡
}
```

## 关键技术实现

### 跳跃物理 — 贝塞尔曲线

不使用物理引擎刚体，用二阶贝塞尔曲线 + Tween 实现跳跃弧线：

```typescript
import { MathUtils } from '../utils/MathUtils';

// 起点 → 控制点（最高点） → 终点
const controlPoint = new Vec3(
    (startPos.x + endPos.x) / 2,
    startPos.y + jumpHeight,
    0
);

tween(this.node)
    .to(duration, { position: endPos }, {
        onUpdate: (_target: any, ratio: number) => {
            const pos = MathUtils.bezierQuadratic(startPos, controlPoint, endPos, ratio!);
            this.node.setPosition(pos);
        }
    })
    .start();
```

### 碰撞检测 — 手动 AABB

方块场景使用手动 AABB 包围盒，比物理引擎更轻量：

```typescript
MathUtils.checkAABB(ax, ay, aw, ah, bx, by, bw, bh);
```

### 方块生成 — 滚动窗口

前方预生成 + 后方回收，屏幕上最多保持 30 个方块，内存恒定：

```typescript
// BlockFactory 中的逻辑
if (this._activeBlocks.length >= this._maxOnScreen) {
    this._recycleOldest(); // 回收最早的方块到对象池
}
```

### 多人模式方块过滤

马里奥联动方块（蘑菇/砖块/管道）仅在单人模式生成：

```typescript
if (isMultiMode && this._isMarioType(type)) {
    return null; // 多人模式不生成马里奥联动方块
}
```

## 微信小游戏 API 封装

### 平台判断

```typescript
import { sys } from 'cc';

if (sys.platform === sys.Platform.WECHAT_GAME) {
    const wx = (window as any).wx;
    // 调用微信API
}
```

### 本地存储

使用 Cocos 的 `sys.localStorage`（底层自动对接 wx.setStorageSync）：

```typescript
sys.localStorage.setItem('pawjump_data', JSON.stringify(data));
const raw = sys.localStorage.getItem('pawjump_data');
```

### 云开发

```typescript
const wx = (window as any).wx;
wx.cloud.init({ traceUser: true });
const db = wx.cloud.database();
```

### 震动反馈

```typescript
// 蓄力满时轻震提示
wx?.vibrateShort({ type: 'light' });
```

### 分享

```typescript
wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
wx.onShareAppMessage(() => ({
    title: '喵汪搭伙跳！来一起跳吧~',
    imageUrl: '',
}));
```

## 数据配置表

所有配置通过 `assets/data/` 下的 JSON 管理，运行时通过 `ConfigTables.loadAll()` 异步加载：

| 文件 | 用途 | 关键字段 |
|------|------|----------|
| `levels.json` | 关卡配置 | worldId, levelIndex, difficulty, blockCount, isBoss, starThresholds |
| `characters.json` | 角色配置 | id, name, rarity, skillId, skillCD, upgradeCosts |
| `blocks.json` | 方块配置 | type, category, color, score, effect, multiMode |
| `achievements.json` | 成就配置 | id, condition, rewardType, rewardAmount |
| `shop.json` | 商店配置 | costType, costAmount, dailyLimit |

新增方块/角色/成就时：**先更新 JSON 配置 → 再写代码逻辑**。

## 游戏设计要点

### 世界体系（5大世界，89关）

| 世界 | 关卡数 | 基础方块占比 | 特点 |
|------|--------|-------------|------|
| 庭院 | 18 | ≥60% | 新手友好，引导为主 |
| 公园 | 18 | ≥45% | 引入随机挑战 |
| 宠物店 | 18 | ≥35% | 挑战频率提升 |
| 森林 | 18 | ≥20% | 极限难度，积分惩罚 |
| 星空(隐藏) | 17 | ≥15% | 失重方块+星空碎片 |

### 角色（2基础 + 2稀有）

| 角色 | 技能 | CD |
|------|------|-----|
| 胖橘(基础) | 肉垫护体 — 落地无敌1秒 | 15s |
| 阿柴(基础) | 嗅觉定位 — 自动吸附方块边缘 | 12s |
| 布偶猫(稀有) | 灵敏预警 — 标记前方危险方块 | 20s |
| 柯基(稀有) | 弹簧短腿 — 跳跃距离+50% | 18s |

### 难度自适应

连续失败2次 → 自动降难（危险方块-15%、技能CD×0.7）；通关后逐步恢复。

## 性能约束

| 指标 | 限制 |
|------|------|
| 首包体积 | ≤ 4MB（已关闭3D/Spine/DragonBones等模块） |
| 屏幕方块数 | ≤ 30 |
| 屏幕敌人数 | ≤ 5 |
| 图片格式 | PNG（TinyPNG压缩后） |
| BGM格式 | OGG |
| 音效格式 | MP3 |
| 帧率目标 | ≥ 55fps |
| 多人延迟 | ≤ 200ms（超过500ms暂停） |
