export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 13,
      "h": 33,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "今日墒情"
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
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "option": {
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "legend": {
              "data": [
                "渍涝",
                "过湿",
                "适宜",
                "轻旱",
                "中旱",
                "重旱"
              ],
              "bottom": 0
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "10%",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "data": [
                "南京",
                "无锡",
                "徐州",
                "常州",
                "苏州",
                "南通",
                "连云港",
                "淮安",
                "盐城",
                "扬州",
                "镇江",
                "泰州",
                "宿迁"
              ],
              "bottom": "20%"
            },
            "yAxis": {
              "type": "value",
              "name": "监测点数"
            },
            "series": [
              {
                "name": "渍涝",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  5,
                  8,
                  2,
                  10,
                  3,
                  15,
                  12,
                  9,
                  7,
                  6,
                  4,
                  3,
                  8
                ]
              },
              {
                "name": "过湿",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  15,
                  20,
                  10,
                  25,
                  12,
                  30,
                  25,
                  20,
                  18,
                  16,
                  14,
                  12,
                  18
                ]
              },
              {
                "name": "适宜",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  120,
                  132,
                  101,
                  134,
                  90,
                  230,
                  210,
                  180,
                  150,
                  160,
                  140,
                  130,
                  170
                ]
              },
              {
                "name": "轻旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  20,
                  32,
                  11,
                  34,
                  10,
                  30,
                  20,
                  15,
                  25,
                  16,
                  14,
                  13,
                  17
                ]
              },
              {
                "name": "中旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  10,
                  12,
                  5,
                  14,
                  5,
                  10,
                  8,
                  5,
                  10,
                  6,
                  4,
                  3,
                  7
                ]
              },
              {
                "name": "重旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  2,
                  3,
                  1,
                  4,
                  1,
                  2,
                  1,
                  1,
                  2,
                  1,
                  1,
                  0,
                  1
                ]
              }
            ]
          }
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
    "instanceId": "c",
    "layout": {
      "x": 13,
      "y": 73,
      "w": 18,
      "h": 27,
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
        "instanceId": "c-1",
        "parentInstanceId": "c",
        "props": {
          "data": [
            {
              "index": 1,
              "type": "渍涝",
              "content": "南京地区土壤含水量过高",
              "time": "2024-03-15 14:30",
              "details": "点击查看"
            },
            {
              "index": 2,
              "type": "轻旱",
              "content": "宿迁部分地区出现轻度干旱",
              "time": "2024-03-15 13:45",
              "details": "查看详情"
            }
          ],
          "columns": [
            {
              "prop": "index",
              "label": "序号"
            },
            {
              "prop": "type",
              "label": "预警类型"
            },
            {
              "prop": "content",
              "label": "预警内容"
            },
            {
              "prop": "time",
              "label": "时间"
            },
            {
              "prop": "details",
              "label": "详情"
            }
          ],
          "stripe": true,
          "size": "small"
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
      "x": 31,
      "y": 73,
      "w": 16,
      "h": 27,
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
        "instanceId": "d-1",
        "parentInstanceId": "d",
        "props": {
          "content": "<p>坚持<strong style=\"color: #409EFF;\">\"排涝降湿为主、抗旱补墒为辅\"</strong>，按区域分类抓好田间管理：</p><p><strong style=\"color: #E6A23C;\">江淮、苏南及沿江过湿地区：</strong>立即疏通田间三沟，排除积水，降低地下水位，改善根际环境，防止渍害伤根，减轻纹枯病、白粉病发生蔓延；</p><p><strong style=\"color: #67C23A;\">淮北苏北墒情适宜区：</strong>以保墒稳墒为主，适度中耕松土，促进根系下扎，增强抗逆性；</p><p><strong style=\"color: #F56C6C;\">淮北苏北局部轻旱 / 中旱地块：</strong>根据苗情小水轻浇，切忌大水漫灌，避免影响群体质量。</p><p>同时结合墒情科学运筹灌浆肥，加强病虫害监测与统防统治，减轻后期不利天气影响，保障小麦正常灌浆。</p>",
          "format": "rich",
          "align": "left",
          "size": "small"
        },
        "style": {
          "flex": 1,
          "overflow": "auto",
          "lineHeight": "1.5",
          "paragraphSpacing": "8px"
        }
      }
    ],
    "direction": "row"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "f",
    "layout": {
      "x": 47,
      "y": 0,
      "w": 13,
      "h": 31,
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
        "instanceId": "f-1",
        "parentInstanceId": "f",
        "props": {
          "content": "<p>一、江苏省 5 月小麦墒情整体概述</p><p>5 月江苏小麦进入灌浆关键期，受前期降水和灌溉影响，全省墒情<strong style=\"color: #67C23A;\">总体适宜</strong>，但区域差异显著：</p><p><strong style=\"color: #E6A23C;\">江淮、苏南及沿江地区：</strong>土壤<strong style=\"color: #409EFF;\">偏湿为主</strong>，过湿点位占比偏高，存在渍涝隐患；</p><p><strong style=\"color: #E6A23C;\">淮北苏北地区：</strong>墒情总体适宜，局部地块墒情略偏低，存在轻至中度干旱风险。</p><p>整体呈现<strong style=\"color: #F56C6C;\">\"南湿北干、过湿与干旱并存\"</strong>的格局，对小麦根系活力和灌浆存在双向影响，需针对性做好排灌调控。</p>",
          "format": "rich",
          "align": "left",
          "size": "small"
        },
        "style": {
          "flex": 1,
          "overflow": "auto",
          "lineHeight": "1.5",
          "paragraphSpacing": "8px"
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
      "y": 33,
      "w": 13,
      "h": 32,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "近一周墒情变化趋势"
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
        "instanceId": "b-1",
        "parentInstanceId": "b",
        "props": {
          "option": {
            "title": {
              "text": "近一周墒情变化趋势"
            },
            "tooltip": {
              "trigger": "axis"
            },
            "legend": {
              "data": [
                "渍涝",
                "过湿",
                "适宜",
                "轻旱",
                "中旱",
                "重旱"
              ],
              "bottom": 0
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "10%",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "boundaryGap": false,
              "data": [
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
                "周日"
              ]
            },
            "yAxis": {
              "type": "value",
              "name": "湿度(%)",
              "splitLine": {
                "lineStyle": {
                  "type": "dashed"
                }
              }
            },
            "series": [
              {
                "name": "渍涝",
                "type": "line",
                "data": [
                  5,
                  8,
                  2,
                  10,
                  3,
                  15,
                  12
                ]
              },
              {
                "name": "过湿",
                "type": "line",
                "data": [
                  15,
                  20,
                  10,
                  25,
                  12,
                  30,
                  25
                ]
              },
              {
                "name": "适宜",
                "type": "line",
                "data": [
                  120,
                  132,
                  101,
                  134,
                  90,
                  230,
                  210
                ]
              },
              {
                "name": "轻旱",
                "type": "line",
                "data": [
                  20,
                  32,
                  11,
                  34,
                  10,
                  30,
                  20
                ]
              },
              {
                "name": "中旱",
                "type": "line",
                "data": [
                  10,
                  12,
                  5,
                  14,
                  5,
                  10,
                  8
                ]
              },
              {
                "name": "重旱",
                "type": "line",
                "data": [
                  2,
                  3,
                  1,
                  4,
                  1,
                  2,
                  1
                ]
              }
            ]
          }
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
      "x": 0,
      "y": 65,
      "w": 13,
      "h": 35,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "墒情统计表"
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
          "data": [],
          "columns": [
            {
              "prop": "region",
              "label": "区域代码",
              "minWidth": "60px"
            },
            {
              "prop": "level",
              "label": "区域名称",
              "minWidth": "60px"
            },
            {
              "prop": "value",
              "label": "20cm含水量",
              "width": "60px"
            },
            {
              "prop": "change",
              "label": "40cm含水量",
              "width": "60px"
            },
            {
              "prop": "sixtyCm",
              "label": "60cm含水量",
              "width": "60px"
            }
          ],
          "stripe": true,
          "size": "small"
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
      "y": 31,
      "w": 13,
      "h": 32,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "土壤墒情概览"
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
              "label": "设备数量",
              "value": "128",
              "unit": "台",
              "textDirection": "row"
            },
            {
              "label": "数据有效率",
              "value": "98.5",
              "unit": "%",
              "textDirection": "row"
            }
          ],
          "direction": "row",
          "textDirection": "row"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "Chart",
        "instanceId": "i-1",
        "parentInstanceId": "h",
        "props": {
          "option": {
            "title": null,
            "tooltip": {
              "trigger": "item"
            },
            "series": [
              {
                "name": "墒情类型",
                "type": "pie",
                "radius": "80%",
                "data": [
                  {
                    "value": 120,
                    "name": "适宜"
                  },
                  {
                    "value": 34,
                    "name": "过湿"
                  },
                  {
                    "value": 20,
                    "name": "轻旱"
                  },
                  {
                    "value": 10,
                    "name": "中旱"
                  },
                  {
                    "value": 2,
                    "name": "重旱"
                  },
                  {
                    "value": 5,
                    "name": "渍涝"
                  }
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 5
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "j",
    "layout": {
      "x": 47,
      "y": 63,
      "w": 13,
      "h": 37,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "今日墒情"
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
        "instanceId": "j-1",
        "parentInstanceId": "j",
        "props": {
          "option": {
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "legend": {
              "data": [
                "渍涝",
                "过湿",
                "适宜",
                "轻旱",
                "中旱",
                "重旱"
              ],
              "bottom": 0
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "10%",
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "data": [
                "南京",
                "无锡",
                "徐州",
                "常州",
                "苏州",
                "南通",
                "连云港",
                "淮安",
                "盐城",
                "扬州",
                "镇江",
                "泰州",
                "宿迁"
              ]
            },
            "yAxis": {
              "type": "value",
              "name": "监测点数"
            },
            "series": [
              {
                "name": "渍涝",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  5,
                  8,
                  2,
                  10,
                  3,
                  15,
                  12,
                  9,
                  7,
                  6,
                  4,
                  3,
                  8
                ]
              },
              {
                "name": "过湿",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  15,
                  20,
                  10,
                  25,
                  12,
                  30,
                  25,
                  20,
                  18,
                  16,
                  14,
                  12,
                  18
                ]
              },
              {
                "name": "适宜",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  120,
                  132,
                  101,
                  134,
                  90,
                  230,
                  210,
                  180,
                  150,
                  160,
                  140,
                  130,
                  170
                ]
              },
              {
                "name": "轻旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  20,
                  32,
                  11,
                  34,
                  10,
                  30,
                  20,
                  15,
                  25,
                  16,
                  14,
                  13,
                  17
                ]
              },
              {
                "name": "中旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  10,
                  12,
                  5,
                  14,
                  5,
                  10,
                  8,
                  5,
                  10,
                  6,
                  4,
                  3,
                  7
                ]
              },
              {
                "name": "重旱",
                "type": "bar",
                "stack": "total",
                "emphasis": {
                  "focus": "series"
                },
                "data": [
                  2,
                  3,
                  1,
                  4,
                  1,
                  2,
                  1,
                  1,
                  2,
                  1,
                  1,
                  0,
                  1
                ]
              }
            ]
          }
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
    "instanceId": "m",
    "layout": {
      "x": 13,
      "y": 0,
      "w": 34,
      "h": 73,
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
    "children": [
      {
        "stableKey": "MapView",
        "instanceId": "m-1",
        "parentInstanceId": "m",
        "props": {},
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  }
]
