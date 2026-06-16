# canvas-pet

> 一行 `<iframe>` 即可给任何网页养一只会走的桌宠：走、睡、被鼠标吓跑、拖拽抛掷，偶尔冒一句金句气泡。纯前端、零依赖、零构建。

![canvas-pet](./assets/pet/idle.png)

---

## 快速开始

### 1. 本地预览

克隆后，在项目根目录起一个静态服务器（iframe 需通过 HTTP 访问，别直接双击文件）：

```bash
npx serve .
# 或
npx http-server -p 3000
```

浏览器打开 `http://localhost:3000/` 即可看到落地演示页；直接访问 `http://localhost:3000/pet.html` 是纯宠物页。

### 2. 嵌入到你的网页

**最简单：盒子嵌入**（宠物在固定尺寸的框内活动）

```html
<iframe src="https://你的域名/pet.html"
        width="320" height="240" frameborder="0"
        style="border:0;background:transparent;"
        title="canvas-pet"></iframe>
```

**进阶：全屏覆盖 + 点击穿透 + 拖拽**

让 iframe 满屏覆盖、默认鼠标穿透，只在命中宠物时接管指针。宿主端需要一段 postMessage 桥接代码——完整片段见 [`index.html`](./index.html) 的演示页，或 [docs/embed.md](./docs/embed.md)。

---

## 特性

| | |
|---|---|
| 🪶 **一行嵌入** | 任意网页加一个 iframe 即可，不改技术栈 |
| 🐾 **自然行为** | 随机在走 / 呆 / 睡之间切换，带呼吸、眨眼、影子、边界弹性 |
| 🖱️ **可拖拽** | 按住宠物拖动，松手带惯性抛出；靠近它会受惊逃跑 |
| 💬 **金句气泡** | 定时冒一句文案，文案在配置里随意改 |
| 🧩 **可换皮** | 替换 `assets/pet/` 下的精灵图 + 改配置，就是一只新宠物 |
| 🪟 **点击穿透** | 全屏覆盖模式下不挡页面交互，只在命中宠物时接管 |

---

## 自定义

**唯一要改的文件是 [`pet.config.js`](./pet.config.js)**——里面就是 `window.DouknowPetConfig` 对象。

常用字段：

| 字段 | 说明 | 默认 |
|---|---|---|
| `quotes` | 金句气泡的文案数组 | 12 条中文/英文金句 |
| `baseSize` | 宠物基础尺寸（px） | `88` |
| `petCountDesktop` / `petCountMobile` | 桌面/移动端的宠物数量 | `1` / `1` |
| `baseSpeed` / `maxSpeed` | 行走速度 | `0.72` / `2.6` |
| `fleeRadius` | 受惊逃跑的触发半径（px） | `92` |
| `talkIntervalRange` | 两次金句的间隔范围（ms） | `[9000, 18000]` |
| `parentSource` | 宿主页面 postMessage 的识别码 | `'pet-host'` |
| `frames.*` | 精灵图路径 | `./assets/pet/*.png` |

> `pet.js` 内部有一份 `DEFAULT_CONFIG` 兜底。即使删掉 `pet.config.js` 或某字段缺失，宠物也能正常运行（不会白屏）。

### 换皮肤

替换 `assets/pet/` 下的精灵图即可。命名规则和注意事项见 [docs/reskin.md](./docs/reskin.md)。

---

## 部署到 GitHub Pages

1. 把本项目推到 GitHub 仓库（建议仓库名 `canvas-pet`）。
2. 进入仓库 **Settings → Pages**。
3. **Source** 选 `Deploy from a branch`，分支选 `main`、目录选 `/(root)`，保存。
4. 等待约 1 分钟，访问 `https://<your-username>.github.io/canvas-pet/`。

之后你的宠物页地址就是：

```
https://<your-username>.github.io/canvas-pet/pet.html
```

把这个地址填进上面「嵌入到你的网页」的 iframe `src` 即可。

---

## 项目结构

```
canvas-pet/
├── index.html        # 落地演示页（GitHub Pages 根）
├── pet.html          # iframe 页 = 引擎宿主
├── pet.config.js     # 配置（改这一个文件）
├── pet.js            # 引擎（不建议改动）
├── assets/pet/       # 精灵图
└── docs/
    ├── embed.md      # 嵌入模式 + postMessage 协议
    └── reskin.md     # 换皮规范（模板契约）
```

---

## 许可证

[MIT](./LICENSE)。精灵图素材随项目一起按 MIT 发布，可自由使用。
