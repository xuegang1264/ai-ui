---
name: map-dev
description: >-
  Develops interactive province/city/district map visualization dashboards using
  OpenLayers with Vue 3 in a single SFC. Covers three-state point markers, legend
  filtering, overlay popups, zoom-driven state transitions, and in-place
  administrative drill-down without route switching. Use when building map
  modules, adding geographic visualizations, or implementing interactive map
  legends and marker clusters in a data-dashboard context.
---

# 地图大屏开发规范

## 设计哲学

地图大屏承担「空间可视化 + 设备监测」的双重职责。交互必须遵循三条原则：

1. **反馈即承诺** —— 用户的每一次点击、悬停、缩放都必须得到即时、可感知的视觉反馈
2. **状态可逆** —— 选中、弹框、高亮都必须有清晰的退出路径
3. **动效有目的** —— 所有过渡动画服务于空间定位或状态切换，禁止无意义的装饰动画

## 项目目录结构

所有地图相关文件统一按以下位置存放：

```
src/
├── components/MapComponents/     # 地图 Vue 组件 + 工具类 + 样式
│   ├── MapView.vue               # 省市区三级合一地图（唯一入口）
│   ├── Legend.vue                # 图例筛选面板
│   ├── MapPopup.vue              # 点位点击弹框
│   ├── utils/
│   │   ├── olMap.js              # OpenLayers 封装类
│   │   ├── mapHelper.js          # 图片映射 & 坐标工具
│   │   └── coordinates.js        # 矢量坐标数据
│   ├── styles/
│   │   └── map.scss              # 公共弹窗 & 辅助样式
│   └── data/                     # GeoJSON 行政区划边界
│       ├── mapJiangsuCity.json   # 省级边界
│       ├── MapNanjingDistrict.json # 市级边界
│       └── newMapjson.json       # 区级边界
├── assets/map/                   # 地图静态资源（图标、弹窗背景等）
│   ├── Pest/
│   ├── SoilMoisture/
│   ├── drone/
│   └── ...各类 icon-dot、nongji、nongshi 等
└── api/
    └── map.js                    # 地图相关后端接口
```

依赖：`ol` (OpenLayers)、`vue`、`echarts`（墒情折线图）。

## 核心工作流

### 1. 单一组件内的省市区切换

**核心原则**：省市区三级地图在同一个 `MapView.vue` 中实现，通过状态切换改变视图，**绝不切换路由或创建多个地图组件**。

```javascript
import OlMap from './utils/olMap.js'
import jiangsu from './data/mapJiangsuCity.json'
import nanjing from './data/MapNanjingDistrict.json'
import pukou from './data/newMapjson.json'

const currentLevel = ref('province') // 'province' | 'city' | 'district'
const currentCityName = ref('')      // 当前选中的城市名
const currentDistrictName = ref('')  // 当前选中的区县名

// 三级配置表
const levelConfig = {
  province: {
    zoom: 8,
    center: [119.347, 33.085],
    geojson: jiangsu,
    regionCode: '320000',     // 省级行政区划码
    nextLevelField: 'name'    // 点击要素中用于判断下钻的字段
  },
  city: {
    zoom: 9.8,
    center: [118.821, 31.955],
    geojson: nanjing,
    regionCode: '320100',
    nextLevelField: 'name'
  },
  district: {
    zoom: 11.5,
    center: [118.484, 32.061],
    geojson: pukou,
    regionCode: '320111',
    nextLevelField: null      // 区级无下钻
  }
}
```

### 2. 下钻与返回

