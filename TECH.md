# TECH.md：Web 版个人作品集技术方案（Vue · 免构建 · 浏览器端运行）

**项目定位**：纯静态个人作品集，无需登录，无需服务端，直接在浏览器中运行。  
**核心约束**：前端使用 **Vue 3**，**不经过 Vite/Webpack 打包编译**，所有依赖通过 CDN/import map 加载，源码即产物。


## 1. 技术选型总览

| 层级             | 选型                                                | 理由                                                         |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| UI 框架          | **Vue 3**（ESM 浏览器构建版）                       | 用户指定；使用 `vue.esm-browser.prod.js` 支持运行时模板编译  |
| .vue 文件加载    | **vue3-sfc-loader**                                 | 浏览器端直接编译 `.vue` 单文件组件，无需 Node/构建步骤       |
| 动画引擎         | **GSAP + ScrollTrigger + SplitText**                | 通过 `<script>` 标签加载 CDN 版本，无需打包                  |
| 平滑滚动         | **Lenis**                                           | CDN 引入，轻量；无打包器时需手动引入其 CSS 或复制规则        |
| 样式             | **手写 CSS（自定义属性 + 少量工具类）**             | 免构建场景下 Tailwind 需要额外编译步骤，不适用；直接用现代 CSS 实现版式与响应式 |
| 粒子/Canvas 氛围 | **原生 Canvas 2D**                                  | 不引入 Three.js 等重型库，保持免构建架构简洁                 |
| 部署             | **任意静态托管**（Vercel / Netlify / GitHub Pages） | 纯静态文件，零服务端                                         |

**关键取舍**：放弃 Vite 意味着失去 HMR、tree-shaking、PostCSS 处理等构建期优化。换来的好处是**源码即部署产物**，修改 `.vue` 文件后刷新浏览器即可看到效果，无需任何编译等待。代价是运行时需要加载 `vue3-sfc-loader`（约数百 KB）并承担浏览器端编译开销，对作品集这种体量的项目完全可以接受。


## 2. 项目结构

```
portfolio/
├── index.html              # 入口，含 import map、路由配置、loader 引入
├── app.vue                 # 根组件
├── pages/
│   ├── home.vue            # 首屏 + 项目列表 + 关于
│   └── project.vue         # 项目详情（可选，可用锚点替代）
├── components/
│   ├── HeroParticles.vue   # Canvas 粒子
│   ├── ProjectCard.vue     # 项目卡片
│   └── ScrollSection.vue   # 滚动触发容器
├── data/
│   └── projects.js         # 项目数据（ESM 导出）
├── styles/
│   └── main.css            # 全局样式
└── assets/                 # 图片、字体
```


## 3. index.html 关键配置

### 3.1 Import Map（统一管理 CDN 依赖）

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js",
    "vue3-sfc-loader": "https://unpkg.com/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js",
    "gsap": "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js",
    "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js",
    "gsap/SplitText": "https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js",
    "lenis": "https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.mjs"
  }
}
</script>
```

> 注意：`vue.esm-browser.prod.js` 是**完整构建版**，包含运行时模板编译器，这是使用 `vue3-sfc-loader` 和字符串模板的前提。不要使用 `vue.runtime.esm-browser.js`。


### 3.2 路由与 Loader 初始化

```html
<script type="module">
import { loadModule } from 'vue3-sfc-loader'
import { createApp, defineAsyncComponent } from 'vue'

const options = {
  moduleCache: { vue: await import('vue') },
  async getFile(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`加载失败: ${url}`)
    return res.text()
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent })
    document.head.appendChild(style)
  }
}

const router = {
  '/': 'pages/home.vue'
}
const path = window.location.pathname === '/' ? '/' : window.location.pathname
const componentPath = router[path] || router['/']

const App = defineAsyncComponent(() => loadModule(componentPath, options))
createApp(App).mount('#app')
</script>
```

`vue3-sfc-loader` 在浏览器中完成 `.vue` 文件的解析、模板编译、脚本转译和样式注入。`getFile` 和 `addStyle` 由开发者提供，loader 只负责编译逻辑，网络请求和样式注入策略完全可控。


## 4. 可视化效果实现方案

### 4.1 GSAP 加载与注册

免构建场景下，GSAP 通过 CDN `<script>` 加载后，插件**建议手动注册**，避免依赖自动注册的不确定性：

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger, SplitText)
</script>
```

在 `.vue` 组件中直接使用全局 `gsap`，不需要 `import`。若希望统一管理，也可将 GSAP 放入 import map，但注意 GSAP 的 CDN 文件不是 ESM 格式，import map 方式需要额外处理。**推荐 `<script>` 标签方式**，最简单可靠。

### 4.2 首屏 Canvas 粒子（HeroParticles.vue）

