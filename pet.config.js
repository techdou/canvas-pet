/**
 * ============================================================
 * canvas-pet 配置文件
 * ============================================================
 * 这是唯一需要修改的文件：
 *   - 改金句 / 尺寸 / 速度 / 数量 → 改下面的 PET_CONFIG
 *   - 换皮肤（替换 assets/pet/ 下的图片）→ 改 frames 里的路径
 *
 * 若要基于此模板生成新的 pet 形象，请阅读 docs/reskin.md。
 *
 * 说明：
 *   - 本文件挂到 window.DouknowPetConfig，供 pet.js 读取。
 *   - pet.js 内部仍保留一份同名 DEFAULT_CONFIG 作为兜底，
 *     所以即使删除本文件或某字段缺失，宠物也能正常运行（不会白屏）。
 * ============================================================
 */
window.DouknowPetConfig = {
  petCountDesktop: 1,
  petCountMobile: 1,
  mobileBreakpoint: 768,
  baseSize: 88,
  sizeRange: [1, 1],
  baseSpeed: 0.72,
  maxSpeed: 2.6,
  dragThrowScale: 0.22,
  friction: 0.992,
  boundaryRestitution: 0.78,
  speedRange: [0.85, 1.15],
  stateDurationRange: [2800, 7600],
  fleeRadius: 92,
  fleeMultiplier: 2.7,
  fleeDuration: 520,
  walkFrameInterval: 180,
  winkChance: 0.002,
  winkDuration: 260,
  breathAmplitude: 0.025,
  breathFrequency: 1.35,
  planePadding: 6,
  // 云朵素材（PNG，宽高比约 2:1）
  cloudScaleW: 1.7,
  cloudScaleH: 0.85,
  cloudOffsetY: 0.16,
  // 哲理金句（随机轮播，改这里即可）
  talkIntervalRange: [9000, 18000],
  talkDuration: 4600,
  talkFadeMs: 360,
  talkFont: 15,
  talkMaxWidthRatio: 2.8,
  quotes: [
    '把每一个想法，做成能运行的东西。',
    '技术是骨架，人文是温度。',
    '不 FOMO，要 JOMO。',
    '写得慢，但写得真。',
    '克制地构建，认真地表达。',
    '从一行代码，到一台服务器。',
    '把路径写清楚，把选择讲明白。',
    '小工具的背后，是完整的工程能力。',
    '走得慢的人，不回头。',
    '先用起来，再谈完美。',
    '解决问题，比追新技术更值得。',
    'Build with rigor, write with soul.'
  ],

  // ===== 宿主页面识别码 =====
  // pet.html 被嵌入 iframe 时，只接受 source === parentSource 的 postMessage。
  // 宿主页面发送的所有消息都必须带上同一个 source 值。
  // 多个页面共用同一个 iframe 且需隔离时，可各自改成不同的 id。
  parentSource: 'pet-host',

  // ===== 精灵图路径（相对 pet.html 所在目录）=====
  // 默认形象：豆懂（豆秀禄）。WebP 格式，朝向已修正。
  frames: {
    idle: './assets/pet/idle.webp',
    idleWink: './assets/pet/idle-wink.webp',
    walkFront1: './assets/pet/walk-front-1.webp',
    walkFront2: './assets/pet/walk-front-2.webp',
    walkLeft: './assets/pet/walk-left.webp',
    // walk-right.webp 必须直接就是「朝右」的帧。
    // 引擎不做运行时镜像，因此出图时请确保右朝向正确（详见 docs/reskin.md）。
    walkRight: './assets/pet/walk-right.webp',
    walkBack: './assets/pet/walk-back-1.webp',
    sleep: './assets/pet/sleep.webp',
    cloud: './assets/pet/jindou-cloud.webp'
  }
};