```javascript
// 下钻：点击行政区划边界
const drillDown = (featureName) => {
  if (currentLevel.value === 'province' && featureName === '南京市') {
    currentLevel.value = 'city'
    currentCityName.value = featureName
    switchLevel('city')
  } else if (currentLevel.value === 'city' && featureName === '浦口区') {
    currentLevel.value = 'district'
    currentDistrictName.value = featureName
    switchLevel('district')
  }
}

// 返回上级
const drillUp = () => {
  if (currentLevel.value === 'district') {
    currentLevel.value = 'city'
    currentDistrictName.value = ''
    switchLevel('city')
  } else if (currentLevel.value === 'city') {
    currentLevel.value = 'province'
    currentCityName.value = ''
    switchLevel('province')
  }
}

// 切换层级：替换边界图层 + 重新加载点位
const switchLevel = (level) => {
  const config = levelConfig[level]

  // 1. 平滑飞行到新的中心与缩放
  mapInstance.flyToCoordinate(config.center, config.zoom, { duration: 1000 })

  // 2. 移除旧边界图层
  mapInstance.removeLayer('boundary')

  // 3. 添加新边界图层
  const boundaryLayer = mapInstance.layerFactory.createPolygonLayer(
    config.geojson,
    mapInstance.styleFactory.createStyle('rgba(72, 223, 238, 0.3)', '#48DFEE', 1.5),
    { zIndex: 1 }
  )
  mapInstance.addLayer('boundary', boundaryLayer)

  // 4. 关闭弹框、清除选中态
  closePopup()

  // 5. 按新的 regionCode 重新加载点位数据
  reloadDeviceLayers(config.regionCode)
}
```

### 3. 初始化地图

```javascript
const initMap = () => {
  mapInstance = new OlMap('map', {
    zoom: levelConfig.province.zoom,
    center: levelConfig.province.center,
    controls: { zoom: false, rotate: false, attribution: false, zoomSlider: false, scaleLine: false },
    handleMoveEnd: (viewState, prevViewState) => {
      const crossed = prevViewState &&
        ((viewState.zoom > 11 && prevViewState.zoom <= 11) ||
         (viewState.zoom <= 11 && prevViewState.zoom > 11))
      if (crossed) {
        sqLayer.value?.getSource()?.getFeatures()?.forEach(f => f.onMapZoom())
        cqLayer.value?.getSource()?.getFeatures()?.forEach(f => f.onMapZoom())
      }
    }
  })

  // 添加初始省级边界
  const boundaryLayer = mapInstance.layerFactory.createPolygonLayer(
    levelConfig.province.geojson,
    mapInstance.styleFactory.createStyle('rgba(72, 223, 238, 0.3)', '#48DFEE', 1.5),
    { zIndex: 1 }
  )
  mapInstance.addLayer('boundary', boundaryLayer)

  // 绑定点击事件
  mapInstance.on('featureClick', ({ event, features }) => {
    if (!features?.length) return
    const feature = features[0]
    const geometryType = feature.getGeometry().getType()

    if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
      // 行政区划下钻
      const name = feature.values_.name
      drillDown(name)
    } else if (feature.values_?.popupType) {
      // 点位点击 → 打开弹框
      if (globalState.selectedFeature !== feature) {
        feature.mouseClick?.()
        handleFeatureClick(feature, feature.getProperties())
      }
    }
  })

  // pointermove 悬停高亮：Polygon 区域高亮与点位悬停分离处理
  let hoveredPolygon = null

  mapInstance.on('pointermove', (event) => {
    const atPixel = mapInstance.map.getFeaturesAtPixel(event.pixel)
    const polygonFeature = atPixel?.find((f) => {
      const type = f.getGeometry().getType()
      return type === 'Polygon' || type === 'MultiPolygon'
    })
    const markerFeature = atPixel?.find(f => f.values_?.popupType)

    // 1. GeoJSON 行政区划区域高亮
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
}
```

### 4. 创建点位（三态交互）

每个点位必须具备 **选中 / 默认 / 缩略** 三种状态。在 `properties` 中传入四个图标路径：

| 属性 | 状态 | 说明 |
|------|------|------|
| `defaultSrc` | 默认态 | zoom > 11 时的常规图标 |
| `mouseHoverSrc` | 悬停态 | 鼠标悬停时放大 |
| `mouseClickSrc` | 选中态 | 点击后高亮，尺寸最大 |
| `mouseDotSrc` | 缩略态 | zoom <= 11 时的小圆点（仅墒情/虫情） |

