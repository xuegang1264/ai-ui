# 地图大屏开发参考文档

## 目录与路径约定

| 类型 | 存放位置 | 引用方式 |
|------|---------|---------|
| 地图组件 | `src/components/MapComponents/MapView.vue` | `./MapView.vue` |
| 地图工具类 | `src/components/MapComponents/utils/*.js` | `./utils/olMap.js` |
| 地图样式 | `src/components/MapComponents/styles/*.scss` | `./styles/map.scss` |
| 地图静态资源 | `src/assets/map/*` | `@/assets/map/xxx.png` |
| 地图 API | `src/api/map.js` | `@/api/map.js` |
| GeoJSON 数据 | `src/components/MapComponents/data/*.json` | `./data/xxx.json` |

## OlMap 封装类 API

### 构造函数

```javascript
import OlMap from './utils/olMap.js'

new OlMap(target, options)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | string/HTMLElement | 地图容器 ID 或 DOM 元素 |
| `options.center` | [number, number] | 初始中心坐标 `[lng, lat]` |
| `options.zoom` | number | 初始缩放级别 |
| `options.handleMoveEnd` | Function | 地图移动结束回调 `(viewState, prevViewState) => {}` |
| `options.handleZoomChange` | Function | 缩放级别变化回调 `(zoom) => {}` |
| `options.tileUrl` | string | 底图瓦片 URL（默认天地图影像） |
| `options.tileWZUrl` | string | 底图标注瓦片 URL |

### 工厂方法

#### layerFactory

```javascript
// 创建图标图层
mapInstance.layerFactory.createIconLayer(features, { zIndex: 99 })

// 创建多边形图层（GeoJSON 边界）
mapInstance.layerFactory.createPolygonLayer(geojsonData, style, { zIndex: 30 })

// 创建矢量图层
mapInstance.layerFactory.createVectorLayer({ zIndex: 50 })
```

#### styleFactory

```javascript
// 创建填充+描边样式
mapInstance.styleFactory.createStyle(fillColor, strokeColor, strokeWidth)

// 创建图标样式
mapInstance.styleFactory.createIconStyle({ src, scale, anchor, opacity })

// 创建文本样式
mapInstance.styleFactory.createTextStyle({ text, font, fillColor, strokeColor })
```

#### featureFactory

```javascript
// 创建标记要素（核心）
mapInstance.featureFactory.createMarkerFeature(coordinate, {
  src,           // 初始图标路径
  scale,         // 图标缩放比例
  anchor,        // 锚点 [0.5, 1] 为底部中心
  opacity,
  properties: {
    defaultSrc,    // 默认态图标
    mouseHoverSrc, // 悬停态图标
    mouseClickSrc, // 选中态图标
    mouseDotSrc,   // 缩略态图标（可选）
    popupType,     // 弹框类型
    // ... 业务数据
  }
})

// 创建多边形要素（行政区划）
mapInstance.featureFactory.createPolygonFeature(coordinates, {
  fillColor: 'rgba(72, 223, 238, 0.2)',
  strokeColor: 'rgba(72, 223, 238, 1)'
})
```

### 核心方法

```javascript
// 事件绑定
mapInstance.on('featureClick', ({ event, features }) => { ... })
mapInstance.on('pointermove', (event, features) => { ... })

// 覆盖物
mapInstance.createOverlay({ element, positioning, stopEvent, autoPan })
mapInstance.addOverlay(id, overlay)
mapInstance.removeOverlay(id)

// 图层
mapInstance.addLayer(id, layer, { zIndex })
mapInstance.removeLayer(id)

// 平滑定位
mapInstance.flyToCoordinate(coordinate, zoom, { duration: 1000 })
mapInstance.flyToExtent(extent, { duration: 1000, maxZoom: 17 })

// 高亮
mapInstance.highlightFeature(feature, { strokeColor, fillColor })
mapInstance.clearHighlight()

// 销毁
mapInstance.destroy()
```

## 三态交互详解

### Feature 状态对象

每个由 `createMarkerFeature` 创建的 feature 自动拥有：

```javascript
feature.state = {
  isHover: false,      // 是否悬停
  isClicked: false,    // 是否被点击选中
  isShrinkPoint: false // 是否处于缩略模式
}
```

### 全局状态

```javascript
import { globalState } from './utils/olMap.js'

