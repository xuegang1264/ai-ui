import 'ol/ol.css'
import { Map, View, Overlay, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { Style, Fill, Stroke, Icon, Text, Circle } from 'ol/style'
import { Vector as SourceVector, ImageWMS, XYZ, ImageStatic } from 'ol/source'
import { Point, Polygon, LineString } from 'ol/geom'
import GeoJSON from 'ol/format/GeoJSON'
import { defaults as defaultControls, ZoomSlider, ScaleLine } from 'ol/control'
import { Modify, Draw, Snap, Select } from 'ol/interaction'
import { circular as CircleGeometry, fromExtent } from 'ol/geom/Polygon'
import { Projection } from 'ol/proj'
import { unByKey } from 'ol/Observable'
export const globalState = {
  hoveredFeature: null, // 当前悬停的要素
  selectedFeature: null, // 当前选中的要素
}
let globalZoom = 0 // 全局地图缩放级别
let globalIconMode = 'small' // 'small' | 'large'，控制 marker 默认显示小图还是大图

export function setGlobalIconMode(mode) {
  globalIconMode = mode === 'large' ? 'large' : 'small'
}
/**
 * 通用地图工具类，提供更强大和易用的 API
 */
class OlMap {
  // /**
  //  * 监听地图缩放事件
  //  * @param {Function} callback - 缩放变化回调，参数为当前zoom级别
  //  */
  // onZoomChange(callback) {
  //   if (!this.map || !this.view) return
  //   // 先移除旧监听，避免重复
  //   if (this._zoomListenerKey) {
  //     this.view.un('change:resolution', this._zoomListenerKey)
  //   }
  //   this._zoomListenerKey = () => {
  //     const zoom = this.view.getZoom()
  //     globalZoom = zoom // 更新全局缩放级别
  //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //     callback && callback(zoom)
  //   }
  //   this.view.on('change:resolution', this._zoomListenerKey)
  // }
  /**
   * 构造函数
   * @param {string|HTMLElement} target - 地图容器
   * @param {Object} options - 配置选项
   * @param {Array<number>} [options.center=[0, 0]] - 地图中心点坐标
   * @param {number} [options.zoom=2] - 缩放级别
   * @param {number} [options.maxZoom=18] - 最大缩放级别
   * @param {number} [options.minZoom=0] - 最小缩放级别
   * @param {Array<number>} [options.extent=[-180.0, -90.0, 180.0, 90.0]] - 地图范围
   * @param {string} [options.tileUrl] - 自定义瓦片图层URL
   * @param {string} [options.tileWZUrl] - 自定义瓦片文字标注URL
   * @param {Object} [options.controls={}] - 控件配置选项
   */
  constructor(target, options = {}) {
    this.target = target
    this.options = {
      center: options.center || [118.528, 32.029],
      zoom: 11,
      maxZoom: 18,
      minZoom: 0,
      extent: [-180.0, -90.0, 180.0, 90.0],
      // 天地图矢量行政区划底图 (vec_w: 矢量底图, cva_w: 矢量标注)
      // 如需恢复卫星影像，改回 img_w + cia_w
      tileUrl:
        typeof options.tileUrl === 'string'
          ? options.tileUrl
          : 'http://t4.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf',
      tileWZUrl:
        typeof options.tileWZUrl === 'string'
          ? options.tileWZUrl
          : 'http://t4.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf',
      controls: {},
      ...options,
    }

    // 地图实例相关
    this.map = null
    this.view = null

    // 图层、覆盖物和交互管理
    this.layers = new Map()
    this.overlays = new Map()
    this.interactions = new Map()
    this.eventKeys = new Map() // 存储事件监听的key

    // 回调函数
    this.callbacks = {}

    // 轨迹回放相关
    this.trackReplay = {
      features: [],
      currentIndex: 0,
      isPlaying: false,
      timer: null,
      speed: 1000, // 毫秒
      marker: null,
      line: null,
    }

    // 无人机飞行相关
    this.droneFlight = {
      position: null,
      marker: null,
      trail: [],
      trailFeature: null,
      isFlying: false,
      interval: null,
    }

    // 测量相关
    this.measure = {
      draw: null,
      layer: null,
      sketch: null,
      measureTooltipElement: null,
      measureTooltip: null,
      helpTooltipElement: null,
      helpTooltip: null,
    }

    // 初始化地图
    this.init()
  }

  /**
   * 初始化地图
   */
  init() {
    // 创建视图
    this.view = this.createView(this.options.center, this.options.zoom)

    // 创建地图实例
    const controls = this.createControls()

    this.map = new Map({
      target: this.target,
      view: this.view,
      controls: controls,
    })
    if (this.options.handleZoomChange) {
      this.view.on('change:resolution', () => {
        globalZoom = this.view.getZoom()
        this.options.handleZoomChange && this.options.handleZoomChange(globalZoom)
      })
    }

    if (this.options.handleMoveEnd) {
      this.map.on('moveend', () => {
        const prevViewState = this._lastMoveEndState ? { ...this._lastMoveEndState } : null
        const viewState = this.view.getState()
        this._lastMoveEndState = { ...viewState }
        globalZoom = this.view.getZoom()
        if (this.options.handleMoveEnd) {
          this.options.handleMoveEnd(viewState, prevViewState)
        }
      })
    }

    // 添加天地图底图
    this.addBaseLayers()

    // 绑定事件
    this.bindMapEvents()
  }

  /**
   * 高亮指定要素
   * @param {Feature} feature - 要高亮的要素
   * @param {Style} [style] - 可选，高亮样式
   */
  highlightFeature(feature, style) {
    // 先清除之前的高亮
    this.clearHighlight()
    if (!feature) return
    // 保存原始样式
    this._highlightedFeature = feature
    this._highlightedFeatureOriginStyle = feature.getStyle()
    // 设置高亮样式
    const highlightStyle = this.styleFactory.createStyle({
      stroke: new Stroke({
        color: style?.strokeColor || '#48DFEE',
        width: style?.strokeWidth || 4,
      }),
      fill: new Fill({ color: style?.fillColor || 'rgba(72, 223, 238, 0.5)' }),
    })
    feature.setStyle(highlightStyle)
  }

  /**
   * 取消高亮，恢复原始样式
   */
  clearHighlight() {
    if (this._highlightedFeature) {
      // 恢复原始样式
      this._highlightedFeature.setStyle(this._highlightedFeatureOriginStyle || null)
      this._highlightedFeature = null
      this._highlightedFeatureOriginStyle = null
    }
  }
  /**
   * 创建控件
   * @returns {Collection<Control>} 控件集合
   */
  createControls() {
    const controls = defaultControls({
      zoom: this.options.controls.zoom !== false,
      rotate: this.options.controls.rotate !== false,
      attribution: this.options.controls.attribution !== false,
    })

    // 添加额外控件
    if (this.options.controls.zoomSlider !== false) {
      controls.push(new ZoomSlider())
    }
    if (this.options.controls.scaleLine !== false) {
      controls.push(new ScaleLine())
    }

    return controls
  }

  /**
   * 添加基础图层
   */
  addBaseLayers() {
    const tileLayer = this.layerFactory.createXYZLayer(this.options.tileUrl, { zIndex: 0 })
    const tileWZLayer = this.layerFactory.createXYZLayer(this.options.tileWZUrl, { zIndex: 1 })

    this.map.addLayer(tileLayer)
    this.map.addLayer(tileWZLayer)

    // 存储图层引用
    this.layers.set('baseTileLayer', tileLayer)
    this.layers.set('baseTileWZLayer', tileWZLayer)
  }

  /**
   * 切换底图类型
   * @param {string} type - 'vector' | 'satellite'
   */
  switchBaseMap(type) {
    const isSatellite = type === 'satellite'
    const tileUrl = isSatellite
      ? 'http://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf'
      : 'http://t4.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf'
    const tileWZUrl = isSatellite
      ? 'http://t4.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf'
      : 'http://t4.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=036825be613a859007fa3004c9e87ddf'

    this.removeLayer('baseTileLayer')
    this.removeLayer('baseTileWZLayer')

    const newTileLayer = this.layerFactory.createXYZLayer(tileUrl, { zIndex: 0 })
    const newTileWZLayer = this.layerFactory.createXYZLayer(tileWZUrl, { zIndex: 1 })

    this.map.addLayer(newTileLayer)
    this.map.addLayer(newTileWZLayer)

    this.layers.set('baseTileLayer', newTileLayer)
    this.layers.set('baseTileWZLayer', newTileWZLayer)
  }

  /**
   * 绑定地图事件
   */
  bindMapEvents() {
    const events = [
      'singleclick',
      'dblclick',
      'pointermove',
      'pointerdrag',
      'movestart',
      'moveend',
      'zoomstart',
      'zoomend',
    ]

    events.forEach((eventName) => {
      const key = this.map.on(eventName, (event) => {
        // 处理点击事件中的要素选择
        if (eventName === 'singleclick') {
          this.handleFeatureClick(event)
        }
        if (eventName === 'pointermove') {
          this.handlePointerMove(event)
        }
        // 触发回调
        if (this.callbacks[eventName]) {
          this.callbacks[eventName](event)
        }
      })
      this.eventKeys.set(eventName, key)
    })
  }

  /**
   * 处理要素点击事件
   * @param {Object} event - 事件对象
   */
  handleFeatureClick(event) {
    const features = []
    this.map.forEachFeatureAtPixel(
      event.pixel,
      (feature) => {
        features.push(feature)
      },
      { hitTolerance: 10 },
    )

    if (features.length > 0 && this.callbacks.featureClick) {
      this.callbacks.featureClick({ event, features })
    }
  }

  /**
   * 处理指针移动事件
   * @param {Object} event - 事件对象
   */
  handlePointerMove(event) {
    const features = []
    this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
      features.push(feature)
    })

    if (features.length > 0 && this.callbacks.pointerMove) {
      this.callbacks.pointerMove({ event, features })
    }
  }

  /**
   * 设置回调函数
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    this.callbacks[event] = callback
  }

  /**
   * 移除回调函数
   * @param {string} event - 事件名称
   */
  off(event) {
    delete this.callbacks[event]
  }

  /**
   * 创建视图
   * @param {Array<number>} center - 中心点坐标
   * @param {number} zoom - 缩放级别
   * @returns {View} 视图实例
   */
  createView(center, zoom) {
    return new View({
      center: center,
      projection: new Projection({
        code: 'EPSG:4326',
        units: 'degrees',
        axisOrientation: 'neu',
      }),
      zoom: zoom,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom,
      extent: this.options.extent,
    })
  }

  /**
   * 图层工厂方法
   */
  layerFactory = {
    /**
     * 创建标准XYZ图层
     * @param {string} url - 瓦片URL
     * @param {Object} [options={}] - 其他选项
     * @param {number} [options.zIndex=0] - 图层层级
     * @param {Object} [options.sourceOptions={}] - 数据源选项
     * @param {Object} [options.layerOptions={}] - 图层选项
     * @returns {TileLayer} XYZ图层
     */
    createXYZLayer: (url, options = {}) => {
      const { zIndex = 0, sourceOptions = {}, layerOptions = {} } = options
      return new TileLayer({
        source: new XYZ({ url: url, ...sourceOptions }),
        zIndex: zIndex,
        ...layerOptions,
      })
    },

    /**
     * 创建标准WMS切片源
     * @param {Object} options - WMS配置选项
     * @param {number} [options.ratio=1] - 比例
     * @param {string} options.url - URL地址
     * @param {string} options.layer - 图层名称
     * @param {string} [options.version='1.1.0'] - 版本号
     * @param {boolean} [options.tiled=true] - 是否切片
     * @param {Object} [options.params={}] - 参数
     * @param {string} [options.serverType='geoserver'] - 服务器类型
     * @param {Object} [options.layerOptions={}] - 图层选项
     * @returns {ImageWMS} WMS切片源
     */
    createImageWMS: (options) => {
      const {
        ratio = 1,
        url,
        layer,
        version = '1.1.0',
        tiled = true,
        params = {},
        serverType = 'geoserver',
        layerOptions = {},
      } = options

      return new ImageWMS({
        ratio: ratio,
        url: url,
        params: {
          LAYERS: layer,
          VERSION: version,
          TILED: tiled,
          ...params,
        },
        serverType: serverType,
        ...layerOptions,
      })
    },

    /**
     * 创建标准ImageLayer图层
     * @returns {ImageLayer} 图像图层
     */
    createImageLayer: (canvas, extent) => {
      return new ImageLayer({
        source: new ImageStatic({
          url: canvas.toDataURL(),
          imageExtent: extent,
          projection: 'EPSG:4326',
        }),
      })
    },

    /**
     * 创建蒙层遮罩
     * @param {Object} [options={}] - 其他选项
     * @param {string} [options.color='rgba(0, 15, 6, 0.3)'] - 遮罩颜色
     * @param {number} [options.zIndex=10] - 图层层级
     * @returns {VectorLayer} 蒙层图层
     */
    createShadeLayer: (options = {}) => {
      const { color = 'rgba(0, 15, 6, 0.3)', zIndex = 10 } = options
      const polygonRing = fromExtent(this.options.extent)
      const feature = new Feature({ geometry: polygonRing })
      return new VectorLayer({
        source: new SourceVector({ features: [feature] }),
        style: new Style({
          fill: new Fill({ color: color }),
        }),
        zIndex: zIndex,
      })
    },

    /**
     * 创建多边形图层
     * @param {Object} data - GeoJSON数据
     * @param {Style} style - 样式
     * @param {Object} [options={}] - 其他选项
     * @param {number} [options.zIndex=30] - 图层层级
     * @returns {VectorLayer} 多边形图层
     */
    createPolygonLayer: (data, style, options = {}) => {
      const { zIndex = 30, ...layerOptions } = options
      return new VectorLayer({
        source: new SourceVector({
          features: new GeoJSON().readFeatures(data),
        }),
        style: style,
        zIndex: zIndex,
        ...layerOptions,
      })
    },

    /**
     * 创建一个矢量图层
     * @param {Object} [options={}] - 其他选项
     * @param {number} [options.zIndex=50] - 图层层级
     * @returns {VectorLayer} 矢量图层
     */
    createVectorLayer: (options = {}) => {
      const { zIndex = 50, ...layerOptions } = options
      return new VectorLayer({
        source: new SourceVector({}),
        zIndex: zIndex,
        ...layerOptions,
      })
    },

    /**
     * 创建标准图标图层
     * @param {Array<Feature>} features - 要素数组
     * @param {Object} [options={}] - 其他选项
     * @param {number} [options.zIndex=20] - 图层层级
     * @returns {VectorLayer} 图标图层
     */
    createIconLayer: (features, options = {}) => {
      const { zIndex = 20, ...layerOptions } = options
      return new VectorLayer({
        source: new SourceVector({ features: features }),
        zIndex: zIndex,
        ...layerOptions,
      })
    },
  }

  /**
   * 样式工厂方法
   */
  styleFactory = {
    /**
     * 创建样式
     * @param {Object|string} options - 样式选项或填充颜色
     * @param {string} [strokeColor] - 描边颜色
     * @param {number} [strokeWidth] - 描边宽度
     * @returns {Style} 样式对象
     */
    createStyle: (options, strokeColor, strokeWidth) => {
      // 如果第一个参数是对象，则认为是完整的样式配置
      if (typeof options === 'object') {
        return new Style(options)
      }

      // 如果第一个参数是字符串，则认为是填充颜色
      return new Style({
        fill: new Fill({ color: options }),
        stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
      })
    },

    /**
     * 创建图标样式
     * @param {Object} options - 图标选项
     * @param {string} options.src - 图标路径
     * @param {number} [options.opacity=1] - 透明度
     * @param {number} [options.scale=1] - 缩放比例
     * @param {Array<number>} [options.anchor=[0.5, 0.5]] - 锚点
     * @returns {Style} 图标样式
     */
    createIconStyle: (options) => {
      const { src, opacity = 1, scale = 1, anchor = [0.5, 0.5] } = options
      return new Style({
        image: new Icon({
          src: src,
          opacity: opacity,
          scale: scale,
          anchor: anchor,
        }),
      })
    },

    /**
     * 创建圆样式
     * @param {Object} [options={}] - 样式选项
     * @param {number} [options.radius=8] - 半径
     * @param {string} [options.fillColor='#00B07D'] - 填充颜色
     * @param {string} [options.strokeColor='#FFFFFF'] - 描边颜色
     * @param {number} [options.strokeWidth=2] - 描边宽度
     * @returns {Style} 圆样式
     */
    createCircleStyle: (options = {}) => {
      const defaultOptions = {
        radius: 8,
        fillColor: '#00B07D',
        strokeColor: '#FFFFFF',
        strokeWidth: 2,
      }

      const styleOptions = { ...defaultOptions, ...options }

      return new Style({
        image: new Circle({
          radius: styleOptions.radius,
          fill: new Fill({
            color: styleOptions.fillColor,
          }),
          stroke: new Stroke({
            color: styleOptions.strokeColor,
            width: styleOptions.strokeWidth,
          }),
        }),
      })
    },

    /**
     * 创建文本样式
     * @param {Object} [options={}] - 样式选项
     * @param {string} [options.text=''] - 文本内容
     * @param {string} [options.font='400 14px Microsoft YaHei UI, Microsoft YaHei UI'] - 字体
     * @param {string} [options.fillColor='#FFFFFF'] - 填充颜色
     * @param {string} [options.strokeColor='#000000'] - 描边颜色
     * @param {number} [options.strokeWidth=0] - 描边宽度
     * @returns {Style} 文本样式
     */
    createTextStyle: (options = {}) => {
      const defaultOptions = {
        text: '',
        font: '400 14px Microsoft YaHei UI, Microsoft YaHei UI',
        fillColor: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 0,
      }

      const styleOptions = { ...defaultOptions, ...options }

      return new Style({
        text: new Text({
          text: styleOptions.text,
          font: styleOptions.font,
          fill: new Fill({ color: styleOptions.fillColor }),
          stroke:
            styleOptions.strokeWidth > 0
              ? new Stroke({
                  color: styleOptions.strokeColor,
                  width: styleOptions.strokeWidth,
                })
              : undefined,
        }),
      })
    },

    /**
     * 创建测量样式
     * @param {Object} [options={}] - 样式选项
     * @param {string} [options.strokeColor='#ffcc33'] - 描边颜色
     * @param {number} [options.strokeWidth=2] - 描边宽度
     * @param {string} [options.fillColor='rgba(255, 255, 255, 0.2)'] - 填充颜色
     * @returns {Style} 测量样式
     */
    createMeasureStyle: (options = {}) => {
      const defaultOptions = {
        strokeColor: '#ffcc33',
        strokeWidth: 2,
        fillColor: 'rgba(255, 255, 255, 0.2)',
      }

      const styleOptions = { ...defaultOptions, ...options }

      return new Style({
        fill: new Fill({
          color: styleOptions.fillColor,
        }),
        stroke: new Stroke({
          color: styleOptions.strokeColor,
          width: styleOptions.strokeWidth,
        }),
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: styleOptions.strokeColor,
          }),
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      })
    },
  }
  // 全局状态管理 - 关键：跟踪当前激活的要素

  /**
   * 要素工厂方法
   */
  featureFactory = {
    /**
     * 创建圆几何
     * @param {Array<number>} coordinate - 圆心坐标
     * @param {number} radius - 半径（米）
     * @returns {Feature} 圆要素
     */
    createCircleGeometry: (coordinate, radius) => {
      const circle = new CircleGeometry(coordinate, radius, 64)
      return new Feature(circle)
    },

    /**
     * 创建圆要素
     * @param {Array<number>} coordinate - 坐标
     * @param {Object} [options={}] - 样式选项
     * @returns {Feature} 圆要素
     */
    createCircleFeature: (coordinate, options = {}) => {
      const feature = new Feature({ geometry: new Point(coordinate) })
      const style = this.styleFactory.createCircleStyle(options)
      feature.setStyle(style)
      return feature
    },

    /**
     * 创建多边形要素
     * @param {Array<Array<Array<number>>>} coordinates - 坐标数组-三维数组 示例：[[[118.47066238,31.98567678], ...]]
     * @param {Object} [options={}] - 样式选项
     * @returns {Feature} 多边形要素
     */
    createPolygonFeature: (coordinates, options = {}) => {
      const feature = new Feature({ geometry: new Polygon(coordinates), type: 'Polygon' })

      if (options) {
        const style = this.styleFactory.createStyle(
          options.fillColor || 'rgba(255, 0, 0, 0.5)',
          options.strokeColor || '#ff0000',
          options.strokeWidth || 2,
        )
        feature.setStyle(style)
      }

      return feature
    },

    /**
     * 创建线要素
     * @param {Array<Array<number>>} coordinates - 坐标数组
     * @param {Object} [options={}] - 样式选项
     * @returns {Feature} 线要素
     */
    createLineFeature: (coordinates, options = {}) => {
      const feature = new Feature({ geometry: new LineString(coordinates) })

      const defaultOptions = {
        strokeColor: '#3399CC',
        strokeWidth: 2,
      }

      const styleOptions = { ...defaultOptions, ...options }
      const style = new Style({
        stroke: new Stroke({ color: styleOptions.strokeColor, width: styleOptions.strokeWidth }),
      })
      feature.setProperties({ style: style })
      return feature
    },

    /**
     * 创建文本要素
     * @param {Array<number>} coordinate - 坐标
     * @param {Object} options - 文本选项
     * @param {string} options.text - 文本内容
     * @returns {Feature} 文本要素
     */
    createTextFeature: (coordinate, options) => {
      const feature = new Feature({
        geometry: new Point(coordinate),
      })

      const style = this.styleFactory.createTextStyle(options)
      feature.setStyle(style)
      return feature
    },

    /**
     * 创建标记要素
     * @param {Array<number>} coordinate - 坐标
     * @param {Object} options - 标记选项
     * @param {string} options.src - 图标路径
     * @returns {Feature} 标记要素
     */
    createMarkerFeature: (coordinate, options) => {
      const { src, ...otherOptions } = options
      const feature = new Feature({
        geometry: new Point(coordinate),
        ...otherOptions.properties,
      })

      const markerStyle = this.styleFactory.createIconStyle({
        src: src,
        scale: otherOptions.scale || 1,
        anchor: otherOptions.anchor || [0.5, 1], // 修改锚点为底部中心
        opacity: otherOptions.opacity || 1,
        ...otherOptions,
      })
      feature.setProperties({
        style: markerStyle,
      })
      feature.setStyle(markerStyle)
      // 添加要素状态
      feature.state = {
        isHover: false,
        isClicked: false,
        isShrinkPoint: false,
      }
      // 从要素属性获取图片路径并创建样式
      feature.getStyleByState = function () {
        let iconSrc

        if (this.state.isClicked) {
          iconSrc = this.values_.mouseClickSrc // 从属性获取点击状态图片
        } else if (this.state.isHover) {
          iconSrc = this.values_.mouseHoverSrc // 从属性获取悬停状态图片
        } else {
          if (globalIconMode === 'large') {
            iconSrc = this.values_.defaultSrc || ''
          } else {
            iconSrc = this.values_.mouseDotSrc || this.values_.defaultSrc
          }
        }
        // 获取 scale 属性，优先使用 feature 的 scale 属性，其次用 options 里的 scale，最后默认 0.8
        const scale =
          this.values_ && this.values_.scale !== undefined
            ? this.values_.scale
            : otherOptions.scale !== undefined
              ? otherOptions.scale
              : 1
        return new Style({
          image: new Icon({
            src: iconSrc,
            anchor: [0.5, 1], // 底部中心对齐
            scale: scale,
          }),
        })
      }
      // 统一样式更新方法
      feature.updateStyle = function () {
        const style = this.getStyleByState()
        this.setStyle(style)
      }
      // 鼠标移入
      feature.mouseIn = function () {
        if (globalState.hoveredFeature && globalState.hoveredFeature !== this) {
          // 清除样式
          globalState.hoveredFeature.state.isHover = false
          globalState.hoveredFeature.mouseOut()
        }
        if (!this.state.isClicked) {
          this.state.isHover = true
          globalState.hoveredFeature = this
          this.updateStyle()
        }
      }

      // 鼠标移出
      feature.mouseOut = function () {
        if (!this.state.isClicked) {
          this.state.isHover = false
          this.updateStyle()
        }
      }

      // 鼠标点击
      feature.mouseClick = function () {
        // 先取消上一个选中要素的状态
        if (globalState.selectedFeature && globalState.selectedFeature !== this) {
          globalState.selectedFeature.state.isClicked = false
          globalState.selectedFeature.mouseOut()
        }

        // 切换当前要素的选中状态
        this.state.isClicked = !this.state.isClicked

        // 更新全局选中状态
        globalState.selectedFeature = this.state.isClicked ? this : null

        this.updateStyle()
      }

      // 地图缩放
      feature.onMapZoom = function () {
        // 调用这个方法的feature，则认为这个feature有缩略图标
        this.updateStyle()
      }

      // 初始化样式
      feature.setNormalStyle = function () {
        this.state.isHover = false
        this.state.isClicked = false
        globalState.hoveredFeature = null
        globalState.selectedFeature = null
        this.updateStyle()
      }
      return feature
    },
  }

  /**
   * 根据坐标选中图层要素
   * @param {Layer} layer - 图层
   * @param {Array<number>} coordinate - 坐标
   * @returns {Promise<Array<Feature>>} 要素数组
   */
  async getFeatures(layer, coordinate) {
    let features = null
    const url = layer
      .getSource()
      .getFeatureInfoUrl(coordinate, this.view.getResolution(), 'EPSG:4326', {
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: 50,
        exceptions: 'application/vnd.ogc.se_inimage',
        ...layer.getSource().getParams(),
      })

    // 判断是否有要素
    if (url) {
      const response = await fetch(url)
      const data = await response.json()
      features = new GeoJSON().readFeatures(data)
    }
    return features
  }

  /**
   * 交互工厂方法
   */
  interactionFactory = {
    /**
     * 创建修改交互
     * @param {SourceVector} source - 矢量源
     * @param {Object} [options={}] - 其他选项
     * @returns {Modify} 修改交互
     */
    createModify: (source, options = {}) => {
      const defaultStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#00B07D',
          }),
          stroke: new Stroke({
            color: '#00FFB5',
            width: 4,
          }),
        }),
      })

      return new Modify({
        source: source,
        style: options.style || defaultStyle,
        ...options,
      })
    },

    /**
     * 添加修改交互
     * @param {SourceVector|Feature} source - 矢量源或要素
     * @param {Object} [options={}] - 其他选项
     * @returns {Modify} 修改交互
     */
    addModifyInteraction: (source, options = {}) => {
      // 如果传入的是Feature而不是Source，则需要获取其source
      // 或创建一个包含该feature的source
      let modifySource = source
      if (source && typeof source.getGeometry === 'function') {
        // 这是一个Feature，创建一个包含该Feature的Source
        modifySource = new SourceVector({
          features: [source],
        })
      }

      const modify = this.interactionFactory.createModify(modifySource, options)

      this.map.addInteraction(modify)
      this.interactions.set('modify', modify)
      return modify
    },

    /**
     * 添加绘制交互
     * @param {SourceVector} source - 矢量源
     * @param {Object} [options={}] - 其他选项
     * @param {string} [options.type='Polygon'] - 绘制类型 ('Point', 'LineString', 'Polygon', 'Circle', 'Rectangle')
     * @returns {Draw} 绘制交互
     */
    addDrawInteraction: (source, options = {}) => {
      const { type = 'Polygon', ...drawOptions } = options

      // 处理特殊类型
      let geometryFunction
      let drawType = type
      if (type === 'Rectangle') {
        drawType = 'Circle'
        geometryFunction = Draw.createBox()
      } else if (type === 'Circle') {
        // 使用默认的圆形绘制
        geometryFunction = Draw.createRegularPolygon()
      }

      const defaultStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#00B07D',
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2,
          }),
        }),
        fill: new Fill({
          color: 'rgba(32,201,151,0.4)',
        }),
        stroke: new Stroke({
          color: '#7FFFD9',
          width: 2,
        }),
      })

      const draw = new Draw({
        source: source,
        type: drawType,
        geometryFunction: geometryFunction,
        freehand: drawOptions.freehand || false,
        style: drawOptions.style || defaultStyle,
        ...drawOptions,
      })

      // 直接绑定绘制事件，避免使用this调用
      draw.on('drawstart', (event) => {
        if (this.callbacks.drawStart) {
          this.callbacks.drawStart(event)
        }
      })

      draw.on('drawend', (event) => {
        if (this.callbacks.drawEnd) {
          this.callbacks.drawEnd(event)
        }
      })

      this.map.addInteraction(draw)
      this.interactions.set('draw_' + type.toLowerCase(), draw)
      return draw
    },

    /**
     * 添加选择交互
     * @param {Object} [options={}] - 选项
     * @returns {Select} 选择交互
     */
    addSelectInteraction: (options = {}) => {
      const select = new Select({
        ...options,
      })

      // 直接绑定选择事件，避免使用this调用
      select.on('select', (event) => {
        if (this.callbacks.select) {
          this.callbacks.select(event)
        }
      })

      this.map.addInteraction(select)
      this.interactions.set('select', select)
      return select
    },

    /**
     * 添加捕捉交互
     * @param {SourceVector} source - 矢量源
     * @param {Object} [options={}] - 选项
     * @returns {Snap} 捕捉交互
     */
    addSnapInteraction: (source, options = {}) => {
      const snap = new Snap({
        source: source,
        ...options,
      })

      this.map.addInteraction(snap)
      this.interactions.set('snap', snap)
      return snap
    },

    /**
     * 移除交互
     * @param {string} type - 交互类型
     */
    removeInteraction: (type) => {
      const interaction = this.interactions.get(type)
      if (interaction) {
        this.map.removeInteraction(interaction)
        this.interactions.set(type, null)
      }
    },
  }

  /**
   * 创建覆盖物
   * @param {Object} options - 覆盖物选项
   * @param {HTMLElement} options.element - DOM元素
   * @param {Array<number>} options.position - 位置坐标
   * @param {string} [options.positioning='bottom-center'] - 定位方式
   * @param {boolean} [options.stopEvent=true] - 是否阻止事件
   * @param {boolean} [options.autoPan] - 是否自动平移
   * @param {number} [options.autoPanMargin=150] - 自动平移边距
   * @param {string} [options.className] - CSS类名
   * @returns {Overlay} 覆盖物
   */
  createOverlay(options) {
    const {
      element,
      position,
      positioning = 'bottom-center',
      stopEvent = true,
      autoPan,
      autoPanMargin = 150,
      className,
    } = options

    const overlayOptions = {
      element: element,
      position: position,
      positioning: positioning,
      stopEvent: stopEvent,
      autoPan: autoPan,
      autoPanMargin: autoPanMargin,
      className: className,
    }

    return new Overlay(overlayOptions)
  }

  /**
   * 添加覆盖物
   * @param {string} id - 覆盖物ID
   * @param {Overlay} overlay - 覆盖物实例
   */
  addOverlay(id, overlay) {
    this.map.addOverlay(overlay)
    this.overlays.set(id, overlay)
  }

  /**
   * 移除覆盖物
   * @param {string} id - 覆盖物ID
   */
  removeOverlay(id) {
    // 添加类型检查保护，确保 overlays 是 Map 对象并且有 delete 方法
    if (
      this.overlays &&
      this.overlays instanceof Map &&
      typeof this.overlays.delete === 'function'
    ) {
      const overlay = this.overlays.get(id)
      if (overlay) {
        this.map.removeOverlay(overlay)
        this.overlays.delete(id)
      }
    } else {
      console.warn('OlMap: overlays is not a valid Map object')
    }
  }

  /**
   * 添加图层
   * @param {string} id - 图层ID
   * @param {Layer} layer - 图层实例
   */
  addLayer(id, layer, options = {}) {
    this.map.addLayer(layer)
    this.layers.set(id, layer)
    if (options && typeof options.zIndex === 'number' && typeof layer.setZIndex === 'function') {
      layer.setZIndex(options.zIndex)
    }
  }

  /**
   * 移除图层
   * @param {string} id - 图层ID
   */
  removeLayer(id) {
    const layer = this.layers.get(id)
    if (layer) {
      this.map.removeLayer(layer)
      // 兼容性处理：检查delete方法是否存在
      if (this.layers && typeof this.layers.delete === 'function') {
        this.layers.delete(id)
      } else {
        // 降级处理：确保图层引用被正确清理
        this.layers.set(id, undefined)
      }
    }
  }

  /**
   * 获取图层
   * @param {string} id - 图层ID
   * @returns {Layer} 图层实例
   */
  getLayer(id) {
    return this.layers.get(id)
  }

  /**
   * 定位到指定范围
   * @param {Array<number>} extent - 范围坐标 [minX, minY, maxX, maxY]
   * @param {Object} [options={}] - 其他选项
   * @param {number} [options.maxZoom=17] - 最大缩放级别
   * @param {number} [options.duration=1000] - 动画持续时间(毫秒)
   */
  flyToExtent(extent, options = {}) {
    const { maxZoom = 17, duration = 1000 } = options
    this.view.fit(extent, {
      duration: duration,
      maxZoom: maxZoom,
    })
  }

  /**
   * 定位到指定坐标
   * @param {Array<number>} coordinate - 坐标
   * @param {number} zoom - 缩放级别
   * @param {Object} [options={}] - 其他选项
   * @param {number} [options.duration=1000] - 动画持续时间(毫秒)
   */
  flyToCoordinate(coordinate, zoom, options = {}) {
    const { duration = 1000 } = options
    this.view.animate({
      center: coordinate,
      zoom: zoom,
      duration: duration,
    })
  }

  /**
   * 设置轨迹回放数据
   * @param {Array<Array<number>>} coordinates - 轨迹坐标数组 [[lng, lat], ...]
   * @param {Object} [options={}] - 选项
   * @param {number} [options.speed=1000] - 播放速度(毫秒)
   */
  setTrackReplayData(coordinates, options = {}) {
    this.trackReplay.features = coordinates.map(
      (coord) =>
        new Feature({
          geometry: new Point(coord),
        }),
    )

    this.trackReplay.speed = options.speed || 1000
  }

  /**
   * 开始轨迹回放
   * @param {VectorLayer} layer - 要添加轨迹点的图层
   * @param {Object} [options={}] - 其他选项
   * @param {string} [options.icon='https://openlayers.org/en/latest/examples/data/icon.png'] - 图标URL
   * @param {number} [options.zoom=15] - 缩放级别
   * @param {string} [options.lineColor='#ff0000'] - 轨迹线颜色
   * @param {number} [options.lineWidth=3] - 轨迹线宽度
   * @param {boolean} [options.follow=true] - 是否跟随
   */
  startTrackReplay(layer, options = {}) {
    if (this.trackReplay.features.length === 0) {
      console.warn('没有轨迹数据')
      return
    }

    this.stopTrackReplay()

    this.trackReplay.currentIndex = 0
    this.trackReplay.isPlaying = true

    const {
      icon = 'https://openlayers.org/en/latest/examples/data/icon.png',
      zoom = 15,
      lineColor = '#ff0000',
      lineWidth = 3,
      follow = true,
    } = options

    // 创建轨迹线
    const lineCoordinates = this.trackReplay.features.map((f) => f.getGeometry().getCoordinates())
    this.trackReplay.line = this.featureFactory.createLineFeature(lineCoordinates, {
      strokeColor: lineColor,
      strokeWidth: lineWidth,
    })
    layer.getSource().addFeature(this.trackReplay.line)

    // 创建移动标记
    const startCoord = this.trackReplay.features[0].getGeometry().getCoordinates()
    this.trackReplay.marker = this.featureFactory.createMarkerFeature(startCoord, { src: icon })
    layer.getSource().addFeature(this.trackReplay.marker)

    // 定位到起点
    this.flyToCoordinate(startCoord, zoom)

    this.startTrackReplayTimer(layer, { icon, zoom, lineColor, lineWidth, follow })
  }

  /**
   * 开始轨迹回放计时器
   * @param {VectorLayer} layer - 图层
   * @param {Object} options - 选项
   * @param {string} options.icon - 图标URL
   * @param {number} options.zoom - 缩放级别
   * @param {string} options.lineColor - 轨迹线颜色
   * @param {number} options.lineWidth - 轨迹线宽度
   * @param {boolean} options.follow - 是否跟随
   */
  startTrackReplayTimer(layer, options) {
    const { follow } = options
    const moveNext = () => {
      if (!this.trackReplay.isPlaying) return

      this.trackReplay.currentIndex++
      if (this.trackReplay.currentIndex >= this.trackReplay.features.length) {
        this.trackReplay.currentIndex = 0 // 循环播放
      }

      const coord = this.trackReplay.features[this.trackReplay.currentIndex]
        .getGeometry()
        .getCoordinates()
      this.trackReplay.marker.getGeometry().setCoordinates(coord)

      // 更新视角
      if (follow !== false) {
        this.view.setCenter(coord)
      }

      // 更新定时器
      this.trackReplay.timer = setTimeout(moveNext, this.trackReplay.speed)
    }

    this.trackReplay.timer = setTimeout(moveNext, this.trackReplay.speed)
  }

  /**
   * 暂停/继续轨迹回放
   */
  toggleTrackReplay() {
    this.trackReplay.isPlaying = !this.trackReplay.isPlaying
    if (this.trackReplay.isPlaying) {
      // 重新启动计时器
      const moveNext = () => {
        if (!this.trackReplay.isPlaying) return

        this.trackReplay.currentIndex++
        if (this.trackReplay.currentIndex >= this.trackReplay.features.length) {
          this.trackReplay.currentIndex = 0
        }

        const coord = this.trackReplay.features[this.trackReplay.currentIndex]
          .getGeometry()
          .getCoordinates()
        this.trackReplay.marker.getGeometry().setCoordinates(coord)

        this.trackReplay.timer = setTimeout(moveNext, this.trackReplay.speed)
      }

      this.trackReplay.timer = setTimeout(moveNext, this.trackReplay.speed)
    } else {
      clearTimeout(this.trackReplay.timer)
    }
  }

  /**
   * 停止轨迹回放
   */
  stopTrackReplay() {
    this.trackReplay.isPlaying = false
    if (this.trackReplay.timer) {
      clearTimeout(this.trackReplay.timer)
      this.trackReplay.timer = null
    }
  }

  /**
   * 设置无人机位置
   * @param {Array<number>} coordinate - 坐标
   * @param {Object} [options={}] - 选项
   * @param {string} [options.icon='https://openlayers.org/en/latest/examples/data/icon.png'] - 图标URL
   */
  setDronePosition(coordinate, options = {}) {
    const { icon = 'https://openlayers.org/en/latest/examples/data/icon.png', ...otherOptions } =
      options
    this.droneFlight.position = coordinate

    if (!this.droneFlight.marker) {
      this.droneFlight.marker = this.featureFactory.createMarkerFeature(coordinate, {
        src: icon,
        ...otherOptions,
      })
    } else {
      this.droneFlight.marker.getGeometry().setCoordinates(coordinate)
    }
  }

  /**
   * 开始无人机飞行
   * @param {Array<Array<number>>} path - 飞行路径
   * @param {VectorLayer} layer - 图层
   * @param {Object} [options={}] - 选项
   * @param {string} [options.icon='https://openlayers.org/en/latest/examples/data/icon.png'] - 图标URL
   * @param {string} [options.trailColor='#0000ff'] - 轨迹线颜色
   * @param {number} [options.trailWidth=2] - 轨迹线宽度
   * @param {number} [options.zoom=15] - 缩放级别
   * @param {boolean} [options.loop=false] - 是否循环
   * @param {boolean} [options.follow=true] - 是否跟随
   * @param {number} [options.speed=1000] - 飞行速度(毫秒)
   */
  startDroneFlight(path, layer, options = {}) {
    if (!path || path.length === 0) {
      console.warn('没有飞行路径')
      return
    }

    this.stopDroneFlight()

    const {
      icon = 'https://openlayers.org/en/latest/examples/data/icon.png',
      trailColor = '#0000ff',
      trailWidth = 2,
      zoom = 15,
      loop = false,
      follow = true,
      speed = 1000,
    } = options

    // 创建飞行轨迹线
    this.droneFlight.trail = path
    this.droneFlight.trailFeature = this.featureFactory.createLineFeature(path, {
      strokeColor: trailColor,
      strokeWidth: trailWidth,
    })
    layer.getSource().addFeature(this.droneFlight.trailFeature)

    // 创建无人机标记
    this.setDronePosition(path[0], { src: icon })
    layer.getSource().addFeature(this.droneFlight.marker)

    // 定位到起点
    this.flyToCoordinate(path[0], zoom)

    this.startDroneFlightTimer(path, layer, { loop, follow, speed })
  }

  /**
   * 开始无人机飞行计时器
   * @param {Array<Array<number>>} path - 飞行路径
   * @param {VectorLayer} layer - 图层
   * @param {Object} options - 选项
   * @param {boolean} options.loop - 是否循环
   * @param {boolean} options.follow - 是否跟随
   * @param {number} options.speed - 飞行速度(毫秒)
   */
  startDroneFlightTimer(path, layer, options) {
    const { loop, follow, speed } = options
    let currentIndex = 0
    this.droneFlight.isFlying = true

    // 清除现有轨迹
    if (this.droneFlight.trailFeature) {
      layer.getSource().removeFeature(this.droneFlight.trailFeature)
    }

    // 创建新的轨迹线
    this.droneFlight.trailFeature = this.featureFactory.createLineFeature(path, {
      strokeColor: '#0000ff',
      strokeWidth: 2,
    })
    layer.getSource().addFeature(this.droneFlight.trailFeature)

    const flyNext = () => {
      if (!this.droneFlight.isFlying) return

      currentIndex++
      if (currentIndex >= path.length) {
        if (loop) {
          currentIndex = 0
        } else {
          this.stopDroneFlight()
          return
        }
      }

      const coord = path[currentIndex]
      this.setDronePosition(coord)

      // 更新视角
      if (follow !== false) {
        this.view.setCenter(coord)
      }

      this.droneFlight.interval = setTimeout(flyNext, speed)
    }

    this.droneFlight.interval = setTimeout(flyNext, speed)
  }

  /**
   * 停止无人机飞行
   */
  stopDroneFlight() {
    this.droneFlight.isFlying = false
    if (this.droneFlight.interval) {
      clearTimeout(this.droneFlight.interval)
      this.droneFlight.interval = null
    }
  }

  /**
   * 获取地图范围
   * @returns {Array<number>} extent - 地图范围
   */
  getMapExtent() {
    return this.view.calculateExtent(this.map.getSize())
  }

  /**
   * 获取地图中心点
   * @returns {Array<number>} center - 中心点坐标
   */
  getMapCenter() {
    return this.view.getCenter()
  }

  /**
   * 获取地图缩放级别
   * @returns {number} zoom - 缩放级别
   */
  getMapZoom() {
    return this.view.getZoom()
  }

  /**
   * 设置地图中心点
   * @param {Array<number>} center - 中心点坐标
   * @param {Object} [options={}] - 其他选项
   * @param {boolean} [options.animate=false] - 是否使用动画
   */
  setMapCenter(center, options = {}) {
    const { animate = false } = options
    if (animate) {
      this.view.animate({
        center: center,
        duration: 500,
      })
    } else {
      this.view.setCenter(center)
    }
  }

  /**
   * 设置地图缩放级别
   * @param {number} zoom - 缩放级别
   * @param {Object} [options={}] - 其他选项
   * @param {boolean} [options.animate=false] - 是否使用动画
   */
  setMapZoom(zoom, options = {}) {
    const { animate = false } = options
    if (animate) {
      this.view.animate({
        zoom: zoom,
        duration: 500,
      })
    } else {
      this.view.setZoom(zoom)
    }
  }

  /**
   * 添加动画效果到要素
   * @param {Feature} feature - 要素
   * @param {Object} [options={}] - 动画选项
   * @param {number} [options.duration=2000] - 动画持续时间(毫秒)
   * @param {number} [options.from=0] - 起始角度
   * @param {number} [options.to=360] - 结束角度
   */
  animateFeature(feature, options = {}) {
    const { duration = 2000, from = 0, to = 360 } = options
    const start = Date.now()

    const animate = () => {
      const elapsed = Date.now() - start
      const fraction = Math.min(elapsed / duration, 1)
      const angle = from + (to - from) * fraction

      const style = feature.getStyle()
      if (style && style.getImage) {
        const image = style.getImage()
        if (image) {
          image.setRotation((angle * Math.PI) / 180)
          feature.changed()
        }
      }

      if (fraction < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  /**
   * 开始测量
   * @param {string} type - 测量类型 ('length' 或 'area')
   * @param {Object} [options={}] - 选项
   */
  startMeasure(type, options = {}) {
    // 清除之前的测量
    this.clearMeasure()

    // 创建测量图层
    this.measure.layer = this.layerFactory.createVectorLayer({
      style: this.styleFactory.createMeasureStyle(),
      zIndex: 100,
    })

    this.map.addLayer(this.measure.layer)

    // 创建绘制交互
    this.measure.draw = this.interactionFactory.addDrawInteraction(this.measure.layer.getSource(), {
      type: type === 'area' ? 'Polygon' : 'LineString',
      style: this.styleFactory.createMeasureStyle(),
      ...options,
    })

    // 绑定绘制事件
    this.measure.draw.on('drawstart', (evt) => {
      this.measure.sketch = evt.feature

      if (this.callbacks.measureStart) {
        this.callbacks.measureStart(evt)
      }
    })

    this.measure.draw.on('drawend', (evt) => {
      const feature = evt.feature

      // 计算测量结果
      const result = this.calculateMeasure(feature)

      // 添加测量标签
      const geometry = feature.getGeometry()
      const coordinates =
        geometry.getType() === 'Polygon'
          ? geometry.getInteriorPoint().getCoordinates()
          : geometry.getLastCoordinate()

      const label = this.featureFactory.createTextFeature(coordinates, { text: result })
      this.measure.layer.getSource().addFeature(label)

      this.measure.sketch = null

      if (this.callbacks.measureEnd) {
        this.callbacks.measureEnd({ ...evt, result, label })
      }
    })

    if (this.callbacks.measureStart) {
      this.callbacks.measureStart({ type })
    }
  }

  /**
   * 计算测量结果
   * @param {Feature} feature - 要素
   * @returns {string} 测量结果文本
   */
  calculateMeasure(feature) {
    const geometry = feature.getGeometry()
    const type = geometry.getType()

    if (type === 'LineString') {
      const length = Math.round(geometry.getLength() * 100) / 100
      let output
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + ' km'
      } else {
        output = length + ' m'
      }
      return output
    } else if (type === 'Polygon') {
      const area = Math.round(geometry.getArea() * 100) / 100
      let output
      if (area > 1000000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' km²'
      } else {
        output = area + ' m²'
      }
      return output
    }
    return ''
  }

  /**
   * 清除测量
   */
  clearMeasure() {
    if (this.measure.draw) {
      this.interactionFactory.removeInteraction('draw_' + this.measure.draw.getType().toLowerCase())
      this.measure.draw = null
    }

    if (this.measure.layer) {
      this.map.removeLayer(this.measure.layer)
      this.measure.layer = null
    }

    this.measure.sketch = null

    // 清除所有测量相关的feature
    if (this.measure.layer && this.measure.layer.getSource()) {
      this.measure.layer.getSource().clear()
    }
  }

  /**
   * 导出地图为图片
   * @param {Object} [options={}] - 导出选项
   * @param {string} [options.format='image/png'] - 图片格式
   * @param {number} [options.quality=1] - 图片质量
   * @param {string} [options.backgroundColor='white'] - 背景颜色
   * @returns {Promise<string>} 图片数据URL
   */
  async exportMap(options = {}) {
    const defaultOptions = {
      format: 'image/png',
      quality: 1,
      backgroundColor: 'white',
    }

    const exportOptions = { ...defaultOptions, ...options }

    return new Promise((resolve) => {
      this.map.once('rendercomplete', () => {
        const canvas = this.map.getTargetElement().querySelector('canvas')
        if (canvas) {
          resolve(canvas.toDataURL(exportOptions.format, exportOptions.quality))
        } else {
          resolve(null)
        }
      })

      this.map.renderSync()
    })
  }

  /**
   * 销毁地图
   */
  destroy() {
    if (this.map) {
      // 移除所有交互
      if (this.interactions && typeof this.interactions.forEach === 'function') {
        this.interactions.forEach((interaction) => {
          this.map.removeInteraction(interaction)
        })
      }

      // 移除所有覆盖物
      if (this.overlays && typeof this.overlays.forEach === 'function') {
        this.overlays.forEach((overlay) => {
          this.map.removeOverlay(overlay)
        })
      }

      // 移除所有图层
      if (this.layers && typeof this.layers.forEach === 'function') {
        this.layers.forEach((layer) => {
          this.map.removeLayer(layer)
        })
        // 清空图层Map
        if (typeof this.layers.clear === 'function') {
          this.layers.clear()
        } else {
          // 降级处理：重新创建Map对象
          this.layers = new Map()
        }
      }

      // 清理事件监听
      if (this.eventKeys && typeof this.eventKeys.forEach === 'function') {
        this.eventKeys.forEach((key) => {
          unByKey(key)
        })
      }

      // 设置为null
      this.map.setTarget(null)
      this.map = null
    }
  }
}

export default OlMap
