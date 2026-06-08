# OlMap 通用地图工具类

一个基于 OpenLayers 的通用地图工具类，提供更强大和易用的 API。

## 功能特性

- 基于 OpenLayers 7.x 构建
- 支持天地图瓦片服务
- 支持 WMS 图层
- 支持矢量图层和要素绘制
- 支持覆盖物（弹窗）
- 支持交互操作（绘制、修改 点、线、面、矩形、圆、随意画）
- 支持事件回调
- 易于扩展和自定义
- 自动资源管理
- 轨迹回放功能
- 无人机飞行模拟
- 测量功能
- 地图导出功能

## 安装和使用

### 基本用法

```javascript
import OlMap from './olMap.js'

// 创建地图实例
const map = new OlMap('map-container', {
  center: [119.486506, 32.983991],
  zoom: 8,
})

// 添加图层
const vectorLayer = map.layerFactory.createVectorLayer({ zIndex: 30 })
map.addLayer('vectorLayer', vectorLayer)

// 绑定事件回调
map.on('featureClick', ({ event, features }) => {
  console.log('点击了要素', features)
})

map.on('drawEnd', (event) => {
  console.log('绘制结束', event)
  // 将绘制的要素添加到矢量图层
  vectorLayer.getSource().addFeature(event.feature)
})
```

## 构造函数

```javascript
new OlMap(target, options)
```

### 参数

- `target` (string|HTMLElement): 地图容器元素或其 ID
- `options` (Object): 配置选项
  - `center` (Array<number>): 初始中心点，默认为 [118.528, 32.029]
  - `zoom` (number): 初始缩放级别，默认为 11
  - `maxZoom` (number): 最大缩放级别，默认为 18
  - `minZoom` (number): 最小缩放级别，默认为 0
  - `extent` (Array<number>): 地图边界，默认为 [-180.0, -90.0, 180.0, 90.0]
  - `tileUrl` (string): 天地图底图URL，默认为天地图影像底图
  - `tileWZUrl` (string): 天地图标注图层URL，默认为天地图影像标注图层
  - `controls` (Object): 控件配置选项

## 方法

### 地图相关

- `map`: 地图实例
- `view`: 视图实例

### 事件处理

- `on(event, callback)`: 设置事件回调
- `off(event)`: 移除事件回调

### 图层操作

- `addLayer(id, layer)`: 添加图层
- `removeLayer(id)`: 移除图层
- `getLayer(id)`: 获取图层

### 覆盖物操作

- `addOverlay(id, overlay)`: 添加覆盖物
- `removeOverlay(id)`: 移除覆盖物

### 交互操作

- `interactionFactory.addDrawInteraction(source, options)`: 添加绘制交互
- `interactionFactory.addModifyInteraction(source, options)`: 添加修改交互
- `interactionFactory.addSelectInteraction(options)`: 添加选择交互
- `interactionFactory.addSnapInteraction(source, options)`: 添加捕捉交互
- `interactionFactory.removeInteraction(type)`: 移除交互

### 要素创建

- `createView(center, zoom)`: 创建视图
- `createOverlay(options)`: 创建覆盖物

### 图层工厂 (layerFactory)

- `createXYZLayer(url, options)`: 创建XYZ图层
- `createImageWMS(options)`: 创建WMS切片源
- `createImageLayer(source, options)`: 创建图像图层
- `createShadeLayer(options)`: 创建蒙层遮罩
- `createPolygonLayer(data, style, options)`: 创建多边形图层
- `createVectorLayer(options)`: 创建矢量图层
- `createIconLayer(features, options)`: 创建图标图层

### 样式工厂 (styleFactory)

- `createStyle(options, strokeColor, strokeWidth)`: 创建样式
- `createIconStyle(options)`: 创建图标样式
- `createCircleStyle(options)`: 创建圆样式
- `createTextStyle(options)`: 创建文本样式
- `createMeasureStyle(options)`: 创建测量样式

### 要素工厂 (featureFactory)