globalState.hoveredFeature   // 当前悬停的要素
globalState.selectedFeature  // 当前选中的要素
```

### 自动注入的方法

| 方法 | 触发时机 | 行为 |
|------|---------|------|
| `feature.mouseIn()` | 鼠标悬停 | 放大图标；若已有其他要素悬停，先触发其 `mouseOut()` |
| `feature.mouseOut()` | 鼠标移出 | 恢复默认/缩略态 |
| `feature.mouseClick()` | 鼠标点击 | 切换选中状态；若选中新要素，先取消上一个选中态 |
| `feature.onMapZoom()` | zoom 跨越阈值 | 触发 `updateStyle()` 重新判定 defaultSrc / mouseDotSrc |
| `feature.setNormalStyle()` | 关闭弹框 | 强制恢复初始态，清空全局状态 |
| `feature.updateStyle()` | 状态变化 | 根据当前 state 重新计算并设置 style |

### 样式优先级算法

```javascript
feature.getStyleByState = function() {
  let iconSrc
  if (this.state.isClicked) {
    iconSrc = this.values_.mouseClickSrc
  } else if (this.state.isHover) {
    iconSrc = this.values_.mouseHoverSrc
  } else {
    iconSrc = globalZoom <= 11
      ? this.values_.mouseDotSrc || this.values_.defaultSrc
      : this.values_.defaultSrc
  }
  // ... 创建 Style
}
```

## 单文件省市区切换架构

### levelConfig 配置表

```javascript
const levelConfig = {
  province: {
    zoom: 8,
    center: [119.347, 33.085],
    geojson: jiangsu,
    regionCode: '320000'
  },
  city: {
    zoom: 9.8,
    center: [118.821, 31.955],
    geojson: nanjing,
    regionCode: '320100'
  },
  district: {
    zoom: 11.5,
    center: [118.484, 32.061],
    geojson: pukou,
    regionCode: '320111'
  }
}
```

### switchLevel 层级切换

```javascript
const switchLevel = (level) => {
  const config = levelConfig[level]

  // 1. 平滑飞行
  mapInstance.flyToCoordinate(config.center, config.zoom, { duration: 1000 })

  // 2. 移除旧边界
  mapInstance.removeLayer('boundary')

  // 3. 添加新边界
  const boundaryLayer = mapInstance.layerFactory.createPolygonLayer(
    config.geojson,
    mapInstance.styleFactory.createStyle('rgba(72, 223, 238, 0.3)', '#48DFEE', 1.5),
    { zIndex: 1 }
  )
  mapInstance.addLayer('boundary', boundaryLayer)

  // 4. 清理弹框与选中态
  closePopup()

  // 5. 重新加载点位
  reloadDeviceLayers(config.regionCode)
}
```

### featureClick 下钻判断

```javascript
mapInstance.on('featureClick', ({ event, features }) => {
  if (!features?.length) return
  const feature = features[0]

  const geometryType = feature.getGeometry().getType()
  if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
    const name = feature.values_.name
    if (currentLevel.value === 'province' && name === '南京市') {
      currentLevel.value = 'city'
      switchLevel('city')
    } else if (currentLevel.value === 'city' && name === '浦口区') {
      currentLevel.value = 'district'
      switchLevel('district')
    }
  } else if (feature.values_?.popupType) {
    if (globalState.selectedFeature !== feature) {
      feature.mouseClick?.()
      handleFeatureClick(feature, feature.getProperties())
    }
  }
})
```

### 返回上级

```javascript
const drillUp = () => {
  if (currentLevel.value === 'district') {
    currentLevel.value = 'city'
    switchLevel('city')
  } else if (currentLevel.value === 'city') {
    currentLevel.value = 'province'
    switchLevel('province')
  }
}
```

## 图例组件 Legend.vue

图例面板固定在地图**左下角**（`position: absolute; bottom: 16px; left: 16px; z-index: 100`）。

### 对外接口

```javascript
// 通过 ref 获取当前勾选数组
defineExpose({
  getCheckedList: () => checkedList.value
})
```

### emit 事件

```javascript
emit('change', checkedList.value) // ['nongji', 'sq', 'sq-level01', 'cq', ...]
```

### 默认选项值

**所有项左侧必须有复选按钮**，且包裹在 `el-checkbox-group` 内。已移除墒情/虫情总开关，由子项直接控制图层显隐：

| 选项值 | 设备类型 |
|--------|---------|
| `nongji` | 区域性综合服务中心（农技） |
| `nongshi` | 区域性综合服务中心（农事） |
| `zonghe` | 区域性综合服务中心（农技+农事） |
| `jc` | 无人机机场 |
| `sq-level01` | 渍涝(SRWC≥150%) |
| `sq-level02` | 过湿(90≤SRWC<150%) |
| `sq-level03` | 适宜(70%≤SRWC<90%) |
| `sq-level04` | 轻旱(60%≤SRWC<70%) |
| `sq-level05` | 中旱(50%≤SRWC<60%) |
| `sq-level06` | 重旱(40%≤SRWC<50%) |
| `cq-type1` | 智能性诱监测设备 |
| `cq-type2` | 物联网虫情测报灯 |
| `cq-type3` | 流行性病害检测仪 |

## 弹框组件 MapPopup.vue

### 三种弹框模板

| popupType | 用途 | 特殊内容 |
|-----------|------|---------|
| `shangqing` | 墒情设备详情 | 在线状态、土壤温湿度、近七天 ECharts 折线图 |
| `serverPoint` | 服务中心/机场 | 名称、地址、联系人、基地管理入口 |
| `chongqing` | 虫情设备详情 | 害虫种类、数量、采集时间 |

### 弹框样式类名

```vue
<div class="device-popup" :class="{
  shangqing: currentPopupData.popupType === 'shangqing',
  nongfuwu: currentPopupData.popupType === 'nongji',
  chongqing: currentPopupData.popupType === 'chongqing',
}">
```

| 类型 | 背景图 | 高度 |
|------|--------|------|
| 虫情/默认 | `@/assets/map/Pest/popup.png` | 自适应 |
| 墒情 | `@/assets/map/SoilMoisture/popup.png` | 固定 590px |
| 农服 | `@/assets/home/icon-dialog.png` | 固定 120px |

## handleMoveEnd 缩放联动

只有 **墒情** 和 **虫情** 两类点位具备 `mouseDotSrc` 缩略图，因此仅需对这两类图层遍历触发：

```javascript
handleMoveEnd: (viewState, prevViewState) => {
  if (prevViewState && viewState.zoom !== prevViewState.zoom) {
    const crossed =
      (viewState.zoom > 11 && prevViewState.zoom <= 11) ||
      (viewState.zoom <= 11 && prevViewState.zoom > 11)
    if (crossed) {
      sqlayer.value?.getSource()?.getFeatures()?.forEach(f => f.onMapZoom())
      cqLayer.value?.getSource()?.getFeatures()?.forEach(f => f.onMapZoom())
    }
  }
}
```

## mapHelper.js 图片映射

```javascript
import {
  getDotImg,        // 缩略小圆点
  getNormalImg,     // 默认常规图标
  getSelectedImg,   // 选中高亮图标
  getShangqingLevel // 根据 relativeTwenty 判定 level01~level06
} from './utils/mapHelper.js'
```

墒情级别判定：

| relativeTwenty | 级别 | 状态 |
|----------------|------|------|
| >= 150% | level01 | 渍涝 |
| 90%~150% | level02 | 过湿 |
| 70%~90% | level03 | 适宜 |
| 60%~70% | level04 | 轻旱 |
| 50%~60% | level05 | 中旱 |
| 40%~50% | level06 | 重旱 |

## pointermove 事件处理完整示例

```javascript
let hoveredPolygon = null

