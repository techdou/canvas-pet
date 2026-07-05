# 换皮指南（模板契约）

本文是 canvas-pet 的**换皮规范**。它同时是一份契约：未来若要写一个 skill 基于 canvas-pet 模板「生成新的 pet 形象」，这个 skill 必须遵守本文的精灵图命名、方向约定和配置字段，产出的成果才能直接替换运行。

> 目标读者：想给宠物换形象的人，以及想把 canvas-pet 当模板、用自动化流程批量生成新皮肤的实现者。

---

## 一、精灵图清单

所有精灵图放在 `assets/pet/` 下。引擎按 `pet.config.js` 的 `frames.*` 路径加载，所以**文件名其实可以任意**——但为了模板的统一性和可读性，强烈建议遵循下面的命名约定。

默认形象为「豆懂」（WebP 格式），下表文件名与之对齐。

| 配置键（`frames.*`） | 建议文件名 | 用途 | 朝向 / 内容要求 |
|---|---|---|---|
| `idle` | `idle.webp` | 默认静止/呆立 | 正面朝向，画面居中 |
| `idleWink` | `idle-wink.webp` | 呆立时随机眨眼 | 与 idle 同构图，仅眼睛闭合 |
| `walkFront1` | `walk-front-1.webp` | 正面行走 帧1 | 正面朝向 |
| `walkFront2` | `walk-front-2.webp` | 正面行走 帧2 | 与帧1交替形成步态 |
| `walkLeft` | `walk-left.webp` | 左行 | 朝左 |
| `walkRight` | `walk-right.webp` | 右行 | **必须直接是朝右的帧**（见下方警告） |
| `walkBack` | `walk-back-1.webp` | 背向行走 | 背面朝向 |
| `sleep` | `sleep.webp` | 睡觉 | 闭眼/安睡姿态 |
| `cloud` | `jindou-cloud.webp` | 宠物脚下云朵（可选） | 宽高比约 2:1，作为软影子替代 |

### 图片规格

- **尺寸**：建议每张是接近 1:1 的方图（引擎按正方形绘制：`drawImage` 用同一个 `size` 宽高）。像素无硬性要求，但建议 ≥ 256×256 以保证清晰。
- **背景**：透明。默认使用 WebP（体积更小、现代浏览器全支持）；如需兼容极老浏览器可换 PNG，同步改 `frames.*` 后缀即可。
- **构图**：角色在画面中央，四周留白对称，否则行走时会「偏腿」。

### ⚠️ `walk-right.webp` 的关键约束

> 引擎**不做运行时镜像翻转**。右行时直接绘制 `walkRight` 这张图。

这意味着：`walk-right.webp` **必须就是朝右的那一帧**，不能是朝左的图指望引擎帮你翻。换皮时请确保你的新右行帧直接出右朝向。

---

## 二、配置字段

换皮通常只需改 `pet.config.js` 里这几项：

| 字段 | 类型 | 说明 |
|---|---|---|
| `frames.*` | `string` | 精灵图路径（相对 `pet.html`）。换图后通常不用改，除非你改了文件名。 |
| `quotes` | `string[]` | 金句气泡文案。随口吻自由替换。 |
| `baseSize` | `number` | 宠物尺寸（px）。大图配大尺寸更稳。 |
| `cloudScaleW` / `cloudScaleH` | `number` | 云朵宽/高缩放（相对 `baseSize`）。换了云朵图后按其宽高比调。 |
| `cloudOffsetY` | `number` | 云朵纵向偏移（相对 `baseSize`，正数下移）。 |
| `talkFont` | `number` | 气泡字号。 |

> 引擎物理参数（`baseSpeed`、`friction`、`fleeRadius` 等）一般不用动，除非你想让新宠物的性格明显不同（更慢/更胆小等）。

---

## 三、换皮流程（四步）

1. **出图**：按「精灵图清单」产出 9 张图（默认 WebP，`cloud` 可选）。重点检查 `walk-right.webp` 确实朝右。
2. **放图**：把新图丢进 `assets/pet/`，覆盖同名文件（或改名后同步改 `pet.config.js` 的 `frames.*`）。
3. **改配置**：编辑 `pet.config.js`，调整 `quotes`（文案）、必要时调 `baseSize` / 云朵缩放。
4. **验证**：本地 `npx serve .` 打开 `http://localhost:3000/pet.html`，确认各方向行走朝向正确、金句正常、云朵位置合适。

---

## 四、给 skill 自动化的契约

如果你要写一个「基于 canvas-pet 生成新宠物」的 skill，它至少需要：

1. **产出 9 张图**，严格符合上表命名与方向约定（尤其右朝向）。
2. **输出一个 `pet.config.js`**，其中 `frames.*` 指向这些图、`quotes` 填该角色性格的文案、必要时调整 `baseSize`/云朵缩放。
3. **不要改动 `pet.js`**（引擎）。所有个性化都通过 config 表达；引擎行为保持稳定。
4. **可选**：替换 `index.html` 里的标题/介绍文案，做成新角色的落地页。

符合以上四点，生成的新 pet 目录即可直接作为独立 iframe 项目部署使用。
