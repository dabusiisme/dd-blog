# AGENTS.md — 项目 AI 协作指引

个人博客项目。使用 pnpm monorepo 管理前后台与共享包。

> 本文件是 AI 助手（CodeBuddy / Copilot / Cursor 等）在本仓库工作时的**首要上下文**。
> 与 `TECH_SPEC.md` 历史内容冲突时，以本文件的技术决策为准（详见下方「文档指引」）。

---

## 1. 项目简介

基于 **Nuxt 3** 的个人博客：前台（文章列表 / 详情 / 标签 / 归档 / 搜索 / 评论）+ 后台（登录 / 文章管理 / 站点配置）。

## 2. 技术栈与核心架构决策

| 项 | 决策 |
|----|------|
| 框架 | Nuxt 3 + Vue 3 + TypeScript（严格模式，禁用 `any`） |
| 样式 | UnoCSS 原子类，避免 scoped CSS |
| 状态 | Pinia |
| 内容 | `@nuxt/content`，**Markdown 文件驱动**，Git 仓库是唯一数据源 |
| 数据库 | **不使用**（无 SQLite / D1 / 任何数据库） |
| 后台编辑 | 通过 GitHub REST API（Git Data API）提交 Markdown 变更，实现位于 `apps/web/server/utils/github.ts` |
| 认证 | 自实现 JWT Session（单管理员，httpOnly Cookie），不使用 Better Auth / Auth.js |
| 搜索 | Pagefind 构建时生成静态索引（P1） |
| 评论 | Giscus（GitHub Discussions） |
| 部署 | Cloudflare Pages：前台 SSG 预渲染 + Functions 承载后台 SSR 与 API |
| 包管理 | pnpm workspaces（^9.x） |

**发布机制**：后台保存文章 → Git API 提交到仓库 → Cloudflare Pages 自动构建部署 → 前台数分钟内生效。

## 3. Monorepo 结构要点

```text
├── apps/web/            # 主应用（Nuxt 3，前台 + 后台共存）
│   ├── components/      # common/ 通用 · blog/ 前台 · admin/ 后台
│   ├── composables/     # use 开头的组合式函数
│   ├── content/         # Markdown 源文件（posts/ 按年/月分层，pages/ 静态页）
│   ├── pages/           # 文件路由（admin/ 为后台路由）
│   ├── server/api/      # 仅 auth/ 与 admin/ 两组 API，无公开 REST API
│   ├── server/utils/    # github.ts（Git API 客户端）· auth.ts · markdown.ts
│   └── types/           # 全局类型定义
├── packages/            # shared / ui / config（预留扩展）
└── pnpm-workspace.yaml
```

## 4. 编码规范摘要（详见 TECH_SPEC.md 第四节）

- 组件：`<script setup lang="ts">`，单一职责 ≤200 行，Props/Emits 必须类型化，组件内部不发 API 请求
- 组件自动导入**无目录前缀**（`components/blog/PostCard.vue` → `<PostCard />`），`nuxt.config.ts` 已配置 `pathPrefix: false`
- 命名：组件 PascalCase · 页面/API 路由 kebab-case · composables 以 use 开头 · 常量 UPPER_SNAKE_CASE
- API 响应统一 `{ data, meta }` / `{ error }` 格式；后台 API 统一 `/api/admin/` 前缀
- 页面必须包含 SEO meta（`useSeoMeta()`）
- 不写 `console.log`，使用 `console.warn/error`

## 5. 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器
pnpm type-check     # 类型检查
pnpm build          # 构建
pnpm preview        # 预览生产构建
```

## 6. 工作流

- 分支：`main`（受保护）→ `develop` → `feature/*` / `fix/*`
- 提交：`type(scope): subject`，type ∈ feat|fix|docs|style|refactor|test|chore，scope ∈ web|content|server|ui|config|deploy

## 7. 文档指引

| 文档 | 作用 |
|------|------|
| [TECH_SPEC.md](./TECH_SPEC.md) | 技术权威：完整目录结构、规范细节、部署架构 |
| [PRD.md](./PRD.md) | 需求基线：功能范围（P0/P1/P2）、验收标准 |

> 注意：`TECH_SPEC.md` v1.0 中的 SQLite / 数据库 / Better Auth 相关章节已在 v1.1 中修订废弃。
> 当前有效决策：**无数据库 + Markdown 文件驱动 + Git API 后台 + Cloudflare Pages**。

## 8. AI 协作注意事项

生成或修改代码前，先确认：

1. **复用优先**：检查 `types/` 是否已有相关类型、`components/` 是否有类似组件
2. **无数据库红线**：任何情况下不引入数据库或 ORM；内容读取走 `@nuxt/content`，写入走 `server/utils/github.ts`
3. 新增 API 仅限 `server/api/auth/` 与 `server/api/admin/`，须包含鉴权、错误处理与输入校验
4. 前台页面改动需考虑 SSG 预渲染兼容性（不能依赖请求期动态数据）
5. 环境变量参考根目录 `.env.example`（Git 仓库凭据、认证密钥等）
6. 修改项目结构或技术栈时，**同步更新 TECH_SPEC.md 与本文件**
