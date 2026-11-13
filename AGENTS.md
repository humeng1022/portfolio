# AGENTS.md

> 本文件是给 AI 编码代理的“README”。项目定位、技术约束、开发规范均以本文件为准。本文件与 PRD.md、TECH.md、RESEARCH.md 配套使用；若内容冲突，以本文件为准（显式聊天指令优先级最高）。


## 1. 项目概述

纯静态、免登录、浏览器端直接运行的个人作品集网站。技术栈为 **Vue 3 + 免构建（无 Vite/Webpack）+ GSAP + Lenis + 原生 Canvas**。源码目录即部署产物，修改文件后刷新浏览器即生效。

**关联文档**：
- `PRD.md`：功能需求、验收标准、里程碑
- `TECH.md`：技术方案、项目结构、代码示例
- `RESEARCH.md`：风格调研与动效选型背景


## 2. 开发环境

| 项       | 要求                                                         |
| -------- | ------------------------------------------------------------ |
| 运行时   | 现代浏览器（Chrome/Edge/Firefox/Safari 最新两个大版本），需支持 import map |
| Node.js  | **不需要**。本项目无构建步骤，不使用 npm/pnpm/yarn 安装依赖  |
| 本地预览 | 任选一种：`python3 -m http.server 8000`、`npx serve .`、VS Code Live Server |
| 访问方式 | 浏览器打开 `http://localhost:8000`，**不可**用 `file://` 协议直接打开（fetch 加载 .vue 会被 CORS 拦截） |
| 部署     | 静态托管（Vercel / Netlify / GitHub Pages），上传源码目录即可 |

**启动命令**：
```bash
python3 -m http.server 8000
# 或
npx serve .
```

**验证**：修改任意 `.vue` 文件后刷新浏览器，变更应立即生效。若未生效，检查浏览器缓存或 CDN 加载是否失败。


## 3. 依赖管理

**所有依赖通过 CDN 加载，禁止引入构建工具或 `node_modules`。**

| 依赖                             | 版本策略                                         | 引入方式                                  |
| -------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| Vue 3                            | 固定版本号，**必须用 `vue.esm-browser.prod.js`** | import map                                |
| vue3-sfc-loader                  | 固定版本号                                       | import map                                |
| GSAP + ScrollTrigger + SplitText | 固定版本号                                       | `<script>` 标签 + `gsap.registerPlugin()` |
| Lenis                            | 固定版本号                                       | import map（ESM）                         |
| 字体/图片                        | 自托管或 CDN                                     | 直接引用                                  |

**规则**：
1. CDN 链接必须写**完整版本号**（如 `vue@3.5.13`），禁止 `@latest` 或浮动版本。
2. 新增依赖前先评估：能否用原生 API 实现？作品集规模下，**优先原生 Canvas/CSS，不引入 Three.js 等重型库**。
3. Vue 必须使用 `.prod.js` 结尾的**完整构建版**（含模板编译器），禁止 `runtime.esm-browser.js`。
4. GSAP 插件用 `<script>` 标签手动注册，不要尝试通过 import map 引入（其 CDN 文件非 ESM 格式）。


## 4. 代码风格

### 4.1 通用
- **JavaScript**：ESM 模块；优先 `const`；使用可选链 `?.` 和空值合并 `??`；字符串统一**单引号**。
- **Vue 组件**：统一使用 `<script setup>` 组合式 API；组件名 PascalCase（文件与标签一致）。
- **命名**：变量/函数 camelCase，组件/类 PascalCase，常量 UPPER_SNAKE_CASE，CSS 类名 kebab-case。
- **注释**：只注释“为什么”，不注释“是什么”；复杂动画逻辑需注明触发条件与降级路径。

### 4.2 文件组织
```
index.html              # 入口，import map、路由映射、loader 初始化
app.vue                 # 根组件
pages/                  # 页面级组件
components/             # 可复用组件（HeroParticles、ProjectCard 等）
data/projects.js        # 项目数据，唯一数据源
styles/main.css         # 全局样式与 CSS 自定义属性
assets/                 # 图片、字体
```

**规则**：
- 项目内容只改 `data/projects.js`，**不得把项目文案硬编码进组件模板**。
- 组件数量保持精简（5–10 个），每个 `.vue` 文件都会在浏览器端运行时编译，组件越多首屏越慢。
- 页面组件不直接操作 DOM 动画，动画逻辑集中在 `onMounted` 中并统一处理降级。

### 4.3 CSS
- 使用 **CSS 自定义属性**（`--color-bg`、`--spacing-section` 等）集中管理设计 token。
- 响应式用 `@media` 断点（建议 768px、1024px），不做移动端优先的复杂适配。
- **只对 `opacity` 和 `transform` 做动画**，禁止动画 `width/height/top/left`。
- 保留 `:focus-visible` 样式，**禁止全局 `outline: none`**。


