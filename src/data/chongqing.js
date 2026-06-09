export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 13,
      "h": 32,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "趋势对比分析"
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
        "stableKey": "TextView",
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "content": "针对江苏小麦病虫害发生的区域差异与年度趋势，建议采取分区域、分时段的精准防控措施。\n\n近期全省小麦进入灌浆期，江淮、苏南部分地区蚜虫呈中等发生态势，苏北部地区白粉病、叶锈病逐步显现，发生趋势呈\"北病南虫、局部偏重\"的特点。\n\n5 月中下旬至 6 月上旬为病虫防控关键窗口期，蚜虫、白粉病进入高发期，防控压力集中。\n\n需聚焦江淮、沿江高风险区域，加密设备监测频次，重点排查蚜虫基数、白粉病病叶率，提前部署\"一喷三防\"作业，严防病虫扩散蔓延影响灌浆质量。",
          "format": "plain",
          "align": "left",
          "size": "normal"
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
      "y": 32,
      "w": 13,
      "h": 26,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "地区对比"
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
        "stableKey": "FilterBar",
        "instanceId": "b-1",
        "parentInstanceId": "b",
        "props": {
          "modelValue": {
            "statType": ""
          },
          "filters": [
            {
              "field": "statType",
              "type": "select",
              "label": "统计项",
              "options": [
                {
                  "label": "平均值",
                  "value": "avg"
                },
                {
                  "label": "累计值",
                  "value": "sum"
                }
              ],
              "clearable": true
            }
          ],
          "gap": 8
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "Chart",
        "instanceId": "b-2",
        "parentInstanceId": "b",
        "props": {
          "option": {
            "tooltip": {
              "trigger": "axis"
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "3%",
              "top": "5px",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "boundaryGap": false,
              "data": [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月"
              ]
            },
            "yAxis": {
              "type": "value"
            },
            "series": [
              {
                "name": "监测数值",
                "type": "line",
                "smooth": true,
                "data": [
                  120,
                  132,
                  101,
                  134,
                  90,
                  230
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 6
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "c",
    "layout": {
      "x": 0,
      "y": 58,
      "w": 13,
      "h": 42,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "年度对比"
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
        "stableKey": "FilterBar",
        "instanceId": "c-1",
        "parentInstanceId": "c",
        "props": {
          "modelValue": {
            "year": "",
            "statType": ""
          },
          "filters": [
            {
              "field": "year",
              "type": "select",
              "label": "年度选择",
              "options": [
                {
                  "label": "2024年",
                  "value": "2024"
                },
                {
                  "label": "2023年",
                  "value": "2023"
                },
                {
                  "label": "2022年",
                  "value": "2022"
                },
                {
                  "label": "2021年",
                  "value": "2021"
                },
                {
                  "label": "2020年",
                  "value": "2020"
                }
              ],
              "clearable": true
            },
            {
              "field": "statType",
              "type": "select",
              "label": "统计项",
              "options": [
                {
                  "label": "平均值",
                  "value": "avg"
                },
                {
                  "label": "累计值",
                  "value": "sum"
                }
              ],
              "clearable": true
            }
          ],
          "gap": 8
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "Chart",
        "instanceId": "c-2",
        "parentInstanceId": "c",
        "props": {
          "option": {
            "tooltip": {
              "trigger": "axis"
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "3%",
              "top": "5px",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "boundaryGap": false,
              "data": [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月"
              ]
            },
            "yAxis": {
              "type": "value"
            },
            "series": [
              {
                "name": "监测数值",
                "type": "line",
                "smooth": true,
                "data": [
                  120,
                  132,
                  101,
                  134,
                  90,
                  230
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 6
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "d",
    "layout": {
      "x": 13,
      "y": 0,
      "w": 34,
      "h": 72,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": ""
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
    "instanceId": "e",
    "layout": {
      "x": 13,
      "y": 72,
      "w": 17,
      "h": 28,
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
        "instanceId": "e-1",
        "parentInstanceId": "e",
        "props": {
          "data": [
            {
              "index": 1,
              "type": "蚜虫预警",
              "content": "江淮地区蚜虫密度超标，百株虫量达520头",
              "detail": "建议立即开展统防统治，选用吡虫啉等药剂进行喷雾防治",
              "time": "2024-05-15 09:30"
            },
            {
              "index": 2,
              "type": "白粉病预警",
              "content": "苏北地区白粉病病叶率上升至18%",
              "detail": "加强田间监测，及时喷施三唑酮等杀菌剂进行预防",
              "time": "2024-05-15 08:15"
            },
            {
              "index": 3,
              "type": "赤霉病预警",
              "content": "沿淮地区发现赤霉病初发症状",
              "detail": "抓住防治窗口期，开展二次用药防控",
              "time": "2024-05-14 16:45"
            },
            {
              "index": 4,
              "type": "叶锈病预警",
              "content": "徐州部分地区叶锈病病株率达12%",
              "detail": "建议使用戊唑醇等药剂进行针对性防治",
              "time": "2024-05-14 14:20"
            },
            {
              "index": 5,
              "type": "气象预警",
              "content": "预计5月18-20日有连阴雨，利于病害流行",
              "detail": "提前做好\"一喷三防\"准备，抢抓雨前防治时机",
              "time": "2024-05-14 10:00"
            }
          ],
          "columns": [
            {
              "prop": "index",
              "label": "序号",
              "width": 60
            },
            {
              "prop": "type",
              "label": "预警类型",
              "width": 100
            },
            {
              "prop": "content",
              "label": "预警内容",
              "minWidth": 150
            },
            {
              "prop": "time",
              "label": "时间",
              "width": 150
            },
            {
              "prop": "detail",
              "label": "详情",
              "minWidth": 180
            }
          ],
          "stripe": true,
          "border": false,
          "size": "default",
          "queryKey": "warningTable"
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
    "instanceId": "f",
    "layout": {
      "x": 30,
      "y": 72,
      "w": 17,
      "h": 28,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "相关建议"
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
        "stableKey": "TextView",
        "instanceId": "f-1",
        "parentInstanceId": "f",
        "props": {
          "content": "立足当前小麦病虫早发、快升态势，聚焦关键时期与重点区域，统筹开展统防统治、绿色防控：\n\n对纹枯病、白粉病：立即组织普防普治，重点加密中北部田块防控频次，压低病株基数，遏制扩散蔓延；\n\n对蚜虫：依据虫量达标即防，科学选用药剂，防止虫量快速上升影响灌浆；\n\n对赤霉病：密切监测病穗率，对局部偏重发生区及时施药控制，严防毒素超标；\n\n同步做好干热风、倒伏等气象灾害防御，确保\"虫口夺粮\"措施落地见效，稳定后期产量。",
          "format": "plain",
          "align": "left",
          "size": "normal"
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
    "instanceId": "g",
    "layout": {
      "x": 47,
      "y": 0,
      "w": 13,
      "h": 30,
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
    "children": [
      {
        "stableKey": "TextView",
        "instanceId": "g-1",
        "parentInstanceId": "g",
        "props": {
          "content": "一、江苏省 5 月小麦病虫情整体概述\n\n一、5 月江苏小麦进入灌浆关键期，受温度偏高影响，病虫呈\"早发、快升、局部偏重\"态势。蚜虫中等发生，江淮、苏南部分地区百株虫量超防控指标；白粉病在苏北、沿淮中等偏重发生，病株率持续上升；赤霉病已进入显症期，后期存在二次侵染风险。当前病虫基数显著高于去年同期，若遇连阴雨天气，存在加重流行风险。",
          "format": "plain",
          "align": "left",
          "size": "normal"
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
      "x": 47,
      "y": 30,
      "w": 13,
      "h": 33,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全省重大病虫发生动态"
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
        "stableKey": "FilterBar",
        "instanceId": "h-1",
        "parentInstanceId": "h",
        "props": {
          "modelValue": {
            "pestType": "",
            "statType": ""
          },
          "filters": [
            {
              "field": "pestType",
              "type": "select",
              "label": "害虫种类",
              "options": [
                {
                  "label": "蚜虫",
                  "value": "aphid"
                },
                {
                  "label": "白粉虱",
                  "value": "whitefly"
                },
                {
                  "label": "红蜘蛛",
                  "value": "spider_mite"
                },
                {
                  "label": "蓟马",
                  "value": "thrips"
                },
                {
                  "label": "菜青虫",
                  "value": "cabbage_worm"
                }
              ],
              "clearable": true
            },
            {
              "field": "statType",
              "type": "select",
              "label": "统计项",
              "options": [
                {
                  "label": "平均值",
                  "value": "avg"
                },
                {
                  "label": "累计值",
                  "value": "sum"
                }
              ],
              "clearable": true
            }
          ],
          "gap": 8
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "Chart",
        "instanceId": "h-2",
        "parentInstanceId": "h",
        "props": {
          "option": {
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "3%",
              "top": "5px",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "data": [
                "蚜虫",
                "白粉虱",
                "红蜘蛛",
                "蓟马",
                "菜青虫"
              ],
              "axisTick": {
                "alignWithLabel": true
              }
            },
            "yAxis": {
              "type": "value",
              "name": "数量 (头/台)"
            },
            "series": [
              {
                "name": "害虫数量",
                "type": "bar",
                "barWidth": "60%",
                "data": [
                  120,
                  85,
                  60,
                  45,
                  30
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 6
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "i",
    "layout": {
      "x": 47,
      "y": 63,
      "w": 13,
      "h": 37,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "实时监测数据"
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
        "instanceId": "i-1",
        "parentInstanceId": "i",
        "props": {
          "data": [
            {
              "city": "苏州市",
              "district": "常熟市",
              "pointName": "古里镇监测点A",
              "status": "在线",
              "pestType": "蚜虫",
              "count": 520
            },
            {
              "city": "徐州市",
              "district": "铜山区",
              "pointName": "大许镇监测点B",
              "status": "在线",
              "pestType": "白粉病",
              "count": 18
            },
            {
              "city": "淮安市",
              "district": "淮安区",
              "pointName": "施河镇监测点C",
              "status": "离线",
              "pestType": "赤霉病",
              "count": 5
            },
            {
              "city": "盐城市",
              "district": "东台市",
              "pointName": "安丰镇监测点D",
              "status": "在线",
              "pestType": "叶锈病",
              "count": 12
            },
            {
              "city": "扬州市",
              "district": "高邮市",
              "pointName": "临泽镇监测点E",
              "status": "在线",
              "pestType": "蚜虫",
              "count": 340
            }
          ],
          "columns": [
            {
              "prop": "city",
              "label": "市",
              "width": 80
            },
            {
              "prop": "district",
              "label": "区县",
              "width": 80
            },
            {
              "prop": "pointName",
              "label": "点位名称",
              "minWidth": 120
            },
            {
              "prop": "status",
              "label": "设备状态",
              "width": 80
            },
            {
              "prop": "pestType",
              "label": "害虫种类",
              "width": 80
            },
            {
              "prop": "count",
              "label": "害虫数量",
              "width": 80
            }
          ],
          "stripe": true,
          "border": false,
          "size": "small",
          "queryKey": "monitorTable"
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  }
]