```vue
<template>
  <canvas ref="canvas" class="hero-particles"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, particles = [], animId
const mouse = { x: -1000, y: -1000 }

function init(w, h) {
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 1
  }))
}

function draw() {
  const c = canvas.value
  ctx.clearRect(0, 0, c.width, c.height)
  for (const p of particles) {
    // 鼠标排斥
    const dx = p.x - mouse.x, dy = p.y - mouse.y
    const dist = Math.hypot(dx, dy)
    if (dist < 120) {
      p.vx += (dx / dist) * 0.05
      p.vy += (dy / dist) * 0.05
    }
    p.vx *= 0.98; p.vy *= 0.98
    p.x += p.vx; p.y += p.vy
    if (p.x < 0 || p.x > c.width) p.vx *= -1
    if (p.y < 0 || p.y > c.height) p.vy *= -1
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fill()
  }
  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  const c = canvas.value
  const dpr = Math.min(window.devicePixelRatio, 2)
  c.width = c.offsetWidth * dpr
  c.height = c.offsetHeight * dpr
  ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  init(c.offsetWidth, c.offsetHeight)
  draw()
  c.addEventListener('mousemove', e => {
    const rect = c.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })
})

onUnmounted(() => cancelAnimationFrame(animId))
</script>
```

**约束**：粒子数控制在 30–80 之间；当 `prefers-reduced-motion: reduce` 时，不启动粒子动画，仅渲染静态背景。


### 4.3 滚动触发与 SplitText

在任意组件的 `onMounted` 中：

```javascript
// 标题逐字入场
const split = new SplitText('.hero-title', { type: 'chars' })
gsap.from(split.chars, {
  duration: 0.8, y: 40, opacity: 0,
  stagger: 0.03, ease: 'power3.out'
})

// 章节滚动淡入
gsap.utils.toArray('.scroll-fade').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    y: 30, opacity: 0, duration: 0.6, ease: 'power2.out'
  })
})
```

`SplitText` 需要在字体加载完成后调用，避免拆分位置偏移。若使用 `prefers-reduced-motion`，跳过所有 `gsap.from`，内容直接可见。

### 4.4 Lenis 平滑滚动

免构建场景下 Lenis 通过 ESM CDN 引入：

```javascript
import Lenis from 'lenis'

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

**注意**：Lenis 的推荐样式表需要手动处理。无打包器时，从 CDN 引入 `lenis/dist/lenis.css` 或在全局 CSS 中复制其规则（主要是为 html/body 设置高度、处理 `data-lenis-prevent` 等边界情况）。若不做，平滑滚动仍可工作，但某些边缘场景（如 iframe 内滚动）可能异常。


## 5. 可访问性硬性要求

| 要求                            | 实现方式                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| **prefers-reduced-motion 降级** | 所有 GSAP 动画和粒子动画均需检查 `window.matchMedia('(prefers-reduced-motion: reduce)')`，为 true 时直接设置最终状态，跳过动画 |
| **动画暂停**                    | 首屏粒子若持续播放，在角落提供暂停/播放按钮（WCAG 2.2.2：自动播放超过 5 秒需可暂停） |
| **闪烁限制**                    | 任何闪烁动画不超过每秒 3 次                                  |
| **语义化**                      | 使用 `<main>`、`<section>`、`<h1>`–`<h3>`、`<nav>`，Canvas 设置 `aria-hidden="true"` |
| **焦点可见**                    | 不使用 `outline: none`，保留或自定义 `:focus-visible` 样式   |


## 6. 性能注意事项

1. **vue3-sfc-loader 的运行时编译开销**：每个 `.vue` 文件首次加载时编译，组件较多时首屏可能有可感知延迟。建议**控制组件数量**（作品集通常 5–10 个组件足够），或合并部分小组件。
2. **GSAP 动画性能**：只对 `opacity` 和 `transform` 做动画，避免 `width/height/top/left` 触发重排。
3. **CDN 缓存**：使用固定版本号的 CDN 链接（如 `gsap@3.13.0`），利用浏览器缓存。
4. **图片懒加载**：项目截图使用 `loading="lazy"` 或 Intersection Observer。
5. **移动端降级**：`window.innerWidth < 768` 时，粒子数量减半或关闭，Lenis 可关闭（原生滚动在移动端体验足够好）。


## 7. 部署

纯静态文件，直接上传到任意静态托管：

- **Vercel**：`vercel --prod` 或 Git 推送自动部署
- **Netlify**：拖拽文件夹或 Git 集成
- **GitHub Pages**：推送到 `gh-pages` 分支

无需 `npm run build`，源码目录即部署产物。唯一需要注意的是 CDN 版本的 Vue 必须是 `.prod.js` 结尾的生产版本，避免开发期警告和性能开销。


## 8. 与 RESEARCH.md 的衔接说明

RESEARCH.md 中建议的 `Vite + React + Tailwind` 构建方案，在本 TECH.md 中根据用户约束调整为 **Vue 3 + 免构建 + 手写 CSS**。调整的逻辑是：

- **框架**：React → Vue 3（用户指定）
- **构建**：Vite → 无构建（`vue3-sfc-loader` + ESM import map）
- **样式**：Tailwind → 手写 CSS（Tailwind 需要构建步骤，与免构建约束冲突）
- **动画**：GSAP + ScrollTrigger + SplitText 保持不变（CDN 脚本方式完全兼容免构建）
- **平滑滚动**：Lenis 保持不变（ESM CDN 引入）
- **粒子**：Three.js/OGL → 原生 Canvas 2D（减少依赖体积，保持架构简洁）

此方案牺牲了构建期优化和类型检查的便利性，换取了**零编译、即改即刷、源码即上线**的极简工作流。对于个人作品集这类规模的项目，这是一个合理的权衡。