## 5. 动效与可访问性硬性约束

**这是本项目最容易出错的区域，每条都必须遵守。**

1. **`prefers-reduced-motion` 全覆盖**：所有 GSAP 动画、粒子动画、Lenis 平滑滚动，必须检查 `window.matchMedia('(prefers-reduced-motion: reduce)')`。为 true 时：跳过 `gsap.from` 直接设最终状态、不启动粒子循环、不初始化 Lenis。
2. **持续动画可暂停**：首屏粒子播放超过 5 秒，必须在页面角落提供暂停/播放按钮（WCAG 2.2.2）。
3. **闪烁限制**：任何闪烁动画不超过每秒 3 次。
4. **SplitText 时机**：必须在字体加载完成后调用（`document.fonts.ready`），否则拆分位置偏移。
5. **粒子数量**：桌面 30–80 个，`innerWidth < 768` 时减半或关闭。
6. **语义化**：使用 `main/section/nav/h1-h3`；Canvas 设 `aria-hidden="true"`。
7. **动画克制**：同一视口不同时触发超过 2 组动画；文字动画仅用于标题层级。


## 6. 测试与验证

本项目**无自动化测试框架**（免构建约束下不引入测试工具）。每次改动后手动执行以下检查清单：

**功能检查**：
- [ ] 刷新浏览器，改动立即生效
- [ ] 所有锚点导航正常跳转，滚动时导航高亮正确
- [ ] 新增/修改 `data/projects.js` 后，卡片正确渲染
- [ ] 所有 CDN 链接可访问（浏览器 Network 面板无 404）

**可访问性检查**：
- [ ] 系统开启“减少动态效果”后，全站无自动播放动画、内容完整可读
- [ ] 粒子暂停按钮工作正常
- [ ] Tab 键遍历所有可交互元素，焦点可见

**响应式检查**：
- [ ] 375px 宽度下无横向滚动、无文字溢出
- [ ] 移动端粒子已降级

**性能检查**：
- [ ] 桌面首屏内容 2s 内可见（Network 面板验证）
- [ ] Lighthouse 移动端性能/可访问性 ≥80

**上线前**：
- [ ] `vue.esm-browser.prod.js` 确认是生产版本
- [ ] 所有 CDN 链接使用固定版本号
- [ ] 静态托管 URL 直接访问无 404


## 7. 提交与协作规范

**提交信息格式**：`[scope] 简述`，scope 取 `hero / projects / skills / about / contact / anim / style / deps / fix`。  
示例：`[projects] 新增 3 个项目卡片并接入 GSAP 滚动淡入`

**提交前必须**：
1. 完成第 6 节检查清单。
2. 确认未引入 `node_modules/`、`package.json`、构建配置文件。
3. 确认未将 CDN 版本改为浮动版本。

**禁止事项**：
- ❌ 引入 Vite、Webpack、Rollup 或任何构建工具
- ❌ 引入 Tailwind CSS（需要编译步骤）
- ❌ 将项目文案硬编码进组件
- ❌ 使用 `file://` 协议测试
- ❌ 全局禁用 `outline`
- ❌ 动画 `width/height/top/left`
- ❌ 忽略 `prefers-reduced-motion`


## 8. 常见问题

**Q：为什么不用 npm 装 Vue？**  
A：免构建是本项目的核心约束。npm 装的 Vue 是 CommonJS/ESM 包，浏览器无法直接 import；必须经打包器处理。用 CDN 的 `vue.esm-browser.prod.js` 才能直接 `<script type="module">` 加载。

**Q：为什么 `.vue` 文件能直接在浏览器运行？**  
A：`vue3-sfc-loader` 在浏览器端 fetch `.vue` 文件、编译模板、转译脚本、注入样式。代价是运行时编译开销，因此组件数需克制。

**Q：想加新动效，怎么判断能不能做？**  
A：先查 RESEARCH.md §2 和 TECH.md §4 是否已有方案；能用 GSAP/CDN 实现且不引入构建步骤的，可做；需要 npm 包或编译步骤的，不做。

**Q：新增页面怎么做？**  
A：在 `pages/` 新建 `.vue`，在 `index.html` 的 `router` 映射中注册路径。注意当前为单页锚点结构，新增独立页面需评估是否超出 PRD 范围。

**Q：CDN 挂了怎么办？**  
A：关键依赖（Vue）准备本地副本作为 fallback；部署前用 Network 面板验证所有链接。长期方案是将依赖下载到 `vendor/` 目录本地引用，但会牺牲“零依赖管理”的简洁性，按需权衡。


## 9. 文档优先级

冲突时按以下顺序裁决：

1. **用户显式聊天指令**（最高）
2. **本文件 AGENTS.md**
3. `TECH.md`（技术细节）
4. `PRD.md`（功能范围）
5. `RESEARCH.md`（背景参考，最低）

本文件为**活文档**，技术方案调整后应同步更新。