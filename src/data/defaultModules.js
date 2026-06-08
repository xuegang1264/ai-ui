export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 16,
      "h": 15,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "农技中心建设概况"
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
        "stableKey": "KvLayout",
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "items": [
            {
              "label": "规划数量",
              "value": "120",
              "unit": "个"
            },
            {
              "label": "完成建设",
              "value": "85",
              "unit": "个"
            },
            {
              "label": "建设中",
              "value": "25",
              "unit": "个"
            },
            {
              "label": "优化更新",
              "value": "10",
              "unit": "个"
            }
          ],
          "direction": "row"
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
      "y": 15,
      "w": 16,
      "h": 20,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "可调度人员"
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
    "children": [],
    "direction": "row"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "c",
    "layout": {
      "x": 0,
      "y": 35,
      "w": 16,
      "h": 14,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "建设内容"
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
        "stableKey": "KvLayout",
        "instanceId": "c-1",
        "parentInstanceId": "c",
        "props": {
          "items": [
            {
              "label": "农技工作人员",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "实践所",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "基地",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "服务场所",
              "value": "0",
              "unit": "个"
            }
          ],
          "direction": "row"
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
    "instanceId": "d",
    "layout": {
      "x": 44,
      "y": 0,
      "w": 16,
      "h": 15,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "农事中心建设概况"
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
        "stableKey": "KvLayout",
        "instanceId": "d-1",
        "parentInstanceId": "d",
        "props": {
          "items": [
            {
              "label": "规划数量",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "完成建设",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "建设中",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "优化更新",
              "value": "0",
              "unit": "个"
            }
          ],
          "direction": "row"
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
    "instanceId": "e",
    "layout": {
      "x": 16,
      "y": 0,
      "w": 28,
      "h": 74,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全国业务分布"
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
        "stableKey": "MapView",
        "instanceId": "e-1",
        "parentInstanceId": "e",
        "props": {},
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "f",
    "layout": {
      "x": 0,
      "y": 49,
      "w": 16,
      "h": 22,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "服务情况"
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
        "stableKey": "KvLayout",
        "instanceId": "f-1",
        "parentInstanceId": "f",
        "props": {
          "items": [
            {
              "label": "服务总次数",
              "value": "1,258",
              "unit": "次",
              "icon": "<svg viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#409EFF\" d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"/><path fill=\"#409EFF\" d=\"M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z\"/></svg>"
            },
            {
              "label": "服务覆盖农户",
              "value": "3,420",
              "unit": "户",
              "icon": "<svg viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#67C23A\" d=\"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM544 688c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v232zm144-232c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v232c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456zm144 0c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v232c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456zM336 688c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v232z\"/></svg>"
            }
          ],
          "direction": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "f-2",
        "parentInstanceId": "f",
        "props": {
          "items": [
            {
              "label": "服务任务数",
              "value": "156",
              "unit": "个"
            },
            {
              "label": "已派发",
              "value": "142",
              "unit": "个"
            },
            {
              "label": "进行中",
              "value": "85",
              "unit": "个"
            },
            {
              "label": "已完成",
              "value": "57",
              "unit": "个"
            }
          ],
          "direction": "row"
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "g",
    "layout": {
      "x": 0,
      "y": 71,
      "w": 16,
      "h": 29,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "服务绩效评估"
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
        "stableKey": "Chart",
        "instanceId": "g-1",
        "parentInstanceId": "g",
        "props": {
          "option": {
            "title": null,
            "tooltip": {},
            "radar": {
              "indicator": [
                {
                  "name": "农事服务",
                  "max": 100
                },
                {
                  "name": "农技服务",
                  "max": 100
                },
                {
                  "name": "预警信息",
                  "max": 100
                },
                {
                  "name": "农服建设",
                  "max": 100
                },
                {
                  "name": "专家服务",
                  "max": 100
                },
                {
                  "name": "覆盖评分",
                  "max": 100
                }
              ],
              "radius": "65%"
            },
            "series": [
              {
                "type": "radar",
                "data": [
                  {
                    "value": [
                      85,
                      90,
                      75,
                      80,
                      88,
                      92
                    ],
                    "name": "当前绩效",
                    "areaStyle": {
                      "color": "rgba(64, 158, 255, 0.3)"
                    },
                    "lineStyle": {
                      "color": "#409EFF"
                    }
                  }
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 2
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "g-2",
        "parentInstanceId": "g",
        "props": {
          "items": [
            {
              "label": "农事服务",
              "value": "85",
              "unit": "分"
            },
            {
              "label": "农技服务",
              "value": "90",
              "unit": "分"
            },
            {
              "label": "预警信息",
              "value": "75",
              "unit": "分"
            },
            {
              "label": "农服建设",
              "value": "80",
              "unit": "分"
            },
            {
              "label": "专家服务",
              "value": "88",
              "unit": "分"
            },
            {
              "label": "覆盖评分",
              "value": "92",
              "unit": "分"
            }
          ],
          "direction": "column",
          "textDirection": "row"
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
    "instanceId": "h",
    "layout": {
      "x": 44,
      "y": 15,
      "w": 16,
      "h": 85,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "农事服务能力概况"
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
        "stableKey": "KvLayout",
        "instanceId": "h-1",
        "parentInstanceId": "h",
        "props": {
          "items": [
            {
              "label": "服务次数",
              "value": "0",
              "unit": "次"
            },
            {
              "label": "服务面积",
              "value": "0",
              "unit": "亩"
            },
            {
              "label": "服务用户",
              "value": "0",
              "unit": "户"
            },
            {
              "label": "服务金额",
              "value": "0",
              "unit": "元"
            }
          ],
          "direction": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "LayoutNode",
        "instanceId": "h-2",
        "parentInstanceId": "h",
        "props": {
          "direction": "row",
          "gap": "12px",
          "wrap": false
        },
        "style": {
          "flex": 1
        },
        "children": [
          {
            "stableKey": "KvLayout",
            "instanceId": "h-2-1",
            "parentInstanceId": "h-2",
            "props": {
              "label": "机械化作业设施装备",
              "value": "0",
              "unit": "台/每套",
              "icon": "<svg viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#E6A23C\" d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"/><path fill=\"#E6A23C\" d=\"M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z\"/></svg>"
            },
            "style": {
              "flex": 1
            }
          },
          {
            "stableKey": "KvLayout",
            "instanceId": "h-2-2",
            "parentInstanceId": "h-2",
            "props": {
              "items": [
                {
                  "label": "拖拉机",
                  "value": "0",
                  "unit": "台/每套"
                },
                {
                  "label": "插秧机",
                  "value": "0",
                  "unit": "台/每套"
                },
                {
                  "label": "收割机",
                  "value": "0",
                  "unit": "台/每套"
                },
                {
                  "label": "植保机",
                  "value": "0",
                  "unit": "台/每套"
                }
              ],
              "direction": "column",
              "textDirection": "row"
            },
            "style": {
              "flex": 1
            }
          }
        ]
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "h-3",
        "parentInstanceId": "h",
        "props": {
          "items": [
            {
              "label": "农资采购订单",
              "value": "0",
              "unit": "个"
            },
            {
              "label": "农资采购金额",
              "value": "0",
              "unit": "元"
            }
          ],
          "direction": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "h-4",
        "parentInstanceId": "h",
        "props": {
          "label": "集中育苗供秧总面积",
          "value": "0",
          "unit": "万亩",
          "textDirection": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "h-5",
        "parentInstanceId": "h",
        "props": {
          "items": [
            {
              "label": "日烘干总能力",
              "value": "0",
              "unit": "万吨"
            },
            {
              "label": "粮食烘干机",
              "value": "0",
              "unit": "台/每套"
            }
          ],
          "direction": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "h-6",
        "parentInstanceId": "h",
        "props": {
          "label": "农机维修点",
          "value": "0",
          "unit": "个"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "LayoutNode",
        "instanceId": "h-7",
        "parentInstanceId": "h",
        "props": {
          "direction": "row",
          "gap": "12px",
          "wrap": false
        },
        "style": {
          "flex": 1
        },
        "children": [
          {
            "stableKey": "KvLayout",
            "instanceId": "h-7-1",
            "parentInstanceId": "h-7",
            "props": {
              "label": "应急救灾农机总数量",
              "value": "0",
              "unit": "台",
              "icon": "<svg viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#F56C6C\" d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"/><path fill=\"#F56C6C\" d=\"M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z\"/></svg>"
            },
            "style": {
              "flex": 1
            }
          },
          {
            "stableKey": "KvLayout",
            "instanceId": "h-7-2",
            "parentInstanceId": "h-7",
            "props": {
              "items": [
                {
                  "label": "履带式收割机",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                },
                {
                  "label": "履带式拖拉机",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                },
                {
                  "label": "烘干机",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                },
                {
                  "label": "粮食转运车辆",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                },
                {
                  "label": "喷灌机",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                },
                {
                  "label": "水泵",
                  "value": "0",
                  "unit": "台/每套",
                  "textDirection": "row"
                }
              ],
              "direction": "column",
              "textDirection": "row"
            },
            "style": {
              "flex": 1
            }
          }
        ]
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "i",
    "layout": {
      "x": 16,
      "y": 74,
      "w": 14,
      "h": 26,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "综合分析结论"
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
    "children": [],
    "direction": "row"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "j",
    "layout": {
      "x": 30,
      "y": 74,
      "w": 14,
      "h": 26,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "预警信息"
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
        "instanceId": "j-1",
        "parentInstanceId": "j",
        "props": {
          "data": [
            {
              "id": 1,
              "type": "设备离线",
              "content": "3号传感器信号中断",
              "time": "2024-05-20 14:30",
              "detail": "查看详情"
            },
            {
              "id": 2,
              "type": "数据异常",
              "content": "土壤湿度低于阈值",
              "time": "2024-05-20 13:15",
              "detail": "查看详情"
            },
            {
              "id": 3,
              "type": "任务超时",
              "content": "灌溉任务执行超时",
              "time": "2024-05-20 11:00",
              "detail": "查看详情"
            }
          ],
          "columns": [
            {
              "prop": "id",
              "label": "序号",
              "width": 60
            },
            {
              "prop": "type",
              "label": "预警类型",
              "minWidth": 100
            },
            {
              "prop": "content",
              "label": "预警内容",
              "minWidth": 120
            },
            {
              "prop": "time",
              "label": "时间",
              "width": 140
            },
            {
              "prop": "detail",
              "label": "详情",
              "width": 80
            }
          ],
          "size": "small",
          "stripe": true
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  }
]
