# 个人博客技术方案文档 (Tech Spec)

> **项目代号**: my-blog  
> **版本**: v1.1  
> **更新日期**: 2026-09-15  
> **技术栈**: Nuxt 3 + Vue 3 + TypeScript + pnpm Monorepo + Cloudflare Pages  

---

## 更新记录

- **v1.1（2026-09-15）**：内容存储确定为 **Markdown 文件驱动**（`@nuxt/content` + SSG），**移除 SQLite/数据库**；后台改为通过 **GitHub Git API** 编辑 Markdown，发布自动触发构建部署；部署平台确定为 **Cloudflare Pages**；统一 content 目录结构（按年/月分层）；API 路由归入 `/api/admin/` 前缀；ESLint 改为 flat config；明确搜索（Pagefind）与图片上传（R2）方案
- **v1.0（2026-09-13）**：初版

---

## 一、项目概述

基于 Nuxt 3 构建的个人博客系统，采用单项目架构（前后台共存），支持：

- Markdown / MDX 文章编写
- 前台：文章列表、详情、标签、归档、搜索（SSG 预渲染）
- 后台：文章 CRUD、图片上传、站点配置（SSR 动态运行）

### 核心架构决策

| 决策项 | 结论 |
|--------|------|
| 内容存储 | **Markdown 文件驱动**（`@nuxt/content`），Git 仓库是唯一数据源 |
| 数据库 | **不使用**（无 SQLite / D1 / 任何数据库） |
| 后台编辑 | 通过 **GitHub REST API（Git Data API）** 提交 Markdown 变更 |
| 发布机制 | 内容提交到仓库 → 自动触发构建 → 自动部署（分钟级生效） |
| 部署平台 | Cloudflare Pages（静态资产 CDN + Functions 承载后台 SSR 与 API） |

---

## 二、Monorepo 结构

