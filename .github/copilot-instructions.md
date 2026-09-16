本项目是一个 Nuxt 3 个人博客，使用 TypeScript + UnoCSS + pnpm monorepo。

## 核心架构

- 内容为 **Markdown 文件驱动**（@nuxt/content），Git 仓库是唯一数据源，**没有数据库**
- 后台通过 GitHub Git API 编辑 Markdown（server/utils/github.ts）
- 前台 SSG 预渲染，后台 SSR；部署在 Cloudflare Pages

## 编码规范

- 使用 Composition API + `<script setup lang="ts">`
- 所有 props 和 emits 必须类型化
- 不使用 `any`，优先使用精确类型
- 组件名 PascalCase，文件 PascalCase
- 工具函数 camelCase
- API 响应统一使用 `{ data, meta }` 或 `{ error }` 格式
- 样式优先使用 UnoCSS 原子类
- 不写 console.log，使用 Nuxt 的 `useLogger` 或 `console.warn/error`
- **不引入任何数据库**：内容读取走 `@nuxt/content`，写入走 GitHub Git API

## 目录约定

- `apps/web/components/common/` → 通用基础组件
- `apps/web/components/blog/` → 博客前台组件
- `apps/web/components/admin/` → 后台管理组件
- `apps/web/composables/` → 组合式函数，以 use 开头
- `apps/web/server/api/` → 后端 API 路由（仅 `auth/` 与 `admin/`）
- `apps/web/types/` → 全局类型定义
- `apps/web/content/posts/` → Markdown 文章（按年/月分层）

## 生成代码时

- 先检查 `types/` 目录中是否已有相关类型
- 新组件先检查 `components/` 中是否已有类似组件可复用
- API 路由要包含错误处理和输入校验
- 页面组件要包含 SEO meta（`useSeoMeta()` / `useBlogSeo()`）
