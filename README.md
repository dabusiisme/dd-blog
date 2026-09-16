# my-blog

基于 Nuxt 3 的个人博客：前台（SSG）+ 后台（SSR），Markdown 文件驱动，无数据库。

## 技术栈

Nuxt 3 · Vue 3 · TypeScript · UnoCSS · Pinia · @nuxt/content · pnpm monorepo · Cloudflare Pages

## 快速开始

```bash
pnpm install
cp .env.example .env   # 填写必要配置
pnpm dev               # http://localhost:3000
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm type-check` | 类型检查 |
| `pnpm lint` / `pnpm lint:fix` | 代码检查 / 修复 |

## 文档

- [TECH_SPEC.md](./TECH_SPEC.md) — 技术方案（权威）
- [PRD.md](./PRD.md) — 产品需求
- [AGENTS.md](./AGENTS.md) — AI 协作指引

## 结构

```text
├── apps/web/       # 主应用（Nuxt 3）
├── packages/       # config / shared / ui
└── pnpm-workspace.yaml
```
