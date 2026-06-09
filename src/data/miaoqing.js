export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 13,
      "h": 67,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全省苗情动态变化"
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
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "data": [
            {
              "time": "2024-01",
              "wangzhang": "12.5",
              "wangzhangRatio": "8.2%",
              "you": "45.3",
              "youRatio": "29.8%",
              "hao": "68.7",
              "haoRatio": "45.1%",
              "yiban": "26.1",
              "yibanRatio": "17.1%"
            },
            {
              "time": "2024-02",
              "wangzhang": "15.2",
              "wangzhangRatio": "10.0%",
              "you": "52.1",
              "youRatio": "34.2%",
              "hao": "62.4",
              "haoRatio": "40.9%",
              "yiban": "23.2",
              "yibanRatio": "15.2%"
            },
            {
              "time": "2024-03",
              "wangzhang": "18.6",
              "wangzhangRatio": "12.2%",
              "you": "58.9",
              "youRatio": "38.6%",
              "hao": "55.2",
              "haoRatio": "36.2%",
              "yiban": "20.1",
              "yibanRatio": "13.2%"
            }
          ],
          "columns": [
            {
              "prop": "time",
              "label": "时间节点",
              "width": 100
            },
            {
              "prop": "wangzhang",
              "label": "旺长苗（万亩）",
              "minWidth": 120
            },
            {
              "prop": "wangzhangRatio",
              "label": "旺长苗占比",
              "minWidth": 100
            },
            {
              "prop": "you",
              "label": "长势优（万亩）",
              "minWidth": 120
            },
            {
              "prop": "youRatio",
              "label": "长势优占比",
              "minWidth": 100
            },
            {
              "prop": "hao",
              "label": "长势好（万亩）",
              "minWidth": 120
            },
            {
              "prop": "haoRatio",
              "label": "长势好占比",
              "minWidth": 100
            },
            {
              "prop": "yiban",
              "label": "长势一般（万亩）",
              "minWidth": 130
            },
            {
              "prop": "yibanRatio",
              "label": "长势一般占比",
              "minWidth": 110
            }
          ],
          "stripe": true,
          "border": false,
          "size": "default",
          "queryKey": "seedlingTable"
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "TextView",
        "instanceId": "a-2",
        "parentInstanceId": "a",
        "props": {
          "content": "截至 5 月 15 日，全省冬小麦<strong style=\"color: #67C23A;\">长势结构持续优化</strong>，产量支撑能力<strong style=\"color: #409EFF;\">显著增强</strong>：<strong style=\"color: #67C23A;\">长势优</strong>田块占比<strong style=\"color: #E6A23C;\">提升至 55%</strong>，较 4 月初提高 5 个百分点，<strong style=\"color: #67C23A;\">优质群体占比扩大</strong>，亩穗数、穗粒数形成优势；<strong style=\"color: #F56C6C;\">长势一般 / 较差</strong>田块占比压减至 2.8%，<strong style=\"color: #67C23A;\">弱苗转化成效显著</strong>，低产风险基本消除；旺长苗占比稳定控制在 3.2% 以内，倒伏、早衰风险可控。综合长势、群体结构与气象条件，当前全省冬小麦预估总产量可达 285 亿斤，较去年同期<strong style=\"color: #67C23A;\">稳中有升</strong>，丰产基础坚实。",
          "format": "rich",
          "align": "left",
          "size": "normal"
        },
        "style": {
          "flex": 2
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "b",
    "layout": {
      "x": 0,
      "y": 67,
      "w": 13,
      "h": 33,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全省苗情监测结果管理建议"
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
        "instanceId": "b-1",
        "parentInstanceId": "b",
        "props": {
          "content": "区域长势与产量潜力分化明显：苏中南通、盐城、泰州主产区长势优田块占比超 60%，<strong style=\"color: #409EFF;\">亩均产量优势显著</strong>；苏北淮徐地区苗情稳步改善，连云港局部仍有零星长势一般 / 较差田块；\n苏南地区以长势优、好的田块为主，旺长苗风险已基本化解。\n各地需聚焦 <strong style=\"color: #E6A23C;\">\"保穗数、增粒重、防早衰、防倒伏\"</strong> 核心目标分类施策：\n<strong style=\"color: #67C23A;\">长势优田块</strong>：<strong style=\"color: #409EFF;\">稳施灌浆肥</strong>，防干热风、防早衰，巩固产量优势；\n<strong style=\"color: #67C23A;\">长势好田块</strong>：<strong style=\"color: #409EFF;\">补施叶面肥</strong>，促进灌浆增重，挖掘增产潜力；\n<strong style=\"color: #F56C6C;\">长势一般 / 较差田块</strong>：<strong style=\"color: #409EFF;\">强化 \"一喷三防\"</strong>，防控病虫害，降低减产风险；\n旺长苗：<strong style=\"color: #E6A23C;\">严控后期氮肥</strong>，防倒伏、防贪青晚熟，保障灌浆质量。\n同时<strong style=\"color: #409EFF;\">密切关注天气变化</strong>，防范干热风、连阴雨等灾害影响，确保全省夏粮丰产丰收。",
          "format": "rich",
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
    "instanceId": "c",
    "layout": {
      "x": 13,
      "y": 0,
      "w": 34,
      "h": 74,
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
        "parentInstanceId": "c",
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
    "instanceId": "d",
    "layout": {
      "x": 13,
      "y": 74,
      "w": 34,
      "h": 26,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全省苗情监测结果"
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
          "content": "1.全省冬小麦长势整体向好，丰产潜力充足，为夏粮稳产提供支撑；\n\n2.长势优田块 2020 万亩、占比 55%，主产区群体整齐度高，是产量核心支撑；\n\n3. 长势一般 / 较差田块 80 万亩、占比 2.8%，弱苗已基本转化，减产风险可控。\n\n4.下一步聚焦灌浆期管理，强化肥水运筹与 \"一喷三防\"，保障预估产量目标实现。",
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
    "instanceId": "e",
    "layout": {
      "x": 47,
      "y": 0,
      "w": 13,
      "h": 66,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "江苏省冬小麦综合苗情排名后十区县"
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
        "instanceId": "e-1",
        "parentInstanceId": "e",
        "props": {
          "option": {
            "title": {
              "text": "旺长苗后十区县",
              "left": "center"
            },
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "legend": {
              "data": [
                "旺长苗",
                "一类苗",
                "二类苗",
                "三类苗"
              ],
              "top": "bottom"
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "15%",
              "containLabel": true
            },
            "xAxis": {
              "type": "value"
            },
            "yAxis": {
              "type": "category",
              "data": [
                "丰县",
                "泗洪县",
                "大丰县",
                "射阳县",
                "东台县"
              ]
            },
            "series": [
              {
                "name": "旺长苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  3.2,
                  2.8,
                  2.5,
                  2.3,
                  2.1
                ]
              },
              {
                "name": "一类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  45,
                  42,
                  40,
                  38,
                  35
                ]
              },
              {
                "name": "二类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  35,
                  38,
                  40,
                  42,
                  45
                ]
              },
              {
                "name": "三类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  16.8,
                  17.2,
                  17.5,
                  17.7,
                  17.9
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "Chart",
        "instanceId": "e-2",
        "parentInstanceId": "e",
        "props": {
          "option": {
            "title": {
              "text": "旺长苗后十区县",
              "left": "center"
            },
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "legend": {
              "data": [
                "旺长苗",
                "一类苗",
                "二类苗",
                "三类苗"
              ],
              "top": "bottom"
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "15%",
              "containLabel": true
            },
            "xAxis": {
              "type": "value"
            },
            "yAxis": {
              "type": "category",
              "data": [
                "丰县",
                "泗洪县",
                "大丰县",
                "射阳县",
                "东台县"
              ]
            },
            "series": [
              {
                "name": "旺长苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  2.8,
                  2.5,
                  2.2,
                  2,
                  1.8
                ]
              },
              {
                "name": "一类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  42,
                  40,
                  38,
                  36,
                  34
                ]
              },
              {
                "name": "二类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  38,
                  40,
                  42,
                  44,
                  46
                ]
              },
              {
                "name": "三类苗",
                "type": "bar",
                "stack": "total",
                "data": [
                  17.2,
                  17.5,
                  17.8,
                  18,
                  18.2
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
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "f",
    "layout": {
      "x": 47,
      "y": 66,
      "w": 13,
      "h": 34,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "江苏省气温、降水和历史同期对比图"
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
        "instanceId": "f-1",
        "parentInstanceId": "f",
        "props": {
          "option": {
            "color": [
              "#5470C6",
              "#91CC75",
              "#FAC858",
              "#73C0DE",
              "#3BA272",
              "#EE6666"
            ],
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow"
              }
            },
            "legend": {
              "data": [
                "20年气温",
                "21年气温",
                "22年气温",
                "20年降水",
                "21年降水",
                "22年降水"
              ],
              "textStyle": {
                "color": "#000000",
                "fontSize": 12
              },
              "top": "bottom"
            },
            "grid": {
              "left": "10%",
              "right": "10%",
              "bottom": "28%",
              "top": "15%"
            },
            "xAxis": {
              "type": "category",
              "data": [
                "5月",
                "6月"
              ],
              "axisLine": {
                "lineStyle": {
                  "color": "#607D8B",
                  "width": 1
                }
              },
              "axisLabel": {
                "color": "#000000",
                "fontSize": 14
              },
              "axisTick": {
                "lineStyle": {
                  "color": "#607D8B"
                }
              }
            },
            "yAxis": [
              {
                "type": "value",
                "name": "降水量(mm)",
                "nameTextStyle": {
                  "color": "#000000",
                  "fontSize": 12
                },
                "min": 0,
                "max": 250,
                "interval": 50,
                "axisLine": {
                  "lineStyle": {
                    "color": "#607D8B",
                    "width": 1
                  }
                },
                "axisLabel": {
                  "color": "#000000",
                  "fontSize": 12
                },
                "splitLine": {
                  "lineStyle": {
                    "color": "rgba(96,125,139,0.3)",
                    "type": "dashed"
                  }
                }
              },
              {
                "type": "value",
                "name": "气温(℃)",
                "nameTextStyle": {
                  "color": "#000000",
                  "fontSize": 12
                },
                "min": -20,
                "max": 30,
                "interval": 10,
                "axisLine": {
                  "lineStyle": {
                    "color": "#607D8B",
                    "width": 1
                  }
                },
                "axisLabel": {
                  "color": "#000000",
                  "fontSize": 12
                },
                "splitLine": {
                  "show": false
                }
              }
            ],
            "series": [
              {
                "name": "20年气温",
                "type": "line",
                "yAxisIndex": 1,
                "smooth": true,
                "symbol": "circle",
                "symbolSize": 10,
                "lineStyle": {
                  "width": 3,
                  "color": "#5470C6"
                },
                "itemStyle": {
                  "color": "#5470C6"
                },
                "areaStyle": {
                  "color": "rgba(84,112,198,0.1)"
                },
                "data": [
                  15,
                  19,
                  23
                ]
              },
              {
                "name": "21年气温",
                "type": "line",
                "yAxisIndex": 1,
                "smooth": true,
                "symbol": "circle",
                "symbolSize": 10,
                "lineStyle": {
                  "width": 3,
                  "color": "#91CC75"
                },
                "itemStyle": {
                  "color": "#91CC75"
                },
                "areaStyle": {
                  "color": "rgba(145,204,117,0.1)"
                },
                "data": [
                  12,
                  16,
                  22
                ]
              },
              {
                "name": "22年气温",
                "type": "line",
                "yAxisIndex": 1,
                "smooth": true,
                "symbol": "circle",
                "symbolSize": 10,
                "lineStyle": {
                  "width": 3,
                  "color": "#FAC858"
                },
                "itemStyle": {
                  "color": "#FAC858"
                },
                "areaStyle": {
                  "color": "rgba(250,200,88,0.1)"
                },
                "data": [
                  11,
                  15,
                  25
                ]
              },
              {
                "name": "20年降水",
                "type": "bar",
                "barWidth": "12%",
                "itemStyle": {
                  "color": "#73C0DE",
                  "borderRadius": [
                    4,
                    4,
                    0,
                    0
                  ]
                },
                "data": [
                  125,
                  150,
                  165
                ]
              },
              {
                "name": "21年降水",
                "type": "bar",
                "barWidth": "12%",
                "itemStyle": {
                  "color": "#3BA272",
                  "borderRadius": [
                    4,
                    4,
                    0,
                    0
                  ]
                },
                "data": [
                  150,
                  175,
                  175
                ]
              },
              {
                "name": "22年降水",
                "type": "bar",
                "barWidth": "12%",
                "itemStyle": {
                  "color": "#EE6666",
                  "borderRadius": [
                    4,
                    4,
                    0,
                    0
                  ]
                },
                "data": [
                  175,
                  135,
                  160
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
  }
]
