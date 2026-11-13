/**
 * 项目列表：新增或修改项目只需编辑本文件。
 * 字段说明见 README；image 指向 assets/projects/ 下的概念视觉。
 */

export const projects = [
  {
    id: 'halo',
    index: '01',
    title: 'Halo 协作白板',
    subtitle: '让远程团队在同一块无限画布上同步思考',
    year: '2025',
    role: '前端负责人',
    team: '6 人',
    stack: ['Vue 3', 'TypeScript', 'Yjs', 'WebSocket', 'Canvas'],
    tags: ['实时协作', '本地优先'],
    image: 'assets/projects/halo.svg',
    problem: '远程评审时，想法散落在聊天、文档和截图里，决策上下文很难被完整保留。',
    solution:
      '以 CRDT 为同步内核的无限画布，把便签、批注和原型放在同一空间，弱网下也能继续编辑。',
    impact: ['评审会议时长 −38%', '内测团队周活 +21%', '支持 1,000+ 并发编辑'],
    detail: {
      context: '北辰科技内部孵化项目，服务 30+ 设计与产品团队。',
      bullets: [
        '设计基于 Yjs 的增量同步层，断线重连后自动合并本地变更。',
        '用分层 Canvas 渲染视口内元素，万级节点下保持 60fps。',
        '建立可撤销的操作日志与冲突提示，降低多人编辑的认知负担。'
      ],
      learning: '实时协作的难点不在同步算法，而在让用户理解「刚刚发生了什么」。'
    }
  },
  {
    id: 'prism',
    index: '02',
    title: 'Prism AI 内容工作台',
    subtitle: '把品牌调性变成可复用的 AI 内容流水线',
    year: '2025',
    role: '全栈工程师',
    team: '8 人',
    stack: ['Next.js', 'Node.js', 'LLM', 'RAG', 'PostgreSQL'],
    tags: ['AI 工作流', '品牌内容'],
    image: 'assets/projects/prism.svg',
    problem: '品牌团队要在 6 个平台生产内容，重复劳动多，调性还经常漂移。',
    solution:
      '把品牌知识库、模板化 Prompt 和人工审核串成一条可观测的内容流水线。',
    impact: ['单条内容 45min → 8min', '品牌词命中率 92%', '3 个团队日常使用'],
    detail: {
      context: '面向品牌与市场团队的内容生产平台。',
      bullets: [
        '搭建 RAG 检索层，对品牌手册、历史文案和禁用词做混合检索。',
        '设计结构化 Prompt 与评分器，让模型输出可比较、可回滚。',
        '用队列和审核状态机把 AI 生成接入现有内容流程。'
      ],
      learning: 'AI 产品的信任来自可控性：用户要知道它为什么这样写，以及如何改。'
    }
  },
  {
    id: 'pulse',
    index: '03',
    title: 'Pulse 实时监控台',
    subtitle: '让 SRE 在告警风暴里更快找到根因',
    year: '2024',
    role: '全栈工程师',
    team: '5 人',
    stack: ['React', 'Go', 'ClickHouse', 'WebSocket', 'D3'],
    tags: ['可观测性', '实时数据'],
    image: 'assets/projects/pulse.svg',
    problem: '告警风暴下，工程师要在 5 个系统之间跳转，平均 18 分钟才能定位根因。',
    solution:
      '把指标、日志和事件放在同一条时间线上，用服务拓扑联动下钻。',
    impact: ['MTTR −42%', '覆盖 300+ 服务', '查询 P95 < 800ms'],
    detail: {
      context: '面向平台工程与 SRE 团队的可观测性产品。',
      bullets: [
        '设计基于 ClickHouse 的采样查询与预聚合策略，控制大时间窗查询成本。',
        '用 WebSocket 推送增量事件，前端只更新变化的图表与拓扑节点。',
        '把告警、发布和变更事件对齐到同一时间轴，缩短因果判断路径。'
      ],
      learning: '可观测性产品的核心不是图表数量，而是缩短从「看到异常」到「知道原因」的距离。'
    }
  },
  {
    id: 'mori',
    index: '04',
    title: 'Mori 数字杂志',
    subtitle: '一次关于数字阅读节奏与排版的实验',
    year: '2024',
    role: '创意开发',
    team: '3 人',
    stack: ['Nuxt', 'GSAP', 'WebGL', 'Sanity'],
    tags: ['数字出版', '动效'],
    image: 'assets/projects/mori.svg',
    problem: '长文在手机上的阅读体验被信息流切碎，读者很难进入沉浸状态。',
    solution:
      '用编辑设计、渐进式图像加载和克制的滚动叙事，重建杂志式的阅读节奏。',
    impact: ['月均 12 万阅读', '首屏跳出率 −26%', '平均阅读时长 +54%'],
    detail: {
      context: '独立数字出版实验，与编辑、摄影师共同完成。',
      bullets: [
        '为每篇文章设计独立的排版节奏，而不是套用统一模板。',
        '用 GSAP ScrollTrigger 驱动章节过渡，保留 reduced-motion 降级。',
        '把图片与 WebGL 效果按需加载，移动端自动降级为静态图像。'
      ],
      learning: '动效的价值不是炫技，而是控制读者的注意力与阅读速度。'
    }
  },
  {
    id: 'atlas',
    index: '05',
    title: 'Atlas 设计系统',
    subtitle: '让 7 条产品线共享一套语言与组件',
    year: '2023',
    role: '前端架构',
    team: '4 人',
    stack: ['Vue', 'Storybook', 'Style Dictionary', 'Figma API'],
    tags: ['设计系统', '工程效率'],
    image: 'assets/projects/atlas.svg',
    problem: '7 条产品线各自维护组件，视觉不一致，重复开发严重。',
    solution:
      '从设计 token 到 headless 组件的单一管线，配合自动化视觉回归。',
    impact: ['新页面周期 −35%', '组件复用率 78%', '视觉回归覆盖 100%'],
    detail: {
      context: '跨产品线的前端基础设施项目。',
      bullets: [
        '用 Style Dictionary 把 Figma token 同步为 CSS 变量与平台产物。',
        '设计无样式 headless 组件，让各产品线保留品牌差异。',
        '接入 Playwright 截图回归，组件变更自动生成差异报告。'
      ],
      learning: '设计系统不是组件库，而是一套让团队做出一致决策的约束。'
    }
  },
  {
    id: 'echo',
    index: '06',
    title: 'Echo 无障碍阅读器',
    subtitle: '为阅读障碍用户重新设计网页阅读',
    year: '2023',
    role: '独立开发',
    team: '1 人',
    stack: ['Chrome Extension', 'Web Speech', 'IndexedDB', 'WCAG'],
    tags: ['无障碍', '浏览器扩展'],
    image: 'assets/projects/echo.svg',
    problem: '长文阅读对阅读障碍用户门槛很高，现有工具割裂且依赖云端。',
    solution:
      '本地优先的浏览器扩展，提供语音同步高亮、可调排版与阅读进度。',
    impact: ['2.4k 安装', '平均阅读时长 +54%', '完全本地处理'],
    detail: {
      context: '独立设计与开发的浏览器扩展，开源维护。',
      bullets: [
        '用 Web Speech API 做语音与文本同步高亮，支持语速和音色调节。',
        '基于 IndexedDB 保存阅读进度与偏好，不上传任何文本。',
        '按 WCAG 2.2 校验焦点、对比度与键盘操作。'
      ],
      learning: '无障碍设计最终会让所有用户受益：更清晰的层级、更可控的节奏。'
    }
  }
]

export default projects
