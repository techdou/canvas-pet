# 嵌入方式与消息协议

canvas-pet 的 `pet.html` 设计为一个 **iframe 页**，与宿主页面通过 `window.postMessage` 双向通信。本文档说明两种嵌入模式及完整的消息字段表。

> 除非特别说明，所有 `postMessage` 的 `targetOrigin` 都可以用 `'*'`（页面内容是公开、无敏感数据的）。若你的宿主页部署在固定域名，建议把 `'*'` 换成 `'https://你的域名'`。

---

## 模式一：盒子嵌入（最简单）

给 iframe 一个固定尺寸，宠物在框内自由活动。**不需要任何 JS 桥接**——`pet.js` 自带本地指针事件，独立打开时也能走、能拖、会被鼠标吓跑。

```html
<iframe src="https://你的域名/pet.html"
        width="320" height="240" frameborder="0"
        style="border:0;background:transparent;"
        title="canvas-pet"></iframe>
```

适用场景：侧边栏、卡片角落、个人主页的某个区块。

局限：iframe 外的鼠标移动宠物感知不到（flee 只对框内鼠标生效）；跨 iframe 的全屏拖拽也不可用。这些在模式二中解决。

---

## 模式二：全屏覆盖 + 点击穿透 + 拖拽

让 iframe 满屏覆盖、默认 `pointer-events: none`（鼠标穿透），只在指针命中宠物时临时接管。这样宠物能满屏游走，又不挡宿主页的任何交互。

### 完整宿主端代码

```html
<iframe id="petFrame" src="https://你的域名/pet.html"
        style="position:fixed;inset:0;width:100vw;height:100vh;border:0;z-index:900;pointer-events:none;background:transparent;"></iframe>

<script>
(function () {
  const SOURCE = 'pet-host';          // 必须与 pet.config.js 的 parentSource 一致
  const frame = document.getElementById('petFrame');
  let hit = null, dragging = false;

  const inHit = (x, y) =>
    hit && x >= hit.left && x <= hit.right && y >= hit.top && y <= hit.bottom;

  // 始终把宿主鼠标坐标转发给 iframe（驱动 flee 行为）
  window.addEventListener('pointermove', e =>
    frame.contentWindow.postMessage(
      { source: SOURCE, type: 'douknow-pet-pointer', x: e.clientX, y: e.clientY }, '*'),
    { passive: true });

  // 命中宠物时启动拖拽，并临时打开 iframe 穿透
  window.addEventListener('pointerdown', e => {
    if (!inHit(e.clientX, e.clientY)) return;
    dragging = true;
    frame.style.pointerEvents = 'auto';
    frame.contentWindow.postMessage(
      { source: SOURCE, type: 'douknow-pet-drag-start', x: e.clientX, y: e.clientY }, '*');
  });

  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    frame.contentWindow.postMessage(
      { source: SOURCE, type: 'douknow-pet-drag-move', x: e.clientX, y: e.clientY }, '*');
  });

  const end = () => {
    if (!dragging) return;
    dragging = false;
    frame.style.pointerEvents = '';
    frame.contentWindow.postMessage({ source: SOURCE, type: 'douknow-pet-drag-end' }, '*');
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  // 接收 iframe 上报的宠物命中区
  window.addEventListener('message', e => {
    const d = e.data || {};
    if (d.source === 'douknow-pet' && d.type === 'douknow-pet-bounds') hit = d.bounds;
  });
})();
</script>
```

### 为什么需要「点击穿透」

iframe 覆满整个视口时，会吃掉宿主页所有的点击。把 `pointer-events` 默认设为 `none`，只在拖拽期间打开，宿主页的正常交互就完全不受影响。宿主端用 iframe 上报的 `bounds` 命中区来判断「这次按下是不是点在宠物上」。

---

## postMessage 协议字段表

所有消息都是普通对象，约定 `source` 字段标识来源。

### 宿主 → iframe（`source: 'pet-host'`，即 `parentSource`）

| `type` | 字段 | 说明 |
|---|---|---|
| `douknow-pet-pointer` | `x`, `y`（viewport 坐标） | 宿主鼠标实时坐标。用于驱动 flee（受惊逃跑）行为。建议每次 pointermove 都发。 |
| `douknow-pet-drag-start` | `x`, `y` | 通知 iframe 开始拖拽宠物。坐标即按下点。 |
| `douknow-pet-drag-move` | `x`, `y` | 拖拽中移动的坐标。 |
| `douknow-pet-drag-end` | （无） | 结束拖拽。松手后宠物带惯性抛出。 |
| `douknow-pet-surface` | `rect: {left, top, width, height}` | 可选。把宠物的活动范围限制在宿主页的某个矩形内（而非整个 iframe）。坐标相对 iframe 左上角。 |

### iframe → 宿主（`source: 'douknow-pet'`）

| `type` | 字段 | 说明 |
|---|---|---|
| `douknow-pet-bounds` | `bounds: {left, top, right, bottom, x, y, size, dragging}` | 宠物当前的命中区（viewport 坐标）。宿主据此决定按下是否接管指针。约每 80ms 或拖拽结束时上报一次。 |

---

## `parentSource` 的作用

`pet.html` 收到宿主消息时，会检查 `event.data.source === PET_CONFIG.parentSource` 才处理。这是为了让宠物只响应「预期的宿主」，避免被页面上其他无关脚本误触发。

- 默认值 `'pet-host'`，宿主端发送消息时带上 `source: 'pet-host'` 即可。
- 如果你想在同一页面嵌入多只互相独立的宠物，或想用更私密的识别码，把宿主端的 `SOURCE` 和 `pet.config.js` 的 `parentSource` 改成同一个自定义值即可。