```javascript
import { getNormalImg, getSelectedImg, getDotImg, getShangqingLevel } from './utils/mapHelper.js'

const feature = mapInstance.featureFactory.createMarkerFeature(
  [item.longitude, item.latitude],
  {
    src: getNormalImg(getShangqingLevel(item.relativeTwenty)),
    properties: {
      ...item,
      defaultSrc: getNormalImg(getShangqingLevel(item.relativeTwenty)),
      mouseHoverSrc: getSelectedImg(getShangqingLevel(item.relativeTwenty)),
      mouseClickSrc: getSelectedImg(getShangqingLevel(item.relativeTwenty)),
      mouseDotSrc: getDotImg(getShangqingLevel(item.relativeTwenty)),
      popupType: 'shangqing'
    }
  }
)
```

样式优先级：**选中 > 悬停 > 默认/缩略**。`olMap.js` 内部通过 `feature.state` 和 `globalState` 自动管理状态切换。

### 5. 图例与图层联动

图例组件固定在地图**左下角**，绝对定位 `bottom: 16px; left: 16px`，层级 `z-index: 100`。

```vue
<template>
  <Legend ref="legend" @change="onLegendChange" />
</template>
```

图例中**每一项**左侧都必须有复选按钮。多选场景下必须用 `el-checkbox-group` 包裹所有 `el-checkbox`，`v-model` 绑定在 `el-checkbox-group` 上，不能为每个 checkbox 独立绑 `v-model`。地图组件监听 `@change`，控制对应图层的 `setVisible()` 或 feature 级别显隐。

```vue
<template>
  <div class="legend-content">
    <el-checkbox-group v-model="checkedList" @change="onCheckboxChange">
      <el-checkbox :label="'nongji'">...农技</el-checkbox>
      <el-checkbox :label="'nongshi'">...农事</el-checkbox>
      <!-- 墒情子项 -->
      <el-checkbox :label="'sq-level01'">渍涝</el-checkbox>
      ...
    </el-checkbox-group>
  </div>
</template>
```

初始化完成后必须同步图例默认状态，避免首屏全量加载：

```javascript
const onLegendChange = (checkedItems) => {
  // 独立图层：直接 setVisible
  nongjiLayer.value?.setVisible(checkedItems.includes('nongji'))
  nongshiLayer.value?.setVisible(checkedItems.includes('nongshi'))
  zongheLayer.value?.setVisible(checkedItems.includes('zonghe'))
  jcLayer.value?.setVisible(checkedItems.includes('jc'))

  // 墒情：由子项决定整层显隐 + 子项过滤
  const sqChecked = checkedItems.filter(k => k.startsWith('sq-level'))
  const sqVisible = sqChecked.length > 0
  sqlayer.value?.setVisible(sqVisible)
  if (sqVisible && sqlayer.value) {
    sqlayer.value.getSource()?.getFeatures()?.forEach(f => {
      const levelKey = f.values_.levelKey
      const isVisible = levelKey && sqChecked.includes(levelKey)
      f.setStyle(isVisible ? (f.getStyleByState ? f.getStyleByState() : f.getStyle()) : null)
    })
  }

  // 虫情：同理
  const cqChecked = checkedItems.filter(k => k.startsWith('cq-type'))
  const cqVisible = cqChecked.length > 0
  cqLayer.value?.setVisible(cqVisible)
  if (cqVisible && cqLayer.value) {
    cqLayer.value.getSource()?.getFeatures()?.forEach(f => {
      const typeKey = f.values_.typeKey
      const isVisible = typeKey && cqChecked.includes(typeKey)
      f.setStyle(isVisible ? (f.getStyleByState ? f.getStyleByState() : f.getStyle()) : null)
    })
  }
}
```

### 6. 弹框交互生命周期

点击点位 → `flyToCoordinate` 平滑定位 → 创建/更新 `Overlay` → `showPopup = true`

关闭弹框 → `showPopup = false` → 移除 `Overlay` → 调用 `selectedFeature.setNormalStyle()` 恢复点位默认态

```javascript
const handleFeatureClick = (feature, properties) => {
  if (popupOverlay) {
    mapInstance.removeOverlay('popup')
    popupOverlay = null
  }
  const coords = feature.getGeometry().getCoordinates()
  mapInstance.flyToCoordinate(coords, mapInstance.view.getZoom())

  nextTick(() => {
    currentPopupData.value = properties
    popupOverlay = mapInstance.createOverlay({
      element: popupRef.value,
      positioning: 'top-left',
      stopEvent: false,
      autoPan: true
    })
    mapInstance.addOverlay('popup', popupOverlay)
    popupOverlay.setPosition(coords)
  })
}
```