```text
my-blog/
├── apps/
│   └── web/                        # 主应用（Nuxt 3）
│       ├── assets/                 # 样式、字体等静态资源
│       ├── components/             # 公共组件
│       │   ├── common/             # 通用基础组件（Button, Tag, Avatar）
│       │   ├── blog/               # 博客业务组件（PostCard, TOC, Comment）
│       │   └── admin/              # 后台管理组件（PostEditor, DashboardCard）
│       ├── composables/            # 组合式函数
│       │   ├── useAuth.ts          # 认证相关
│       │   ├── usePosts.ts         # 文章数据操作
│       │   └── useSiteConfig.ts    # 站点配置
│       ├── content/                # Markdown 文章源文件（Git 仓库为唯一数据源）
│       │   ├── posts/              # 文章（按年/月分层，见第五节）
│       │   │   └── 2026/
│       │   │       └── 09/
│       │   │           └── hello-world.md
│       │   └── pages/              # 额外静态页面
│       │       └── about.md
│       ├── layouts/                # 布局
│       │   ├── default.vue         # 前台布局
│       │   ├── admin.vue           # 后台布局
│       │   └── blank.vue           # 空白布局（登录页等）
│       ├── middleware/              # 路由中间件
│       │   ├── auth.global.ts      # 全局鉴权（后台路由保护）
│       │   └── redirect.ts         # 旧链接重定向
│       ├── pages/                  # 文件路由
│       │   ├── index.vue           # 首页
│       │   ├── posts/
│       │   │   └── [slug].vue      # 文章详情
│       │   ├── tags/
│       │   │   └── [tag].vue       # 标签筛选
│       │   ├── archive.vue         # 归档页
│       │   ├── search.vue          # 搜索页
│       │   └── admin/              # 后台路由
│       │       ├── index.vue       # 仪表盘
│       │       ├── login.vue       # 登录
│       │       ├── posts/
│       │       │   ├── index.vue   # 文章列表
│       │       │   ├── new.vue     # 新建
│       │       │   └── [id].vue    # 编辑
│       │       └── settings.vue    # 站点设置
│       ├── plugins/                # 客户端插件
│       │   ├── analytics.ts        # 统计
│       │   └── nprogress.ts        # 进度条
│       ├── public/                 # 纯静态资源（直接映射到 /）
│       │   ├── favicon.ico
│       │   ├── robots.txt
│       │   └── images/
│       ├── server/                 # 后端 API（公开内容由 @nuxt/content 构建时查询，无公开 REST API）
│       │   ├── api/                # API 路由
│       │   │   ├── auth/
│       │   │   │   └── login.post.ts
│       │   │   ├── admin/           # 后台 API（统一 /api/admin/ 前缀）
│       │   │   │   ├── posts/
│       │   │   │   │   ├── index.get.ts    # 列出全部文章（含草稿，经 Git API）
│       │   │   │   │   ├── index.post.ts   # 新建文章（提交到 Git）
│       │   │   │   │   ├── [id].put.ts     # 更新文章
│       │   │   │   │   └── [id].delete.ts  # 删除文章
│       │   │   │   └── config/
│       │   │   │       ├── index.get.ts    # 读取站点配置
│       │   │   │       └── index.put.ts    # 保存站点配置（提交到 Git）
│       │   │   └── upload.post.ts  # 图片上传（P2，存储到 Cloudflare R2）
│       │   ├── middleware/          # 服务端中间件
│       │   │   └── auth.ts          # API 鉴权（校验 JWT session）
│       │   ├── utils/              # 服务端工具
│       │   │   ├── github.ts       # GitHub Git API 客户端（读/写 Markdown）
│       │   │   ├── auth.ts          # JWT / session
│       │   │   └── markdown.ts      # MD 解析
│       │   └── tsconfig.json
│       ├── types/                  # 全局类型定义
│       │   ├── post.ts
│       │   ├── user.ts
│       │   └── api.ts
│       ├── utils/                  # 前端工具函数
│       │   ├── format.ts           # 日期格式化等
│       │   ├── seo.ts              # SEO 工具
│       │   └── constants.ts        # 常量
│       ├── nuxt.config.ts
│       ├── app.config.ts           # UI 主题配置（环境变量走 nuxt.config.ts 的 runtimeConfig）
│       ├── app.vue                 # 根组件
│       ├── error.vue               # 错误页
│       └── package.json
├── packages/                       # 共享包（预留扩展）
│   ├── shared/                     # 跨项目共享类型 & 工具
│   │   ├── src/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── package.json
│   ├── ui/                         # 共享组件库（预留）
│   │   ├── src/
│   │   └── package.json
│   └── config/                     # 公共配置（ESLint / TS / Vite）
│       ├── eslint/
│       ├── tsconfig.base.json
│       └── package.json
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint + type-check + build
│   │   └── deploy.yml              # 自动部署
│   └── copilot-instructions.md     # GitHub Copilot 指令文件
├── pnpm-workspace.yaml
├── package.json
├── eslint.config.mjs              # ESLint flat config（ESLint 9+）
├── .prettierrc
├── .editorconfig
├── .gitignore
├── .env.example                    # 环境变量模板
├── README.md
└── TECH_SPEC.md                    # 本文档
```

---

## 三、技术栈清单

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Nuxt 3 | ^3.14 | Vue 3 + Vite + SSR/SSG |
| UI | UnoCSS | ^0.65 | 原子化 CSS，AI 友好 |
| 内容 | @nuxt/content | ^2.13 | Markdown / MDX 处理 |
| 状态 | Pinia | ^2.2 | 全局状态 |
| 类型 | TypeScript | ^5.6 | 严格模式 |
| 包管理 | pnpm | ^9.x | workspaces |
| 代码规范 | ESLint + Prettier | - | 统一格式 |
| 提交规范 | Commitlint | - | conventional commits |
| 部署 | Cloudflare Pages | - | 静态资产 CDN + Functions（后台 SSR / API） |
| 内容编辑 | GitHub REST API | v3 | 后台通过 Git API 提交 Markdown 变更 |
| 认证 | 自实现 JWT Session | - | 单管理员，httpOnly Cookie |
| 搜索索引 | Pagefind | ^1.x | 构建时生成静态搜索索引（P1） |
| 评论 | Giscus | - | GitHub Discussions 驱动 |
| 对象存储 | Cloudflare R2 | - | 图片上传（P2 可选） |