- `createCircleGeometry(coordinate, radius)`: 创建圆几何
- `createCircleFeature(coordinate, options)`: 创建圆要素
- `createPolygonFeature(coordinates, options)`: 创建多边形要素
- `createLineFeature(coordinates, options)`: 创建线要素
- `createTextFeature(coordinate, options)`: 创建文本要素
- `createMarkerFeature(coordinate, options)`: 创建标记要素

### 其他功能

- `getFeatures(layer, coordinate)`: 获取图层要素
- `flyToExtent(extent, options)`: 定位到指定范围
- `flyToCoordinate(coordinate, zoom, options)`: 定位到指定坐标
- `setTrackReplayData(coordinates, options)`: 设置轨迹回放数据
- `startTrackReplay(layer, options)`: 开始轨迹回放
- `toggleTrackReplay()`: 暂停/继续轨迹回放
- `stopTrackReplay()`: 停止轨迹回放
- `setDronePosition(coordinate, options)`: 设置无人机位置
- `startDroneFlight(path, layer, options)`: 开始无人机飞行
- `stopDroneFlight()`: 停止无人机飞行
- `getMapExtent()`: 获取地图范围
- `getMapCenter()`: 获取地图中心点
- `getMapZoom()`: 获取地图缩放级别
- `setMapCenter(center, options)`: 设置地图中心点
- `setMapZoom(zoom, options)`: 设置地图缩放级别
- `animateFeature(feature, options)`: 添加动画效果到要素
- `startMeasure(type, options)`: 开始测量
- `calculateMeasure(feature)`: 计算测量结果
- `clearMeasure()`: 清除测量
- `exportMap(options)`: 导出地图为图片
- `destroy()`: 销毁地图

## 事件

通过 `on(event, callback)` 方法绑定事件：

- `featureClick`: 要素点击事件
- `drawStart`: 绘制开始事件
- `drawEnd`: 绘制结束事件
- `select`: 选择事件
- `measureStart`: 测量开始事件
- `measureEnd`: 测量结束事件
- `singleclick`: 单击事件
- `dblclick`: 双击事件
- `pointermove`: 指针移动事件
- `pointerdrag`: 指针拖拽事件
- `movestart`: 移动开始事件
- `moveend`: 移动结束事件
- `zoomstart`: 缩放开始事件
- `zoomend`: 缩放结束事件

## 工厂模式方法分类

### 图层工厂 (layerFactory)

所有图层工厂方法都通过 `options` 对象传递可选参数，保持API一致性。

1. `createXYZLayer(url, options)`
   - 创建标准XYZ图层
   - `url`: 瓦片URL
   - `options.zIndex`: 图层层级，默认为0
   - `options.sourceOptions`: 数据源选项
   - `options.layerOptions`: 图层选项

2. `createImageWMS(options)`
   - 创建标准WMS切片源
   - `options.url`: URL地址（必需）
   - `options.layer`: 图层名称（必需）
   - `options.ratio`: 比例，默认为1
   - `options.version`: 版本号，默认为'1.1.0'
   - `options.tiled`: 是否切片，默认为true
   - `options.params`: 参数
   - `options.serverType`: 服务器类型，默认为'geoserver'
   - `options.layerOptions`: 图层选项

3. `createImageLayer(source, options)`
   - 创建标准ImageLayer图层
   - `source`: 图像源
   - `options.zIndex`: 图层层级，默认为10

4. `createShadeLayer(options)`
   - 创建蒙层遮罩
   - `options.color`: 遮罩颜色，默认为'rgba(0, 15, 6, 0.3)'
   - `options.zIndex`: 图层层级，默认为10

5. `createPolygonLayer(data, style, options)`
   - 创建多边形图层
   - `data`: GeoJSON数据
   - `style`: 样式
   - `options.zIndex`: 图层层级，默认为30

6. `createVectorLayer(options)`
   - 创建一个矢量图层
   - `options.zIndex`: 图层层级，默认为50

7. `createIconLayer(features, options)`
   - 创建标准图标图层
   - `features`: 要素数组
   - `options.zIndex`: 图层层级，默认为20

