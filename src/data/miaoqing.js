export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 60,
      "h": 19,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "任务查询"
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
        "stableKey": "ElForm",
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "modelValue": {
            "keyword": "",
            "priority": "",
            "status": ""
          },
          "items": [
            {
              "type": "input",
              "prop": "keyword",
              "label": "关键词",
              "span": 8,
              "placeholder": "请输入任务名称或负责人"
            },
            {
              "type": "select",
              "prop": "priority",
              "label": "优先级",
              "span": 8,
              "options": [
                {
                  "label": "高",
                  "value": "high"
                },
                {
                  "label": "中",
                  "value": "medium"
                },
                {
                  "label": "低",
                  "value": "low"
                }
              ],
              "clearable": true
            },
            {
              "type": "select",
              "prop": "status",
              "label": "状态",
              "span": 8,
              "options": [
                {
                  "label": "进行中",
                  "value": "进行中"
                },
                {
                  "label": "待开始",
                  "value": "待开始"
                },
                {
                  "label": "已完成",
                  "value": "已完成"
                }
              ],
              "clearable": true
            }
          ],
          "actions": [
            {
              "type": "submit",
              "label": "查询"
            },
            {
              "type": "reset",
              "label": "重置",
              "plain": true
            }
          ],
          "labelWidth": "80px",
          "gutter": 24,
          "queryKey": "task-query"
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "b",
    "layout": {
      "x": 0,
      "y": 19,
      "w": 60,
      "h": 81,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "任务列表"
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
        "stableKey": "ElTable",
        "instanceId": "b-1",
        "parentInstanceId": "b",
        "props": {
          "data": [
            {
              "id": 1,
              "name": "前端页面重构",
              "priority": "高",
              "assignee": "张三",
              "status": "进行中",
              "deadline": "2024-01-15"
            },
            {
              "id": 2,
              "name": "API 接口联调",
              "priority": "中",
              "assignee": "李四",
              "status": "待开始",
              "deadline": "2024-01-20"
            },
            {
              "id": 3,
              "name": "数据库优化",
              "priority": "低",
              "assignee": "王五",
              "status": "已完成",
              "deadline": "2024-01-10"
            }
          ],
          "columns": [
            {
              "prop": "name",
              "label": "任务名称",
              "minWidth": 150
            },
            {
              "prop": "priority",
              "label": "优先级",
              "width": 100
            },
            {
              "prop": "assignee",
              "label": "负责人",
              "width": 100
            },
            {
              "prop": "status",
              "label": "状态",
              "width": 100
            },
            {
              "prop": "deadline",
              "label": "截止日期",
              "width": 120
            }
          ],
          "stripe": true,
          "size": "default",
          "queryKey": "task-query"
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  }
]
