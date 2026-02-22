# 详细参考文档

## 新增方块类型操作流程

1. 在 `BlockBase.ts` 的 `BlockType` 枚举中添加新类型值
2. 在 `assets/data/blocks.json` 中添加配置项（含 `multiMode` 标记）
3. 创建 `scripts/block/BlockXxx.ts` 继承 `BlockBase`，覆写 `_applyVisual()` 和 `onLand()`
4. 在 `BlockFactory.ts` 中注册生成逻辑
5. 占位色块用不同颜色区分

示例：

```typescript
import { _decorator, Color, Sprite, Node } from 'cc';
import { BlockBase, BlockType } from './BlockBase';
import { EventCenter } from '../utils/EventCenter';

const { ccclass, property } = _decorator;

/** 弹簧方块 — 角色落上后自动弹起到更高位置 */
@ccclass('BlockSpring')
export class BlockSpring extends BlockBase {

    /** 弹跳倍率 */
    @property
    bounceMultiplier: number = 2.0;

    protected _applyVisual() {
        const sprite = this.getComponent(Sprite);
        if (sprite) sprite.color = new Color(0, 255, 127); // 占位：春绿色
    }

    public onLand(characterNode: Node) {
        EventCenter.emit('effect-spring-bounce', characterNode, this.bounceMultiplier);
    }
}
```

## 新增角色操作流程

1. 在 `assets/data/characters.json` 中添加角色配置
2. 在 `CharacterData.ts` 的 `CHARACTER_TABLE` 中同步添加
3. 在 `SkillSystem.ts` 的 `_applySkillEffect()` 中添加新技能分支
4. 在 `DataManager.ts` 的 `_createDefault()` 中添加角色初始状态
5. 如有双人联动，在 `SkillCombo.ts` 的 `COMBO_TABLE` 中添加

## 新增敌人操作流程

1. 在 `EnemyBase.ts` 的 `EnemyType` 枚举中添加
2. 创建 `scripts/challenge/EnemyXxx.ts` 继承 `EnemyBase`
3. 覆写 `onHitByCharacter()` 定义被击中行为
4. 在 `ChallengeManager.ts` 中注册生成逻辑
5. 占位色块用不同颜色区分

## 新增关卡操作流程

1. 在 `assets/data/levels.json` 中添加关卡配置
2. 如新增世界，在 `WorldConfig.ts` 的 `WORLDS` 数组中添加世界定义
3. BOSS 关需创建 `scripts/level/BossXxx.ts` 继承 `BossBase`，覆写 `_performAttack()`

## 新增成就操作流程

1. 在 `assets/data/achievements.json` 中添加配置
2. 在对应系统的事件处理中调用 `AchieveSystem.updateProgress()` / `unlock()`

## 新增商店道具操作流程

1. 在 `assets/data/shop.json` 中添加商品
2. 如果是新道具类型，在 `CollectSystem.ts` 中添加使用逻辑
3. 在 `ReviveSystem.ts` 或对应系统中添加道具效果

## 场景节点层级规范

```
Canvas (UITransform: 1280×720)
├── GameLayer               # 游戏世界层（跟随相机）
│   ├── BlockContainer      # 方块容器节点
│   ├── CharacterNode       # 当前角色
│   └── EnemyContainer      # 敌人容器节点
├── UILayer                 # HUD层（固定屏幕，不跟随相机）
│   ├── ScoreLabel          # 积分
│   ├── DistanceLabel       # 距离
│   ├── ComboLabel          # 连击
│   ├── SkillBtn            # 技能按钮
│   ├── SwitchBtn           # 切换角色按钮
│   └── PowerBar            # 蓄力条
└── Camera (2D Ortho)       # 主相机
```

## 微信云开发数据库集合规范

| 集合名 | 用途 | 关键字段 |
|--------|------|----------|
| `rooms` | 多人对战房间 | roomId, hostId, guestId, state, createTime |
| `players` | 玩家云端数据 | openId, nickname, bestScore, totalGames |
| `ranks` | 排行榜 | openId, score, worldId, updateTime |

## Git 提交信息规范

```
<类型>(<范围>): <描述>

类型：
- feat: 新功能
- fix: 修复bug
- refactor: 重构
- perf: 性能优化
- style: 样式/格式调整
- docs: 文档
- test: 测试
- chore: 构建/工具

范围：core, block, character, challenge, level, multi, system, social, ui, data

示例：
feat(block): 新增弹簧方块类型
fix(character): 修复胖橘技能CD计算错误
perf(block): 优化方块对象池回收逻辑
```