---

## 四、核心约定

### 4.1 命名规范

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `PostCard.vue` |
| 页面文件 | kebab-case | `posts/[slug].vue` |
| composables | camelCase，use 前缀 | `useAuth.ts` |
| utils | camelCase | `formatDate.ts` |
| 类型文件 | camelCase | `post.ts` |
| API 路由 | kebab-case | `posts/index.get.ts` |
| 变量/函数 | camelCase | `fetchPosts()` |
| 类型/接口 | PascalCase | `Post`, `PostListResponse` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |

### 4.2 组件设计原则

- **每个组件单一职责**，不超过 200 行（超了就拆）
- Props 必须有类型定义，不使用 `any`
- 事件使用 `defineEmits` 明确声明
- 组件内部不发起 API 请求（数据通过 Props 传入）
- 组件自动导入**不使用目录前缀**（`components/blog/PostCard.vue` 直接以 `<PostCard />` 使用），需在 `nuxt.config.ts` 配置：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  components: [{ path: '~/components', pathPrefix: false }],
})
```

```vue
<!-- ✅ 好的写法 -->
<script setup lang="ts">
interface Props {
  post: Post
  showExcerpt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showExcerpt: true,
})

const emit = defineEmits<{
  (e: 'click', post: Post): void
}>()
</script>
```

### 4.3 类型定义规范

- 所有 API 请求/响应都有对应类型
- Markdown frontmatter 类型化
- 共享类型放在 `types/` 目录

```ts
// types/post.ts
export interface PostFrontmatter {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  draft?: boolean
  cover?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  body: string
  readingTime: number
  toc: TocItem[]
}

export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}
```

### 4.4 API 设计约定

- RESTful 风格
- 统一响应格式：

```ts
// 成功
{ "data": T, "meta"?: Record<string, unknown> }

// 失败
{ "error": { "code": string, "message": string, "details"?: unknown } }
```

- 后台 API 统一加 `/api/admin/` 前缀
- 前台**不提供公开 REST API**：公开内容（文章/标签/归档）由 `@nuxt/content` 在构建时从 Markdown 查询生成
- 后台写操作统一通过 GitHub Git API 落盘到仓库，触发自动构建部署（见第八节发布流程）

### 4.5 路由规则

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/posts/**': { prerender: true },
    '/tags/**': { prerender: true },
    '/archive': { prerender: true },
    '/search': { prerender: true },
    '/admin/**': { ssr: true },
    '/api/admin/**': { cors: true },
    '/api/auth/**': { cors: true },
  }
})
```

---

## 五、Markdown 内容模型

### Frontmatter 规范

```yaml
---
title: "文章标题"
description: "文章摘要，用于 SEO 和列表展示"
publishedAt: "2026-09-13"
updatedAt: "2026-09-14"        # 可选
tags: ["Vue", "Nuxt", "博客"]
draft: false                   # true = 不发布
cover: "/images/posts/xxx.png" # 可选
featured: false                # 是否置顶推荐
---

文章内容（Markdown / MDX）
```

### 内容目录结构

```text
content/
├── posts/
│   ├── 2026/
│   │   ├── 09/
│   │   │   ├── hello-world.md
│   │   │   └── vue-nuxt-blog.md
│   │   └── 10/
│   └── drafts/                # 草稿，不发布
│       └── wip-article.md
└── pages/
    ├── about.md
    └── friends.md
```

### 搜索索引（P1）

搜索基于 **Pagefind** 在构建时生成的静态索引，随 SSG 产物一起部署到 CDN，全程无服务端参与：

- 构建流程：`nuxt build`（SSG 预渲染）→ `pagefind --site dist/` 生成索引
- 前端通过 Pagefind 的浏览器端 JS API 调用，支持标题与正文匹配

