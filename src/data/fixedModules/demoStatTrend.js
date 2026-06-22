/**
 * 定制模块示例：children 中每个 stableKey 都是唯一值，对应一个定制节点
 * 模块 = 位置/大小/标题 + 一组固定的定制子节点
 */
export const demoStatTrendModule = {
  "stableKey": "grid-item",
  "instanceId": "demo-stat-trend",
  "layout": {
    "x": 0,
    "y": 0,
    "w": 24,
    "h": 15,
    "draggable": true,
    "resizable": true
  },
  "props": {
    "title": "农业投入品监管概览"
  },
  "style": {
    "background": "var(--surface)",
    "borderRadius": "12px"
  },
  "runtime": {
    "visible": true,
    "zIndex": 1,
    "loading": false,
    "data": null
  },
  "children": [
    {
      "stableKey": "AgricultureOverviewKv",
      "instanceId": "demo-stat-trend-1",
      "parentInstanceId": "demo-stat-trend",
      "props": {
        "items": [
          {
            "label": "监管企业",
            "value": "320",
            "unit": "家"
          },
          {
            "label": "合格批次",
            "value": "1,280",
            "unit": "批"
          },
          {
            "label": "预警次数",
            "value": "18",
            "unit": "次"
          }
        ]
      },
      "style": {
        "flex": 1
      }
    }
    // {
    //   "stableKey": "AgricultureTrendRow",
    //   "instanceId": "demo-stat-trend-2",
    //   "parentInstanceId": "demo-stat-trend",
    //   "props": {},
    //   "style": {
    //     "flex": 2
    //   }
    // }
  ],
  "direction": "column"
}
