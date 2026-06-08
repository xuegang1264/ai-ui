# Agent Screen API 接口文档

## 概述

本文档描述 `/agent/screen` 路由前缀下的所有 FastAPI 接口。

**基础路径**: `/agent/screen`

**内容类型**: `application/x-www-form-urlencoded` (Form Data)

---

## 目录

1. [智能体对话接口](#1-智能体对话接口)
2. [无人机作物监测接口](#2-无人机作物监测接口)
3. [天气查询接口](#3-天气查询接口)
4. [区域农服临时任务接口](#4-区域农服临时任务接口)

---

## 1. 智能体对话接口

### 1.1 SSE 流式对话

**接口路径**: `POST /agent/screen/sse/text_chat`

**接口描述**: SCREEN 智能体对话接口，支持 SSE（Server-Sent Events）流式响应。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| content | string | 是 | - | 用户输入内容 |
| user_id | string | 是 | - | 用户ID |
| dialogue_id | string | 是 | - | 对话ID |
| file_url | string | 否 | null | 文件URL（可选） |
| context_html | string | 否 | "" | 上下文HTML（可选） |

**响应格式**: `text/event-stream` (SSE 流式响应)

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/sse/text_chat" \
  -F "content=今日粮食调度总量是多少" \
  -F "user_id=user123" \
  -F "dialogue_id=dialogue456"
```

**错误响应**:
- `429`: 请求正在处理中，请勿重复提交

---

## 2. 无人机作物监测接口

### 2.1 获取作物类型列表

**接口路径**: `POST /agent/screen/uav/crop_list`

**接口描述**: 获取无人机飞行作物监测的作物类型列表。

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "小麦"
    },
    {
      "id": "2",
      "name": "水稻"
    }
  ],
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/uav/crop_list"
```

---

### 2.2 获取作物分析类型列表

**接口路径**: `POST /agent/screen/uav/analyse_select`

**接口描述**: 获取指定作物的无人机分析类型列表。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| crop_id | string | 是 | - | 作物ID，必须先调用 crop_list 获取 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "长势分析"
    },
    {
      "id": "2",
      "name": "病虫害检测"
    }
  ],
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/uav/analyse_select" \
  -F "crop_id=1"
```

---

### 2.3 获取无人机机场实时数据

**接口路径**: `POST /agent/screen/uav/airport_current_info`

**接口描述**: 获取无人机机场实时飞行数据。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| province_id | string | 否 | "2" | 省份ID |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "airport_count": 10,
    "flying_count": 5,
    "airports": [
      {
        "id": "airport001",
        "name": "机场1",
        "status": "flying"
      }
    ]
  },
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/uav/airport_current_info" \
  -F "province_id=2"
```

---

## 3. 天气查询接口

### 3.1 查询实时天气

**接口路径**: `POST /agent/screen/agent/nowWeather`

**接口描述**: 根据区域名称查询实时天气信息。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| district_name | string | 否 | null | 区域名称，如：南京市浦口区 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "temperature": 25,
    "weather": "晴",
    "humidity": 60,
    "wind_speed": 3
  },
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/agent/nowWeather" \
  -F "district_name=南京市浦口区"
```

---

## 4. 区域农服临时任务接口

### 4.1 查询临时任务分页列表

**接口路径**: `POST /agent/screen/publish/page`

**接口描述**: 查询区域农服临时任务发布分页列表，支持按作物类型、任务类型、时间范围筛选。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page_num | int | 否 | 1 | 页码 |
| page_size | int | 否 | 10 | 每页条数 |
| crop_type | string | 否 | null | 作物类型，如：小麦 |
| task_type | string | 否 | null | 任务类型，如：倒伏 |
| start_time | string | 否 | null | 开始日期，格式：yyyy-MM-dd |
| end_time | string | 否 | null | 结束日期，格式：yyyy-MM-dd |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "id": "task001",
        "cropType": "小麦",
        "taskType": "倒伏",
        "taskTitle": "小麦倒伏监测任务",
        "taskDescription": "监测区域内小麦倒伏情况",
        "createTime": "2024-01-15"
      }
    ]
  },
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/publish/page" \
  -F "page_num=1" \
  -F "page_size=10" \
  -F "crop_type=小麦" \
  -F "task_type=倒伏" \
  -F "start_time=2024-01-01" \
  -F "end_time=2024-12-31"
```

---

### 4.2 获取发布对象树

**接口路径**: `POST /agent/screen/listTargetFarmTree`

**接口描述**: 获取区域农服临时任务发布对象树（地区-农服层级），选择最后一级农服节点进行发布。

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "001",
      "name": "江苏省",
      "children": [
        {
          "id": "001001",
          "name": "南京市",
          "children": [
            {
              "id": "001001001",
              "code": "001001001",
              "name": "浦口区农服中心"
            }
          ]
        }
      ]
    }
  ],
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/listTargetFarmTree"
```

---

### 4.3 发布临时任务

**接口路径**: `POST /agent/screen/publish`

**接口描述**: 发布区域农服临时任务，需指定作物类型、任务类型、发布对象（最后一级农服编码）、任务标题和可选描述。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| crop_type | string | 是 | - | 作物类型，如：小麦、水稻 |
| task_type | string | 是 | - | 任务类型，如：倒伏、穗发芽 |
| target_farm_codes | string | 是 | - | 发布对象农服编码列表，多个用英文逗号分隔，如：001069001,001001001 |
| task_title | string | 是 | - | 任务标题 |
| task_description | string | 否 | null | 任务描述 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "taskId": "task123456"
  },
  "message": "发布成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/publish" \
  -F "crop_type=小麦" \
  -F "task_type=倒伏" \
  -F "target_farm_codes=001069001,001001001" \
  -F "task_title=小麦倒伏紧急监测" \
  -F "task_description=受强风影响，需紧急监测小麦倒伏情况"
```