## 人性化交互规范

### 悬停反馈
- 鼠标经过可交互要素时，光标变为 `pointer`
- **GeoJSON 行政区划区域高亮**：使用 `getFeaturesAtPixel` 筛选 geometry type 为 `'Polygon'` / `'MultiPolygon'` 的要素（**不能**用 `feature.values_.type`，GeoJSON 解析的 feature 不会自带此属性）。鼠标进入区域时调用 `highlightFeature` 设置高亮描边与填充色；通过 `hoveredPolygon` 变量追踪当前高亮对象，避免同一区域重复高亮或闪烁
- 鼠标移出区域时调用 `clearHighlight()` 并清空 `hoveredPolygon`
- **点位悬停**：通过 `feature.mouseIn()` / `mouseOut()` 自动放大切换图标，由 `globalState.hoveredFeature` 保证全局唯一悬停态，无需手动设置 cursor

### 选中唯一性
- 同一时间只能有一个点位处于选中态
- 新点位点击时，`globalState.selectedFeature` 自动取消上一个选中态
- 再次点击同一点位或点击关闭按钮，取消选中并关闭弹框
- 切换层级时必须同步调用 `closePopup()` 清除选中态

### 地图自动平移
- 弹框必须设置 `autoPan: true`，确保弹框不会超出视口
- 行政区划下钻使用 `flyToCoordinate` 平滑过渡，持续 1000ms
- 返回上级同样使用 `flyToCoordinate` 平滑过渡

## 动画与过渡规范

### 必须实现的过渡

| 场景 | 动画 | 时长 | 缓动 |
|------|------|------|------|
| 层级切换 | `flyToCoordinate` 飞行 | 1000ms | inOutEasing |
| 弹框出现 | opacity 0→1 + translateY(8px→0) | 250ms | ease-out-quart |
| 弹框关闭 | opacity 1→0 | 150ms | ease-in |
| 点位悬停放大 | scale 过渡（Icon 的 scale 属性） | 150ms | ease-out |
| 图例展开/收起 | max-height + opacity | 300ms | ease-out-quint |
| 图层显隐 | opacity 0→1 | 200ms | ease-out |

### CSS 弹框进入动画示例

```scss
.device-popup {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 250ms cubic-bezier(0.25, 1, 0.5, 1),
              transform 250ms cubic-bezier(0.25, 1, 0.5, 1);

  &.show {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 点位状态切换

`olMap.js` 中 `createMarkerFeature` 已为每个 feature 注入状态方法。zoom 阈值跨越时调用 `onMapZoom()`，内部通过 `updateStyle()` 重新计算图标来源，样式切换应自然无闪烁。

## 数据接入约定

创建 `createMarkerFeature` 时必须在 `properties` 中包含以下字段：

| 字段 | 说明 |
|------|------|
| `defaultSrc` | 默认态图标路径 |
| `mouseHoverSrc` | 悬停态图标路径 |
| `mouseClickSrc` | 点击选中态图标路径 |
| `mouseDotSrc` | 缩略态图标路径（zoom <= 11） |
| `popupType` | 弹框类型：`shangqing` / `serverPoint` / `chongqing` |
| `sn` / `sensorName` / `onlineState` 等 | 业务数据字段 |

## Mock 数据生成（开发与联调）

在地图接口尚未就绪时，可在 `MapComponents/utils/mockData.js` 中创建假数据，用**拒绝采样**确保点位严格落在 GeoJSON 行政边界内：

```javascript
import jiangsuGeoJSON from '../data/mapJiangsuCity.json'