### 样式工厂 (styleFactory)

所有样式工厂方法都通过 `options` 对象传递可选参数，保持API一致性。

1. `createStyle(options, strokeColor, strokeWidth)`
   - 创建样式
   - `options`: 样式选项或填充颜色
   - `strokeColor`: 描边颜色
   - `strokeWidth`: 描边宽度

2. `createIconStyle(options)`
   - 创建图标样式
   - `options.src`: 图标路径（必需）
   - `options.opacity`: 透明度，默认为1
   - `options.scale`: 缩放比例，默认为1
   - `options.anchor`: 锚点，默认为[0.5, 0.5]

3. `createCircleStyle(options)`
   - 创建圆样式
   - `options.radius`: 半径，默认为8
   - `options.fillColor`: 填充颜色，默认为'#00B07D'
   - `options.strokeColor`: 描边颜色，默认为'#FFFFFF'
   - `options.strokeWidth`: 描边宽度，默认为2

4. `createTextStyle(options)`
   - 创建文本样式
   - `options.text`: 文本内容，默认为空字符串
   - `options.font`: 字体，默认为'400 14px Microsoft YaHei UI, Microsoft YaHei UI'
   - `options.fillColor`: 填充颜色，默认为'#FFFFFF'
   - `options.strokeColor`: 描边颜色，默认为'#000000'
   - `options.strokeWidth`: 描边宽度，默认为0

5. `createMeasureStyle(options)`
   - 创建测量样式
   - `options.strokeColor`: 描边颜色，默认为'#ffcc33'
   - `options.strokeWidth`: 描边宽度，默认为2
   - `options.fillColor`: 填充颜色，默认为'rgba(255, 255, 255, 0.2)'

### 要素工厂 (featureFactory)

所有要素工厂方法都通过 `options` 对象传递可选参数，保持API一致性。

1. `createCircleGeometry(coordinate, radius)`
   - 创建圆几何
   - `coordinate`: 圆心坐标
   - `radius`: 半径（米）

2. `createCircleFeature(coordinate, options)`
   - 创建圆要素
   - `coordinate`: 坐标
   - `options`: 样式选项，参考`createCircleStyle`方法的选项参数

3. `createPolygonFeature(coordinates, options)`
   - 创建多边形要素
   - `coordinates`: 坐标数组-三维数组 示例：[[[118.47066238,31.98567678], ...]]
   - `options.fillColor`: 填充颜色，默认为'rgba(255, 0, 0, 0.5)'
   - `options.strokeColor`: 描边颜色，默认为'#ff0000'
   - `options.strokeWidth`: 描边宽度，默认为2

4. `createLineFeature(coordinates, options)`
   - 创建线要素
   - `coordinates`: 坐标数组
   - `options.strokeColor`: 描边颜色，默认为'#3399CC'
   - `options.strokeWidth`: 描边宽度，默认为2

5. `createTextFeature(coordinate, options)`
   - 创建文本要素
   - `coordinate`: 坐标
   - `options.text`: 文本内容（必需）

6. `createMarkerFeature(coordinate, options)`
   - 创建标记要素
   - `coordinate`: 坐标
   - `options.src`: 图标路径（必需）
   - `options.properties`: 要素属性
   - `options.scale`: 缩放比例，默认为1
   - `options.anchor`: 锚点，默认为[0.5, 0.5]
   - `options.opacity`: 透明度，默认为1

### 交互工厂 (interactionFactory)

所有交互工厂方法都通过 `options` 对象传递可选参数，保持API一致性。

1. `createModify(source, options)`
   - 创建修改交互
   - `source`: 矢量源
   - `options`: 其他选项

2. `addModifyInteraction(source, options)`
   - 添加修改交互
   - `source`: 矢量源
   - `options`: 其他选项

3. `addDrawInteraction(source, options)`
   - 添加绘制交互
   - `source`: 矢量源
   - `options.type`: 绘制类型 ('Point', 'LineString', 'Polygon', 'Circle', 'Rectangle')，默认为'Polygon'

