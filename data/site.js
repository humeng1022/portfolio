/**
 * 站点内的个人资料、技能、经历与联系方式。
 * 这里是除项目以外的唯一文案来源；修改后刷新浏览器即可生效。
 */

export const profile = {
  name: '陈墨',
  latinName: 'Chen Mo',
  role: '全栈工程师 / 创意开发',
  location: '上海，中国',
  coordinates: '31.23°N / 121.47°E',
  timezone: 'UTC+8',
  email: 'hello@chenmo.dev',
  availability: '开放远程合作',
  availabilityNote: '目前开放远程合作与全职机会，也乐意聊聊早期产品。',
  intro:
    '我是陈墨，一名全栈工程师。过去 6 年，我在 SaaS、实时协作与 AI 产品之间穿梭，负责从架构设计到界面落地的完整链路。',
  focus: 'Vue / TypeScript / Node.js / AI 产品',
  year: '2026',
  nowLabel: 'NOW / 2026',
  footerNote: '用 Vue 3 + GSAP 手工构建，无构建步骤。',
  stats: [
    { value: '6', suffix: '年', label: '工程经验' },
    { value: '28', suffix: '个', label: '上线项目' },
    { value: '4', suffix: '个', label: '开源项目' }
  ],
  socials: [
    { label: 'GitHub', handle: '@chenmo', href: 'https://github.com/chenmo' },
    { label: 'LinkedIn', handle: 'in/chenmo', href: 'https://www.linkedin.com/in/chenmo' },
    { label: 'X / Twitter', handle: '@chenmo_dev', href: 'https://x.com/chenmo_dev' }
  ],
  currently: [
    { label: '在做', value: 'AI 内容工作流平台' },
    { label: '在读', value: 'Designing Data-Intensive Applications' },
    { label: '坐标', value: '上海 · UTC+8' }
  ]
}

export const nav = [
  { id: 'projects', label: '项目', index: '01' },
  { id: 'skills', label: '技能', index: '02' },
  { id: 'about', label: '关于', index: '03' },
  { id: 'contact', label: '联系', index: '04' }
]

export const skills = [
  {
    id: '01',
    title: '前端工程',
    en: 'FRONTEND',
    summary: '把设计意图翻译成有节奏、可维护的界面。',
    items: ['Vue 3', 'TypeScript', 'React', 'Vite', 'GSAP', 'CSS Architecture']
  },
  {
    id: '02',
    title: '后端与数据',
    en: 'BACKEND',
    summary: '让数据在正确的时刻，以正确的形状到达界面。',
    items: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'ClickHouse', 'GraphQL']
  },
  {
    id: '03',
    title: 'AI 产品',
    en: 'AI PRODUCT',
    summary: '把模型能力变成用户可以信任的工作流。',
    items: ['LLM Apps', 'RAG', 'Prompt Design', 'Python', 'OpenAI API', 'Vector DB']
  },
  {
    id: '04',
    title: '工程化',
    en: 'ENGINEERING',
    summary: '让团队跑得更快，也让系统活得更久。',
    items: ['Docker', 'CI/CD', 'Observability', 'Playwright', 'Design Systems', 'Technical Writing']
  }
]

export const about = {
  statement: {
    lead: '好的工程，应该让人',
    accent: '感觉不到复杂。'
  },
  paragraphs: [
    '我在 2019 年开始写前端，很快发现真正让我着迷的不是某个框架，而是把复杂问题拆开、再重新组装成清晰体验的过程。',
    '现在，我更多以全栈的方式工作：和产品一起定义问题，和设计一起推敲细节，和工程团队一起把系统做得足够稳。我关注性能、可访问性与长期可维护性——这些看不见的部分，决定了产品能走多远。',
    '工作之外，我维护几个开源小工具，写技术笔记，也喜欢在城市里骑车找一家安静的咖啡馆。如果你正在做一件有意思的事，欢迎来信。'
  ],
  principles: [
    {
      index: '01',
      title: '先定义问题，再选择工具',
      text: '工具是手段，问题才是起点。能删掉的复杂度，就不要留给用户。'
    },
    {
      index: '02',
      title: '性能是体验的一部分',
      text: '用户不会为架构买单，只会为流畅、稳定和可预期买单。'
    },
    {
      index: '03',
      title: '可访问性是底线',
      text: '语义、焦点、对比度与动效降级，应该和功能一起被验收。'
    }
  ]
}

export const experience = [
  {
    period: '2023.06 — 至今',
    role: '高级全栈工程师',
    org: '北辰科技',
    location: '上海',
    current: true,
    points: [
      '从 0 到 1 搭建 AI 内容工作台，服务 3 个品牌团队。',
      '负责前端架构与设计系统，推动 7 条产品线统一语言。',
      '带领 4 人小组，建立 RFC、代码评审与发布检查流程。'
    ]
  },
  {
    period: '2021.04 — 2023.05',
    role: '全栈工程师',
    org: '云帆协作',
    location: '杭州',
    points: [
      '负责实时白板核心模块，设计 CRDT 同步与离线恢复。',
      '把首屏加载从 4.2s 优化到 1.6s，移动端崩溃率下降 60%。'
    ]
  },
  {
    period: '2019.07 — 2021.03',
    role: '前端工程师',
    org: '原点数字',
    location: '上海',
    points: [
      '交付 12 个品牌官网与电商项目，负责动效与可访问性。',
      '沉淀一套内部动效规范，减少约 30% 的返工。'
    ]
  },
  {
    period: '2015.09 — 2019.06',
    role: '数字媒体技术 · 学士',
    org: '同济大学',
    location: '上海',
    type: 'education',
    points: ['方向：交互设计与计算机图形学。', '毕业设计：基于 WebGL 的生成式视觉系统。']
  }
]

export const marqueeItems = [
  'DESIGN ENGINEERING',
  'REAL-TIME SYSTEMS',
  'AI PRODUCTS',
  'ACCESSIBILITY',
  'PERFORMANCE',
  'DESIGN SYSTEMS'
]
