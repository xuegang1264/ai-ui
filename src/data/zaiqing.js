export const defaultModules = [
  {
    "stableKey": "grid-item",
    "instanceId": "a",
    "layout": {
      "x": 0,
      "y": 0,
      "w": 13,
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
    "children": [
      {
        "stableKey": "TextView",
        "instanceId": "a-1",
        "parentInstanceId": "a",
        "props": {
          "content": "<p><strong>5 月江苏农业主要气象灾情风险总结</strong></p><p><strong>一、核心灾害风险</strong></p><ul><li><strong>干热风：</strong>气温偏高、湿度偏低，部分地区易出现 30℃以上干热风天气，影响小麦灌浆，导致千粒重下降；</li><li><strong>局部强对流：</strong>短时强降水、雷暴大风多发，易引发田间渍涝、倒伏，对小麦后期生长和收获造成威胁；</li><li><strong>预防风险：</strong>5 月中下旬至 6 月上旬，局部地区可能存在连阴雨天气，可能加重赤霉病、白粉病流行，影响籽粒灌浆和收获晾晒。</li></ul><p><strong>二、分区域重点</strong></p><ul><li><strong>苏北地区：</strong>需重点防范干热风、局部强对流和后期倒伏风险；</li><li><strong>江淮地区：</strong>需兼顾防渍涝、防病虫和防倒伏，关注赤霉病二次侵染；</li><li><strong>苏南地区：</strong>需重点防范收获的一些不利影响，提前做好收割预案。</li></ul>",
          "format": "rich",
          "align": "left",
          "size": "normal"
        },
        "style": {
          "flex": 1,
          "padding": "12px",
          "overflow": "auto"
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
      "y": 26,
      "w": 13,
      "h": 37,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "7日天气"
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
        "instanceId": "b-1",
        "parentInstanceId": "b",
        "props": {
          "label": "监测地点",
          "value": "江苏省南京市",
          "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"24\" height=\"24\"><path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\"/></svg>",
          "textDirection": "row"
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
            "legend": {
              "data": [
                "最高气温",
                "最低气温"
              ],
              "bottom": 0
            },
            "grid": {
              "left": "3%",
              "right": "4%",
              "bottom": "15%",
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
              "axisLabel": {
                "formatter": "{value} °C"
              }
            },
            "series": [
              {
                "name": "最高气温",
                "type": "line",
                "smooth": true,
                "itemStyle": {
                  "color": "#ff7f50"
                },
                "data": [
                  28,
                  30,
                  29,
                  32,
                  31,
                  27,
                  26
                ]
              },
              {
                "name": "最低气温",
                "type": "line",
                "smooth": true,
                "itemStyle": {
                  "color": "#409eff"
                },
                "data": [
                  18,
                  20,
                  19,
                  22,
                  21,
                  17,
                  16
                ]
              }
            ]
          }
        },
        "style": {
          "flex": 7
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
      "y": 63,
      "w": 13,
      "h": 37,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "24h降水预测"
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
        "instanceId": "c-1",
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
              "containLabel": true
            },
            "xAxis": {
              "type": "category",
              "boundaryGap": false,
              "data": [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00"
              ]
            },
            "yAxis": {
              "type": "value",
              "name": "降水量 (mm)",
              "axisLabel": {
                "formatter": "{value} mm"
              }
            },
            "series": [
              {
                "name": "降水量",
                "type": "line",
                "smooth": true,
                "itemStyle": {
                  "color": "#409eff"
                },
                "areaStyle": {
                  "opacity": 0.3
                },
                "data": [
                  0,
                  0,
                  0.2,
                  0.5,
                  1.2,
                  0.8,
                  0.1,
                  0,
                  0,
                  0.3,
                  1.5,
                  2.8,
                  3.2,
                  2.5,
                  1.8,
                  0.5,
                  0.2,
                  0,
                  0,
                  0.1,
                  0.4,
                  0.2,
                  0,
                  0
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
    "instanceId": "d",
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
        "stableKey": "Map",
        "instanceId": "d-1",
        "parentInstanceId": "d",
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
    "instanceId": "e",
    "layout": {
      "x": 13,
      "y": 73,
      "w": 34,
      "h": 27,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "全省气象灾情监测结果"
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
        "instanceId": "e-1",
        "parentInstanceId": "e",
        "props": {
          "content": "<p><strong>全省气象灾情监测结果（5 月中旬）</strong></p><p>当前江苏小麦进入灌浆关键期，气象条件总体有利，但阶段性灾害风险不容忽视：</p><ul><li><strong>干热风：</strong>苏北、淮北部分地区气温偏高、湿度偏低，存在轻度干热风影响，需通过叶面喷肥增强植株抗逆性；</li><li><strong>病虫气象风险：</strong>温湿度条件利于白粉病、赤霉病和蚜虫发生蔓延，需结合天气过程，科学开展\"一喷三防\"。</li></ul><p>下一步需密切关注天气变化，分区分类落实干热风防御、渍涝排除和病虫害防控措施，确保小麦灌浆安全，稳定产量。</p>",
          "format": "rich",
          "align": "left",
          "size": "normal"
        },
        "style": {
          "flex": 1,
          "padding": "12px",
          "overflow": "auto"
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
      "h": 63,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "气象监测"
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
              "label": "设备数量",
              "value": "20",
              "unit": "台",
              "textDirection": "row"
            },
            {
              "label": "数据有效率",
              "value": "90.86",
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
        "stableKey": "FilterBar",
        "instanceId": "f-2",
        "parentInstanceId": "f",
        "props": {
          "modelValue": {
            "city": ""
          },
          "filters": [
            {
              "field": "city",
              "type": "select",
              "label": "气象台",
              "placeholder": "请选择城市",
              "options": [
                {
                  "label": "南京市",
                  "value": "nanjing"
                },
                {
                  "label": "无锡市",
                  "value": "wuxi"
                },
                {
                  "label": "徐州市",
                  "value": "xuzhou"
                },
                {
                  "label": "常州市",
                  "value": "changzhou"
                },
                {
                  "label": "苏州市",
                  "value": "suzhou"
                },
                {
                  "label": "南通市",
                  "value": "nantong"
                },
                {
                  "label": "连云港市",
                  "value": "lianyungang"
                },
                {
                  "label": "淮安市",
                  "value": "huaian"
                },
                {
                  "label": "盐城市",
                  "value": "yancheng"
                },
                {
                  "label": "扬州市",
                  "value": "yangzhou"
                },
                {
                  "label": "镇江市",
                  "value": "zhenjiang"
                },
                {
                  "label": "泰州市",
                  "value": "taizhou"
                },
                {
                  "label": "宿迁市",
                  "value": "suqian"
                }
              ]
            }
          ],
          "gap": 8
        },
        "style": {
          "flex": 1
        }
      },
      {
        "stableKey": "KvLayout",
        "instanceId": "f-3",
        "parentInstanceId": "f",
        "props": {
          "items": [
            {
              "label": "空气温度",
              "value": "31",
              "unit": "°C",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v1h-1v1h1v1h-1v1h1v1h-1v1h1v1h-2V5z\"/></svg>"
            },
            {
              "label": "空气湿度",
              "value": "31",
              "unit": "%",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 3.63-2.65 6.2-6 6.2z\"/></svg>"
            },
            {
              "label": "露点温度",
              "value": "2",
              "unit": "°C",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 3.63-2.65 6.2-6 6.2z\"/></svg>"
            },
            {
              "label": "土壤温度",
              "value": "4",
              "unit": "°C",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z\"/></svg>"
            },
            {
              "label": "土壤湿度",
              "value": "58",
              "unit": "%",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 3.63-2.65 6.2-6 6.2z\"/></svg>"
            },
            {
              "label": "大气压",
              "value": "1006",
              "unit": "hPa",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"/></svg>"
            },
            {
              "label": "风向",
              "value": "西风",
              "unit": "",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12.74 2.32a1 1 0 0 0-1.48 0l-8 9a1 1 0 0 0 1.48 1.36L11 6.8V21a1 1 0 0 0 2 0V6.8l6.26 5.88a1 1 0 0 0 1.48-1.36l-8-9z\" transform=\"rotate(90 12 12)\"/></svg>"
            },
            {
              "label": "风速",
              "value": "9",
              "unit": "m/s",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12.74 2.32a1 1 0 0 0-1.48 0l-8 9a1 1 0 0 0 1.48 1.36L11 6.8V21a1 1 0 0 0 2 0V6.8l6.26 5.88a1 1 0 0 0 1.48-1.36l-8-9z\"/></svg>"
            },
            {
              "label": "光照强度",
              "value": "-",
              "unit": "Lux",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0 1.41.996.996 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z\"/></svg>"
            },
            {
              "label": "降雨量",
              "value": "0",
              "unit": "mm",
              "width": "50%",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 3.63-2.65 6.2-6 6.2z\"/></svg>"
            }
          ],
          "direction": "row",
          "textDirection": "column"
        },
        "style": {
          "flex": 12,
          "padding": "8px"
        }
      }
    ],
    "direction": "column"
  },
  {
    "stableKey": "grid-item",
    "instanceId": "g",
    "layout": {
      "x": 47,
      "y": 63,
      "w": 13,
      "h": 37,
      "draggable": true,
      "resizable": true
    },
    "props": {
      "title": "监测预警"
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
        "instanceId": "g-1",
        "parentInstanceId": "g",
        "props": {
          "data": [
            {
              "point": "南京-001",
              "content": "空气湿度低于阈值",
              "time": "2024-05-15 08:30"
            },
            {
              "point": "苏州-012",
              "content": "土壤温度异常升高",
              "time": "2024-05-15 09:15"
            },
            {
              "point": "徐州-005",
              "content": "风速超过警戒值",
              "time": "2024-05-15 10:00"
            }
          ],
          "columns": [
            {
              "prop": "point",
              "label": "设备点位",
              "width": 100
            },
            {
              "prop": "content",
              "label": "预警内容",
              "minWidth": 150
            },
            {
              "prop": "time",
              "label": "预警时间",
              "width": 120
            }
          ],
          "stripe": true,
          "border": false,
          "size": "small"
        },
        "style": {
          "flex": 1
        }
      }
    ],
    "direction": "row"
  }
]