4. `addSelectInteraction(options)`
   - 添加选择交互
   - `options`: 选项

5. `addSnapInteraction(source, options)`
   - 添加捕捉交互
   - `source`: 矢量源
   - `options`: 选项

6. `removeInteraction(type)`
   - 移除交互
   - `type`: 交互类型

## 使用示例

### 添加标记

```javascript
// 创建矢量图层
const vectorLayer = map.layerFactory.createVectorLayer({ zIndex: 30 })
map.addLayer('vectorLayer', vectorLayer)

// 创建标记
const marker = map.featureFactory.createMarkerFeature([119.486506, 32.983991], {
  src: 'marker-icon.png', // 图标URL
})

// 添加到图层
vectorLayer.getSource().addFeature(marker)
```

### 添加多边形

```javascript
// 创建多边形坐标
const coordinates = [
  [
    [119.486506, 32.983991],
    [119.486506 + 1, 32.983991],
    [119.486506 + 1, 32.983991 + 1],
    [119.486506, 32.983991 + 1],
    [119.486506, 32.983991],
  ],
]

// 创建多边形要素
const polygon = map.featureFactory.createPolygonFeature(coordinates, {
  fillColor: 'rgba(255, 0, 0, 0.5)', // 填充色
  strokeColor: '#ff0000', // 边框色
  strokeWidth: 2, // 边框宽度
})

// 添加到图层
vectorLayer.getSource().addFeature(polygon)
```

### 开始绘制

```javascript
// 开启绘制交互
map.interactionFactory.addDrawInteraction(vectorLayer.getSource(), {
  type: 'Polygon',
})
```

### 轨迹回放

```javascript
// 设置轨迹数据
const trackPoints = [
  [119.486506, 32.983991],
  [119.487506, 32.984991],
  [119.488506, 32.985991],
  [119.489506, 32.986991],
]

map.setTrackReplayData(trackPoints)

// 开始回放
map.startTrackReplay(vectorLayer, {
  icon: 'car-icon.png',
  zoom: 15,
  lineColor: '#ff0000',
  lineWidth: 3,
})
```

### 无人机飞行

```javascript
// 设置飞行路径
const flightPath = [
  [119.486506, 32.983991],
  [119.487506, 32.984991],
  [119.488506, 32.985991],
  [119.489506, 32.986991],
]

// 开始飞行
map.startDroneFlight(flightPath, vectorLayer, {
  icon: 'drone-icon.png',
  trailColor: '#0000ff',
  trailWidth: 2,
  zoom: 15,
  speed: 2000,
})
```

### 测量功能

```javascript
// 开始测量距离
map.startMeasure('length', {
  // 可以添加自定义选项
})

// 开始测量面积
map.startMeasure('area', {
  // 可以添加自定义选项
})
```

### 导出地图

```javascript
// 导出地图为图片
map
  .exportMap({
    format: 'image/png',
    quality: 1,
    backgroundColor: 'white',
  })
  .then((dataUrl) => {
    // 处理导出的图片
    console.log('地图图片URL:', dataUrl)
  })
```

## 资源管理

工具类会自动管理所有创建的资源，包括：

1. 图层
2. 覆盖物
3. 交互

当调用 `destroy()` 方法时，会自动清理所有资源，避免内存泄漏。

## 扩展性

该工具类设计为可扩展的通用地图工具，可以轻松适应各种业务需求：

1. 可以通过添加新的图层类型支持更多地图服务
2. 可以通过添加新的交互类型支持更多操作
3. 可以通过事件回调机制与业务逻辑集成
4. 可以通过暴露的方法实现复杂的地图操作

## 注意事项

1. 使用前确保 DOM 元素已存在
2. 调用 `destroy()` 方法可以完全清理地图资源
3. 图层和覆盖物通过 ID 进行管理，确保 ID 唯一性
4. 工具类默认使用 EPSG:4326 投影坐标系
5. 所有可选参数都通过 options 对象传递，保持 API 的一致性
6. 所有工厂方法遵循统一的参数传递方式，可选参数都通过 options 对象传递