---

## 六、AI 协作规范

### 6.1 AI 上下文文件

每个重要目录放置 `AI_CONTEXT.md`（可选），描述该目录的用途和编码约束：

```markdown
<!-- components/blog/AI_CONTEXT.md -->
# Blog Components

本目录包含博客前台业务组件。

## 约束
- 所有组件必须使用 TypeScript
- 不在此目录发起 API 请求
- 样式使用 UnoCSS，不使用 scoped CSS（除非必要）
- 组件名前缀不需要加 Blog（已在目录层级区分）
```

### 6.2 GitHub Copilot 指令

```markdown
<!-- .github/copilot-instructions.md -->
本项目是一个 Nuxt 3 个人博客，使用 TypeScript + UnoCSS + pnpm monorepo。

## 编码规范
- 使用 Composition API + `<script setup lang="ts">`
- 所有 props 和 emits 必须类型化
- 不使用 `any`，优先使用精确类型
- 组件名 PascalCase，文件 PascalCase
- 工具函数 camelCase
- API 响应统一使用 `{ data, meta }` 或 `{ error }` 格式
- 样式优先使用 UnoCSS 原子类
- 不写 console.log，使用 Nuxt 的 `useLogger` 或 `console.warn/error`
- **不引入任何数据库**：内容读取走 `@nuxt/content`，写入走 GitHub Git API（`server/utils/github.ts`）

## 目录约定
- `components/common/` → 通用基础组件
- `components/blog/` → 博客前台组件
- `components/admin/` → 后台管理组件
- `composables/` → 组合式函数，以 use 开头
- `server/api/` → 后端 API 路由（仅 `auth/` 与 `admin/`）
- `types/` → 全局类型定义
- `content/posts/` → Markdown 文章

## 生成代码时
- 先检查 types/ 目录中是否已有相关类型
- 新组件先检查 components/ 中是否已有类似组件可复用
- API 路由要包含错误处理和输入校验
- 页面组件要包含 SEO meta
```

### 6.3 Cursor Rules（如用 Cursor）

在项目根目录创建 `.cursorrules`：

```
You are working on a Nuxt 3 personal blog project.

Tech stack: Vue 3, TypeScript, Nuxt 3, UnoCSS, pnpm monorepo, @nuxt/content.

Rules:
1. Always use TypeScript, no `any`
2. Use `<script setup lang="ts">` for all Vue components
3. Follow the directory structure defined in TECH_SPEC.md
4. Components go in components/common/, components/blog/, or components/admin/
5. API routes go in server/api/ with proper HTTP method suffixes (.get.ts, .post.ts)
6. All API responses use unified format: { data, meta } or { error }
7. Use UnoCSS for styling, avoid scoped CSS
8. Pages must include SEO meta via useSeoMeta()
9. Check types/ directory before creating new types
10. No console.log in production code
11. No database — content is file-based (@nuxt/content); writes go through GitHub Git API (server/utils/github.ts)

When generating code:
- Provide complete, working code (not snippets)
- Include imports
- Include type definitions if new types are needed
- Add brief comments for non-obvious logic
```

---

## 七、开发工作流

### 7.1 分支策略

```
main          # 生产分支，受保护
develop       # 开发分支
feature/*     # 功能分支
fix/*         # 修复分支
```

### 7.2 提交规范

```
type(scope): subject

type: feat | fix | docs | style | refactor | test | chore
scope: web | content | server | ui | config | deploy

示例：
feat(web): add tag filter page
fix(server): handle empty post list
docs(content): update hello-world.md
```

### 7.3 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 构建
pnpm build

