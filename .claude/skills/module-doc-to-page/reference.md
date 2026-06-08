# module-doc-to-page · 实现核对表

在提交或交付前逐项核对（不适用项标 N/A）。

## 文档对齐

- [ ] `stableKey`、网格 `(x,y,w,h)` 与 `dashboardStore`（或布局源）一致
- [ ] 文档声明「不包含」的 UI 未实现
- [ ] 与 `title-*` / 邻块职责边界与文档一致（无重复标题、无错位 KPI）
- [ ] § 可见文案与静态数据与实现对读一遍

## 视觉与资源

- [ ] 关键色/边框/圆角/字号与文档或所引用 CSS 一致（有改写则已说明等价）
- [ ] 图片、背景图路径指向 `src/assets/...`（或项目约定），且文件已纳入仓库
- [ ] 叠层（absolute / z-index）在目标分辨率下无错位；响应式若有取舍已记录

## 代码与工程

- [ ] `widgetMap` 注册正确；无重复组件名映射
- [ ] `defineProps` / `defineEmits` 与文档 § 交互一致；可点击处具备无障碍语义
- [ ] 未引入对 `ui/lanhu_*` 的生产依赖
- [ ] `yarn lint`、`yarn build` 通过（本地 Node 满足 `engines`）