---

### 4.4 获取作物类型列表

**接口路径**: `POST /agent/screen/listCrop`

**接口描述**: 获取区域农服临时任务可用的作物类型（品种）列表，如小麦、水稻等。

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": [
    "小麦",
    "水稻",
    "玉米",
    "大豆"
  ],
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/listCrop"
```

---

### 4.5 获取任务类型列表

**接口路径**: `POST /agent/screen/listTempTaskType`

**接口描述**: 获取区域农服临时任务可用的任务类型列表，必须先指定作物类型（cropType），如倒伏、涝灾、降雪、冻害等。

**请求参数** (Form Data):

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| crop_type | string | 是 | - | 作物类型，必须先调用 listCrop 获取并选择其一，如：小麦 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    "倒伏",
    "穗发芽",
    "涝灾",
    "降雪",
    "冻害"
  ],
  "message": "请求成功"
}
```

**示例请求**:
```bash
curl -X POST "http://host:8004/agent/screen/listTempTaskType" \
  -F "crop_type=小麦"
```

---

## 通用响应格式

所有接口（除 SSE 流式接口外）均返回以下格式：

```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```

**字段说明**:
- `success`: 请求是否成功
- `data`: 返回的数据内容
- `message`: 响应消息

---

## 错误处理

### HTTP 状态码

- `200`: 请求成功
- `429`: 请求正在处理中，请勿重复提交
- `500`: 服务器内部错误

### 错误响应示例

```json
{
  "success": false,
  "data": null,
  "message": "请求失败: 连接超时"
}
```

---

## 接口调用流程示例

### 发布临时任务完整流程

1. **获取作物类型列表**
   ```bash
   POST /agent/screen/listCrop
   ```

2. **获取任务类型列表**（根据选择的作物类型）
   ```bash
   POST /agent/screen/listTempTaskType
   -F "crop_type=小麦"
   ```

3. **获取发布对象树**
   ```bash
   POST /agent/screen/listTargetFarmTree
   ```

4. **发布任务**（使用前面获取的信息）
   ```bash
   POST /agent/screen/publish
   -F "crop_type=小麦"
   -F "task_type=倒伏"
   -F "target_farm_codes=001069001,001001001"
   -F "task_title=小麦倒伏监测"
   -F "task_description=监测描述"
   ```

5. **查询已发布任务**
   ```bash
   POST /agent/screen/publish/page
   -F "page_num=1"
   -F "page_size=10"
   ```

---

## 注意事项

1. 所有接口使用 `POST` 方法，参数通过 `Form Data` 传递
2. SSE 流式接口返回 `text/event-stream` 格式，其他接口返回 JSON
3. 发布临时任务前，必须先调用相关接口获取作物类型、任务类型和发布对象
4. `target_farm_codes` 必须选择树形结构中的最后一级农服节点编码
5. 日期格式统一为 `yyyy-MM-dd`
6. 接口支持幂等性控制，避免重复提交

---

## 更新日志

- **2024-01-15**: 初始版本，包含智能体对话、无人机监测、天气查询和区域农服临时任务接口