# 预览生产构建
pnpm preview
```

---

## 八、部署架构

```
┌──────────────┐  push（自动触发构建部署） ┌───────────────────────────────┐
│  GitHub 仓库  │ ──────────────────────▶ │       Cloudflare Pages         │
│ (唯一数据源)  │                         │  ┌──────────┐ ┌────────────┐  │
│  Markdown    │                         │  │ Static   │ │ Functions  │  │
│  站点配置     │ ◀──── Git API 写入 ──── │  │ CDN 前台 │ │ 后台 SSR   │  │
└──────────────┘   （后台编辑文章）       │  └──────────┘ └─────┬──────┘  │
                                         └────────────────────┼─────────┘
                                                              │
                                                     ┌────────▼────────┐
                                                     │ GitHub REST API  │
                                                     │ (读写 Markdown)  │
                                                     └─────────────────┘
```

### 构建输出

- 前台页面：`dist/` 中的 HTML 文件（预渲染）+ Pagefind 搜索索引
- 后台页面：由 Cloudflare Functions 动态渲染
- API：Cloudflare Functions（仅 `/api/auth/**` 与 `/api/admin/**`）

### 发布流程

1. 博主在后台编辑文章 → 服务端调用 GitHub Git API 将 Markdown 变更提交到仓库
2. Cloudflare Pages 检测到 push，自动触发构建（SSG 预渲染 + Pagefind 索引生成）
3. 构建完成自动部署，前台数分钟内生效
4. 构建失败时 Cloudflare 保留上一版本线上可用，后台提示错误且不丢失编辑内容

---

## 九、环境变量

```bash
# .env.example
# 站点配置
NUXT_PUBLIC_SITE_NAME="My Blog"
NUXT_PUBLIC_SITE_URL="https://example.com"
NUXT_PUBLIC_GA_ID=""              # Google Analytics

# 认证（单管理员）
NUXT_AUTH_SECRET="your-secret-key"
NUXT_ADMIN_USERNAME="admin"
NUXT_ADMIN_PASSWORD_HASH="..."     # 密码哈希（如 bcrypt/argon2）

# 内容仓库（后台 Git API 编辑）
NUXT_GITHUB_TOKEN="ghp_xxx"        # 具有 repo 读写权限的 PAT
NUXT_GITHUB_OWNER="your-username"
NUXT_GITHUB_REPO="my-blog"
NUXT_GITHUB_BRANCH="main"

# 评论（Giscus）
NUXT_PUBLIC_GISCUS_REPO=""
NUXT_PUBLIC_GISCUS_REPO_ID=""
```

---

## 十、MVP 功能范围

| 阶段 | 功能 | 优先级 |
|------|------|--------|
| P0 | Markdown 文章列表 + 详情 | ✅ 必须 |
| P0 | 标签筛选 | ✅ 必须 |
| P0 | 后台登录 + 文章 CRUD（Git API） | ✅ 必须 |
| P1 | 归档页 | ✅ 应该 |
| P1 | 搜索（Pagefind 静态索引） | ✅ 应该 |
| P1 | 评论（Giscus） | ✅ 应该 |
| P2 | RSS Feed | 可选 |
| P2 | 站点地图 | 可选 |
| P2 | 暗色模式 | 可选 |
| P2 | 图片上传（Cloudflare R2） | 可选 |

---

## 十一、AI 辅助开发 Checklist

开发新功能时，AI 应确认以下事项：

- [ ] 是否已有相关类型定义？→ 检查 `types/`
- [ ] 是否已有类似组件可复用？→ 检查 `components/`
- [ ] 是否需要新增 API 路由？→ 检查 `server/api/`
- [ ] 页面是否需要 SEO meta？→ 使用 `useSeoMeta()`
- [ ] 是否需要权限控制？→ 后台路由加 `middleware/auth.global.ts`
- [ ] 是否有对应的单元测试？→ 后续补充

---

## 十二、参考资源

- [Nuxt 3 官方文档](https://nuxt.com/docs)
- [Nuxt Content 文档](https://content.nuxt.com/)
- [UnoCSS 文档](https://unocss.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Cloudflare Pages + Nuxt](https://nuxt.com/deploy/cloudflare)

---

> **本文档是 AI 协作的核心上下文文件。修改项目结构或技术栈时，请同步更新本文档。**