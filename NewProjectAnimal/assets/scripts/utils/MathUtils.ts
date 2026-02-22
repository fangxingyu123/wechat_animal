import { Vec3 } from 'cc';

export class MathUtils {

    /** 二阶贝塞尔曲线插值（用于跳跃弧线） */
    public static bezierQuadratic(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        const u = 1 - t;
        const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
        const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
        const z = u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z;
        return new Vec3(x, y, z);
    }

    /** 简单 AABB 碰撞检测 */
    public static checkAABB(
        ax: number, ay: number, aw: number, ah: number,
        bx: number, by: number, bw: number, bh: number
    ): boolean {
        return ax < bx + bw &&
            ax + aw > bx &&
            ay < by + bh &&
            ay + ah > by;
    }

    /** 将值限制在 [min, max] 范围 */
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /** 线性插值 */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * this.clamp(t, 0, 1);
    }

    /** 随机整数 [min, max] */
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /** 带权重的随机选择 */
    public static weightedRandom<T>(items: T[], weights: number[]): T | null {
        if (items.length === 0 || items.length !== weights.length) return null;
        const total = weights.reduce((s, w) => s + w, 0);
        let rand = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return items[i];
        }
        return items[items.length - 1];
    }

    /** 计算两点距离 */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
