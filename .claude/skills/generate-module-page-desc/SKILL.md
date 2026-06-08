---
name: generate-module-page-desc
description: Generates a structured markdown document describing the modular layout of a dashboard page based on user-specified page details. Use when the user asks to create or generate a modular page description, initial page layout description, or grid module documentation for a dashboard view.
---

# Generate Modular Initial Page Description

## Purpose

Generates a structured markdown document describing the modular layout of a dashboard page, including grid positions, module titles, and semantic explanations for each section.

## When to Use

- The user asks to generate a modular initial page description for a specific page.
- The user needs documentation for a dashboard's grid layout and module division.
- The user references creating module descriptions similar to `docs/首页/模块化初始页面描述.md`.

## Output Format

The generated document must follow the structure below. Adapt section counts and module names to match the target page.

```markdown
# [页面名称] 模块化初始页面描述

本文档描述 [页面视图路径] 在**初始数据**下的模块划分、标题与网格位置。布局数据来源于 [Store 路径] 中的 `root` 节点，由 `GridRenderer` 配合 `vue-grid-layout` 渲染。

## 1. 页面壳层（不进 Store）

| 区域 | 说明 |
|------|------|
| 页眉 | `DashboardHeader`，大屏标题文案为：**[标题]**（定义在 `[视图文件]` 的 `title`） |
| 主体 | `main#[id]`，内嵌 `GridRenderer`，根节点为 `store.root` |

根网格规格：**24 列 × 100 行**。下文位置均为 `(x, y, w, h)`，单位为网格格（非像素）。

## 2. 逻辑分区概览

简述从左到右的列划分，每列的业务主题。`root.children` 下一共 **[N]** 个网格子项。

## 3. 第 X 列（x: a～b，宽 w）

| stableKey | 类型说明 | 标题（`props.title`） | 位置 `(x, y, w, h)` |
|-----------|----------|----------------------|---------------------|
| `[key]` | 标题条/内容区 | `[标题]` | `(x, y, w, h)` |

...（每列一个表格）

## 8. 逐区文字说明

以下按「标题」与「内容区」分别给出一段说明，便于产品、设计与研发对齐语义。位置均指网格 `(x, y, w, h)`。

### 8.X [分区名]

**[stableKey] · [类型/标题]** · `(x, y, w, h)`

[一段语义说明：该区域是什么、适合放什么内容、与上下左右模块的关系。]

---

## 9. 模块数量口径说明

- **网格子项总数**：N
- **带明确业务中文标题的内容卡片**：约 M 个
- Store 中 `meta.name` 为「[名称]」

## 10. 相关文件

| 文件 | 作用 |
|------|------|
| `[视图文件]` | 大屏入口、页眉标题、挂载 `GridRenderer` |
| `[Store 文件]` | `root` 与子节点 `layout` / `props.title` 初始定义 |
| `src/components/GridRenderer.vue` | `col-num: 24`、行高按视口与 100 行折算、`GridItem` 渲染 |
| `src/components/DashboardModule.vue` | 单格模块展示（具体 UI 以组件为准） |
```

## Writing Rules

1. **Grid conventions**: Use `24 列 × 100 行` unless the user specifies otherwise. Positions are `(x, y, w, h)` in grid cells.
2. **Two types of items**:
   - **标题条**: `gridItemType: 'title'`, `props.title` is the Chinese title.
   - **内容区**: default `gridItemType`, `props.title` may be `false` if the title is handled by a separate title bar above it.
3. **Semantic descriptions**: For every module, write 1 concise paragraph explaining what it represents and what UI/data it should host.
4. **StableKey naming**: Use kebab-case, prefixed with `title-` for title bars and `mod-` for content modules.
5. **Column grouping**: Group modules by vertical columns, describe each column's x-range and width.

## Reference

For a complete example, see [reference.md](reference.md).