mapInstance.on('pointermove', (event) => {
  const atPixel = mapInstance.map.getFeaturesAtPixel(event.pixel)
  const polygonFeature = atPixel?.find((f) => {
    const type = f.getGeometry().getType()
    return type === 'Polygon' || type === 'MultiPolygon'
  })
  const markerFeature = atPixel?.find(f => f.values_?.popupType)

  // 1. GeoJSON 行政区划区域悬停高亮
  if (polygonFeature) {
    mapInstance.map.getTargetElement().style.cursor = 'pointer'
    if (hoveredPolygon !== polygonFeature) {
      mapInstance.clearHighlight()
      mapInstance.highlightFeature(polygonFeature, {
        strokeColor: 'rgba(255, 255, 0, 0.8)',
        fillColor: 'rgba(255, 255, 0, 0.3)'
      })
      hoveredPolygon = polygonFeature
    }
  } else {
    mapInstance.map.getTargetElement().style.cursor = ''
    if (hoveredPolygon) {
      mapInstance.clearHighlight()
      hoveredPolygon = null
    }
  }

  // 2. 点位（marker）悬停三态切换
  if (markerFeature) {
    if (globalState.hoveredFeature !== markerFeature) {
      globalState.hoveredFeature?.mouseOut?.()
      markerFeature.mouseIn?.()
      globalState.hoveredFeature = markerFeature
    }
  } else {
    globalState.hoveredFeature?.mouseOut?.()
    globalState.hoveredFeature = null
  }
})
```

**注意**：GeoJSON 解析的 feature 不会自带 `type: 'Polygon'` 属性，必须用 `feature.getGeometry().getType()` 判断。

## 弹框关闭完整逻辑

```javascript
const closePopup = () => {
  showPopup.value = false
  showPopupInner.value = false
  currentPopupData.value = {}
  if (popupOverlay) {
    mapInstance.removeOverlay('popup')
    popupOverlay = null
  }
  globalState.selectedFeature?.setNormalStyle?.()
}
```

## API 接口约定

地图组件中保留的 API 引用：

```javascript
import { ploughingStation, getInsectOverview, mapPoint } from '@/api/map.js'
```

接入时可将这些接口替换为项目实际的数据源，保持返回数据结构一致即可：

- `ploughingStation(params)` → 返回 `{ detailInfo: [{ longitude, latitude, relativeTwenty, ... }] }`
- `getInsectOverview(params)` → 返回 `{ detailInfo: [{ position, insectType, ... }] }`
- `mapPoint()` → 返回 `{ flag: true, data: { aircraftPoint: [{ lat, lng, ... }] } }`

## mapHelper.js 图片路径层级

`mapHelper.js` 位于 `src/components/MapComponents/utils/`，引用 `src/assets/map/` 下的静态资源时，`new URL()` 的相对路径必须退**三层**到 `src/`：

```javascript
// 正确
new URL('../../../assets/map/nongji_0.png', import.meta.url).href
new URL('../../../assets/map/SoilMoisture/icon-level01.svg', import.meta.url).href