function pointInRing(lng, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function pointInMultiPolygon(lng, lat, multiPolygon) {
  for (const polygon of multiPolygon) {
    if (pointInRing(lng, lat, polygon[0])) {
      let inHole = false
      for (let i = 1; i < polygon.length; i++) {
        if (pointInRing(lng, lat, polygon[i])) { inHole = true; break }
      }
      if (!inHole) return true
    }
  }
  return false
}

function isPointInJiangsu(lng, lat) {
  for (const f of jiangsuGeoJSON.features) {
    const coords = f.geometry.coordinates
    if (f.geometry.type === 'Polygon') {
      if (pointInRing(lng, lat, coords[0]) && !coords.slice(1).some(r => pointInRing(lng, lat, r))) return true
    } else if (f.geometry.type === 'MultiPolygon') {
      if (pointInMultiPolygon(lng, lat, coords)) return true
    }
  }
  return false
}

function randomCoordInJiangsu() {
  let lng, lat, attempts = 0
  do {
    lng = 116.3 + Math.random() * 5.6
    lat = 30.7 + Math.random() * 4.5
    attempts++
  } while (!isPointInJiangsu(lng, lat) && attempts < 200)
  return { lng: Number(lng.toFixed(6)), lat: Number(lat.toFixed(6)) }
}
```

核心思路：先用包围盒粗粒度随机，再用 ray casting 判断点是否在多边形内，200 次拒绝采样兜底。

## 常见坑点（Gotchas）

### 1. GeoJSON 解析的 feature 没有 `values_.type`

`createPolygonLayer` 内部用 `GeoJSON().readFeatures(data)` 解析，**不会**给 feature 注入 `type: 'Polygon'` 属性。判断行政区划边界必须用：

```javascript
const geometryType = feature.getGeometry().getType()
if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') { ... }
```

### 2. `el-checkbox` 多选必须用 `el-checkbox-group`

不能为每个 `el-checkbox` 独立写 `v-model="checkedList"`，否则 Vue 会报 `Invalid prop: type check failed for prop "modelValue"`，图例状态不同步，点位全部消失。

正确写法：
```vue
<el-checkbox-group v-model="checkedList" @change="onCheckboxChange">
  <el-checkbox :label="'nongji'">...</el-checkbox>
</el-checkbox-group>
```

### 3. `mapHelper.js` 的 `new URL()` 路径层级

`mapHelper.js` 位于 `src/components/MapComponents/utils/`，引用 `src/assets/map/` 下的图片时，相对路径应为 `../../../assets/map/xxx.png`（退三层到 `src/`），而非 `../../assets/map/`。

### 4. 图标 404 不抛 JS 错误

OpenLayers 的 `Icon` 加载失败时**不会抛出 JavaScript 异常**，只会静默不显示点位。如果地图上没有任何点位，首先检查 Network 面板中图标资源是否 404。

### 5. `levelKey` / `typeKey` 必须与图例 `label` 严格一致

```javascript
// 墒情
levelKey: `sq-level01` // 与图例 label="sq-level01" 一致

// 虫情
typeKey: 'cq-type1'    // 与图例 label="cq-type1" 一致
```

不一致会导致 `onLegendChange` 中的 `includes` 判断失效，勾选图例后点位仍不显示。

### 6. 调试日志

在点位加载和图例联动处加 `console.log`，可快速定位是数据没生成、图层没添加、还是图例状态不同步：

```javascript
console.log('[DEBUG] 墒情图层:', features.length, '个点位')
console.log('[DEBUG] 图例checkedList:', checkedList)
console.log('[DEBUG] 图层状态:', { sq: sqlayer.value?.getVisible?.(), ... })
```

## 新增地图层级 checklist

1. 在 `MapView.vue` 的 `levelConfig` 中新增一层配置（zoom、center、geojson、regionCode）
2. 在 `drillDown` 中增加该层级的下钻判断条件
3. 在 `drillUp` 中增加该层级的返回逻辑
4. 在 `reloadDeviceLayers` 中按新 regionCode 加载点位数据
5. 如需新增点位类型，在 `mapHelper.js` 补充图片映射
6. 在 `Legend.vue` 中新增 checkbox 选项，**每项必须有复选按钮**，且包裹在 `el-checkbox-group` 内
7. 在地图组件中新增 `xxxLayer` ref、`initXxx()` 方法，并在 `onLegendChange` 中追加显隐控制

## 参考文档

- 详细 API 与代码示例：[reference.md](reference.md)
- 项目实现代码：`src/components/MapComponents/MapView.vue`