// 错误（只退两层，会 404）
new URL('../../assets/map/nongji_0.png', import.meta.url).href
```

OpenLayers 的 `Icon` 加载失败时**不会抛出 JS 异常**，只会静默不显示点位。如果地图上看不到任何点位，优先检查 Network 面板中图标资源是否 404。

## Mock 数据开发模式

接口未就绪时，可在 `MapComponents/utils/mockData.js` 中生成假数据，保持与 API 一致的返回结构：

```javascript
export function generateMockSoilMoisture() {
  return { detailInfo: [...] } // 与 ploughingStation 返回一致
}

export function generateMockInsectData() {
  return { detailInfo: [...] } // 与 getInsectOverview 返回一致
}

export function generateMockMapPoint() {
  return { flag: true, data: { aircraftPoint: [...] } } // 与 mapPoint 返回一致
}
```

点位坐标必须使用拒绝采样，严格限制在 GeoJSON 行政边界内（详见 SKILL.md §Mock 数据生成）。

## 依赖说明

- `Legend.vue` 使用 `el-checkbox-group` / `el-checkbox` 与 `el-icon`，需项目已引入 Element Plus
- `MapPopup.vue` 中墒情弹框使用 `echarts` 渲染折线图，需已安装
- `@/` 映射到 `src/`（在 `vite.config.js` 和 `jsconfig.json` 中配置）
