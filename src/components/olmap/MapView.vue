<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import OlMap, { globalState, setGlobalIconMode } from './utils/olMap.js'
import { newTownCoordinates, villageCoordinates, ploughingStation, listDevicePositionBySourceAndType, getServiceCenterPoints } from '../../api/map.js'
import { keyValueMap, getDotImg, getShangqingLevel, getNormalImg, getSelectedImg } from './utils/mapHelper.js'
import MapPopup from './popups/MapPopup.vue'
import { useMapCommandStore } from '../../stores/mapCommandStore.js'

const mapContainer = ref(null)
let olMap = null

const SHANGQING_LEVEL_KEYS = ['level01', 'level02', 'level03', 'level04', 'level05', 'level06']

const INSECT_TYPE_KEYS = [
  '40289e4f9193496e019196efc28b3055',
  '40289e4f91934dcb019196f012ed245d',
  '8aae0fcb953fd2f301953ff6e56e0003',
]

const SERVICE_CENTER_KEYS = ['nongji', 'nongshi', 'zonghe', 'jc']

const SERVICE_CENTER_TYPE_MAP = {
  1: 'nongji',
  2: 'nongshi',
  3: 'zonghe',
  4: 'jc',
}

const currentLevel = ref('province') // 'province' | 'city' | 'district' | 'town' | 'village'
const breadcrumb = ref([{ name: '江苏省', code: 320000, level: 'province' }])
const isLoading = ref(false)
const isJumping = ref(false)

const mapCmdStore = useMapCommandStore()

// 弹框
const popupRef = ref(null)
const popupState = ref({ visible: false, type: '', data: null })
let popupOverlay = null

async function showPopup(type, data, coordinate) {
  popupState.value = { visible: true, type, data }
  await nextTick()
  if (popupOverlay) {
    popupOverlay.setPosition(coordinate)
  }
}

function hidePopup() {
  popupState.value.visible = false
  if (popupOverlay) {
    popupOverlay.setPosition(undefined)
  }
  if (globalState.selectedFeature) {
    globalState.selectedFeature.state.isClicked = false
    globalState.selectedFeature.updateStyle()
    globalState.selectedFeature = null
  }
}

function refreshMarkerStyles() {
  if (!olMap) return
  const allKeys = [...SHANGQING_LEVEL_KEYS, ...INSECT_TYPE_KEYS, ...SERVICE_CENTER_KEYS]
  allKeys.forEach((key) => {
    const layer = olMap.getLayer(key)
    if (!layer) return
    layer.getSource().getFeatures().forEach((f) => {
      if (typeof f.updateStyle === 'function') {
        f.updateStyle()
      }
    })
  })
}

// 图例数据：根据 keyValueMap 生成 13 个图例项
const legendItems = ref(
  Object.entries(keyValueMap).map(([key, name]) => ({
    key,
    name,
    icon: getDotImg(key),
    visible: true,
  }))
)

const legendAllChecked = ref(true)

function updateLegendAllChecked() {
  legendAllChecked.value = legendItems.value.every((item) => item.visible)
}

// 切换图例对应图层的显示/隐藏
function toggleLegendLayer(item) {
  const layer = olMap?.getLayer(item.key)
  if (layer) {
    layer.setVisible(item.visible)
  }
  updateLegendAllChecked()
}

function toggleAllLegendLayers() {
  const visible = legendAllChecked.value
  legendItems.value.forEach((item) => {
    item.visible = visible
    const layer = olMap?.getLayer(item.key)
    if (layer) {
      layer.setVisible(visible)
    }
  })
}

// 初始化 13 个空矢量图层
function initLegendLayers() {
  if (!olMap) return
  legendItems.value.forEach((item, index) => {
    const layer = olMap.layerFactory.createVectorLayer({ zIndex: 40 + index })
    olMap.addLayer(item.key, layer)
  })
}

function clearShangqingFeatures() {
  if (!olMap) return
  SHANGQING_LEVEL_KEYS.forEach((key) => {
    const layer = olMap.getLayer(key)
    if (layer) {
      layer.getSource().clear()
    }
  })
}

async function loadShangqingPoints() {
  if (!olMap) return
  const currentRegion = breadcrumb.value[breadcrumb.value.length - 1]
  if (!currentRegion?.code) return

  const hasLayers = SHANGQING_LEVEL_KEYS.every((key) => olMap.getLayer(key))
  if (!hasLayers) return

  try {
    const res = await ploughingStation({
      growCrops: [],
      levels: [],
      online: [0, 1],
      regionCode: currentRegion.code,
    })
    if (res?.code !== 200 || !Array.isArray(res?.detailInfo)) return

    clearShangqingFeatures()

    const grouped = { level01: [], level02: [], level03: [], level04: [], level05: [], level06: [] }
    res.detailInfo.forEach((item) => {
      const lng = parseFloat(item.longitude)
      const lat = parseFloat(item.latitude)
      if (isNaN(lng) || isNaN(lat)) return
      const levelKey = getShangqingLevel(item.relativeTwenty)
      if (!grouped[levelKey]) return
      const feature = olMap.featureFactory.createMarkerFeature([lng, lat], {
        src: getDotImg(levelKey),
        properties: {
          _markerType: 'shangqing',
          defaultSrc: getNormalImg(levelKey),
          mouseDotSrc: getDotImg(levelKey),
          mouseHoverSrc: getSelectedImg(levelKey),
          mouseClickSrc: getSelectedImg(levelKey),
          ...item,
        },
      })
      grouped[levelKey].push(feature)
    })

    SHANGQING_LEVEL_KEYS.forEach((key) => {
      const layer = olMap.getLayer(key)
      if (layer && grouped[key].length > 0) {
        grouped[key].forEach((f) => layer.getSource().addFeature(f))
      }
    })
  } catch (err) {
    console.error('加载墒情点位失败:', err)
  }
}

function clearInsectFeatures() {
  if (!olMap) return
  INSECT_TYPE_KEYS.forEach((key) => {
    const layer = olMap.getLayer(key)
    if (layer) {
      layer.getSource().clear()
    }
  })
}

async function loadInsectPoints() {
  if (!olMap) return
  const currentRegion = breadcrumb.value[breadcrumb.value.length - 1]
  if (!currentRegion?.code) return

  const hasLayers = INSECT_TYPE_KEYS.every((key) => olMap.getLayer(key))
  if (!hasLayers) return

  try {
    const res = await listDevicePositionBySourceAndType({
      regionCode: currentRegion.code,
    })
    if (res?.code !== 200 || !Array.isArray(res?.detailInfo)) return

    clearInsectFeatures()

    const grouped = {
      '40289e4f9193496e019196efc28b3055': [],
      '40289e4f91934dcb019196f012ed245d': [],
      '8aae0fcb953fd2f301953ff6e56e0003': [],
    }
    res.detailInfo.forEach((item) => {
      if (!item.position) return
      const [lngStr, latStr] = item.position.split(',')
      const lng = parseFloat(lngStr)
      const lat = parseFloat(latStr)
      if (isNaN(lng) || isNaN(lat)) return
      const typeKey = item.insectType
      if (!grouped[typeKey]) return
      const feature = olMap.featureFactory.createMarkerFeature([lng, lat], {
        src: getDotImg(typeKey),
        properties: {
          _markerType: 'insect',
          defaultSrc: getNormalImg(typeKey),
          mouseDotSrc: getDotImg(typeKey),
          mouseHoverSrc: getSelectedImg(typeKey),
          mouseClickSrc: getSelectedImg(typeKey),
          ...item,
        },
      })
      grouped[typeKey].push(feature)
    })

    INSECT_TYPE_KEYS.forEach((key) => {
      const layer = olMap.getLayer(key)
      if (layer && grouped[key].length > 0) {
        grouped[key].forEach((f) => layer.getSource().addFeature(f))
      }
    })
  } catch (err) {
    console.error('加载虫情点位失败:', err)
  }
}

function clearServiceCenterFeatures() {
  if (!olMap) return
  SERVICE_CENTER_KEYS.forEach((key) => {
    const layer = olMap.getLayer(key)
    if (layer) {
      layer.getSource().clear()
    }
  })
}

async function loadServiceCenterPoints() {
  if (!olMap) return
  const currentRegion = breadcrumb.value[breadcrumb.value.length - 1]
  if (!currentRegion?.code) return

  const hasLayers = SERVICE_CENTER_KEYS.every((key) => olMap.getLayer(key))
  if (!hasLayers) return

  try {
    const res = await getServiceCenterPoints({
      adcode: currentRegion.code,
    })
    if (!res?.flag || res?.code !== '200' || !Array.isArray(res?.data)) return

    clearServiceCenterFeatures()

    const grouped = { nongji: [], nongshi: [], zonghe: [], jc: [] }
    res.data.forEach((item) => {
      const lng = parseFloat(item.lng)
      const lat = parseFloat(item.lat)
      if (isNaN(lng) || isNaN(lat)) return

      let typeKey = ''
      if (item.type === 2) {
        typeKey = 'jc'
      } else if (item.type === 1) {
        if (item.farmType === 1) {
          typeKey = 'nongji'
        } else if (item.farmType === 2) {
          typeKey = 'nongshi'
        } else if (item.farmType === 3) {
          typeKey = 'zonghe'
        }
      }
      if (!typeKey) return
      const feature = olMap.featureFactory.createMarkerFeature([lng, lat], {
        src: getNormalImg(typeKey),
        properties: {
          _markerType: 'serviceCenter',
          defaultSrc: getNormalImg(typeKey),
          mouseDotSrc: getNormalImg(typeKey),
          mouseHoverSrc: getSelectedImg(typeKey),
          mouseClickSrc: getSelectedImg(typeKey),
          ...item,
        },
      })
      grouped[typeKey].push(feature)
    })

    SERVICE_CENTER_KEYS.forEach((key) => {
      const layer = olMap.getLayer(key)
      if (layer && grouped[key].length > 0) {
        grouped[key].forEach((f) => layer.getSource().addFeature(f))
      }
    })
  } catch (err) {
    console.error('加载服务中心点位失败:', err)
  }
}

const layerTabs = ref([])
const activeLayerTab = ref('')

const LAYER_TAB_NAMES = {
  cs500: 'CS500',
  gndvi: 'GNDVI',
  lci: 'LCI',
  ndre: 'NDRE',
  ndvi: 'NDVI',
  osavi: 'OSAVI',
}

watch(currentLevel, async (newVal) => {
  if (isJumping.value) return
  const zoom = olMap?.map?.getView()?.getZoom()
  const currentRegion = breadcrumb.value[breadcrumb.value.length - 1]
  console.log(
    `currentLevel变化: ${currentLevel.value}, 地图层级: ${zoom}, 区域code: ${currentRegion?.code || '无'}, breadcrumb:`,
    breadcrumb.value
  )
  if (newVal !== 'village') {
    await Promise.all([
      loadShangqingPoints(),
      loadInsectPoints(),
      loadServiceCenterPoints(),
    ])
  }

  const isLarge = newVal === 'district' || newVal === 'town' || newVal === 'village'
  setGlobalIconMode(isLarge ? 'large' : 'small')
  refreshMarkerStyles()
}, { immediate: true })

const toastMsg = ref('')
const toastVisible = ref(false)
let toastTimer = null

function showToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

function parseLayerTabs(data) {
  const tabs = []
  for (const [key, value] of Object.entries(data)) {
    if (key === 'villageList') continue
    if (typeof value === 'string' && value.startsWith('http')) {
      tabs.push({ key, name: LAYER_TAB_NAMES[key] || key.toUpperCase(), url: value })
    }
  }
  layerTabs.value = tabs
  if (tabs.length > 0) {
    activeLayerTab.value = tabs[0].key
    loadLayerTab(tabs[0])
  } else {
    activeLayerTab.value = ''
    olMap?.removeLayer('overlayTile')
  }
}

function loadLayerTab(tab) {
  if (!olMap || !tab?.url) return
  olMap.removeLayer('overlayTile')
  const layer = olMap.layerFactory.createXYZLayer(tab.url, { zIndex: 5 })
  olMap.addLayer('overlayTile', layer)
}

function switchLayerTab(tab) {
  if (activeLayerTab.value === tab.key) return
  activeLayerTab.value = tab.key
  loadLayerTab(tab)
}

function clearLayerTabs() {
  layerTabs.value = []
  activeLayerTab.value = ''
  olMap?.removeLayer('overlayTile')
}

const BASE_URL = 'https://geo.datav.aliyun.com/areas_v3/bound'

const levelConfig = {
  country: { zoom: 4.5, center: [104.5, 36] },
  province: { zoom: 6.5 },
  city: { zoom: 8.5 },
  district: { zoom: 9.5 },
  town: { zoom: 11.5 },
  village: { zoom: 13 },
}

async function fetchGeoJSON(code) {
  const url = `${BASE_URL}/${code}_full.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`获取 ${code} 边界数据失败: ${res.status}`)
  return res.json()
}

function getFeatureCenter(feature) {
  const geom = feature.getGeometry()
  const extent = geom.getExtent()
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
}

function getFeatureExtent(feature) {
  return feature.getGeometry().getExtent()
}

function createBoundaryLayer(geojson) {
  const style = olMap.styleFactory.createStyle(
    'rgba(72, 160, 220, 0.15)',
    'rgba(72, 160, 220, 0.8)',
    1.5
  )
  const layer = olMap.layerFactory.createPolygonLayer(geojson, style, { zIndex: 10 })
  return layer
}

function createLabelLayer(features) {
  const layer = olMap.layerFactory.createVectorLayer({ zIndex: 20 })
  const source = layer.getSource()

  features.forEach((f) => {
    const center = getFeatureCenter(f)
    const name = f.get('name') || ''
    if (!name) return
    const textFeature = olMap.featureFactory.createTextFeature(center, {
      text: name,
      font: '500 12px Microsoft YaHei, sans-serif',
      fillColor: 'rgba(40, 40, 40, 0.9)',
      strokeColor: 'rgba(255,255,255,0.8)',
      strokeWidth: 3,
    })
    source.addFeature(textFeature)
  })

  return layer
}

function convertTownDataToGeoJSON(apiData) {
  if (!Array.isArray(apiData) || apiData.length === 0) return null

  const townMap = new Map()

  apiData.forEach((item) => {
    const towns = item.townCoordinates
    if (!Array.isArray(towns)) return
    towns.forEach((town) => {
      if (!town.townCode || townMap.has(town.townCode)) return
      townMap.set(town.townCode, town)
    })
  })

  const features = []
  townMap.forEach((town) => {
    const coords = town.coordinates
    if (!Array.isArray(coords) || coords.length < 3) return

    const closed = [...coords]
    const first = coords[0]
    const last = coords[coords.length - 1]
    if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
      closed.push(first)
    }

    features.push({
      type: 'Feature',
      properties: {
        name: town.town || '',
        adcode: town.townCode || '',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [closed],
      },
    })
  })

  if (features.length === 0) return null

  return {
    type: 'FeatureCollection',
    features,
  }
}

function convertVillageDataToGeoJSON(villageList) {
  if (!Array.isArray(villageList) || villageList.length === 0) return null

  const features = villageList
    .map((item) => {
      const coords = item.coordinates
      if (!Array.isArray(coords) || coords.length < 3) return null

      const closed = [...coords]
      const first = coords[0]
      const last = coords[coords.length - 1]
      if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
        closed.push(first)
      }

      return {
        type: 'Feature',
        properties: {
          name: item.village || '',
          adcode: item.townCode || '',
          userName: item.userName || '',
          typeName: item.typeName || '',
          area: item.area ?? 0,
          num: item.num ?? '',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [closed],
        },
      }
    })
    .filter(Boolean)

  if (features.length === 0) return null

  return {
    type: 'FeatureCollection',
    features,
  }
}

async function loadLevel(code, name, level) {
  isLoading.value = true
  try {
    const geojson = await fetchGeoJSON(code)

    olMap.removeLayer('boundary')
    olMap.removeLayer('labels')

    const boundaryLayer = createBoundaryLayer(geojson)
    olMap.addLayer('boundary', boundaryLayer)

    const features = boundaryLayer.getSource().getFeatures()
    const labelLayer = createLabelLayer(features)
    olMap.addLayer('labels', labelLayer)

    if (features.length > 0) {
      let extent = null
      features.forEach((f) => {
        const fe = getFeatureExtent(f)
        if (!extent) {
          extent = fe
        } else {
          extent = [
            Math.min(extent[0], fe[0]),
            Math.min(extent[1], fe[1]),
            Math.max(extent[2], fe[2]),
            Math.max(extent[3], fe[3]),
          ]
        }
      })
      if (extent) {
        olMap.flyToExtent(extent, { duration: 800 })
      }
    }

    currentLevel.value = level
  } catch (err) {
    console.error('加载地图数据失败:', err)
  } finally {
    isLoading.value = false
  }
}

async function loadTownLayer(adcode, name, apiData) {
  isLoading.value = true
  try {
    const geojson = convertTownDataToGeoJSON(apiData)
    if (!geojson) {
      console.warn('乡镇数据转换为空，不切换视图')
      return
    }

    olMap.removeLayer('boundary')
    olMap.removeLayer('labels')

    const boundaryLayer = createBoundaryLayer(geojson)
    olMap.addLayer('boundary', boundaryLayer)

    const features = boundaryLayer.getSource().getFeatures()
    const labelLayer = createLabelLayer(features)
    olMap.addLayer('labels', labelLayer)

    if (features.length > 0) {
      let extent = null
      features.forEach((f) => {
        const fe = getFeatureExtent(f)
        if (!extent) {
          extent = fe
        } else {
          extent = [
            Math.min(extent[0], fe[0]),
            Math.min(extent[1], fe[1]),
            Math.max(extent[2], fe[2]),
            Math.max(extent[3], fe[3]),
          ]
        }
      })
      if (extent) {
        olMap.flyToExtent(extent, { duration: 800 })
      }
    }

    currentLevel.value = 'district'
  } catch (err) {
    console.error('加载乡镇数据失败:', err)
  } finally {
    isLoading.value = false
  }
}

async function loadVillageLayer(adcode, name, villageList) {
  isLoading.value = true
  try {
    const geojson = convertVillageDataToGeoJSON(villageList)
    if (!geojson) {
      console.warn('地块数据转换为空，不切换视图')
      return
    }

    olMap.removeLayer('boundary')
    olMap.removeLayer('labels')

    const boundaryLayer = createBoundaryLayer(geojson)
    olMap.addLayer('boundary', boundaryLayer)

    const features = boundaryLayer.getSource().getFeatures()
    // const labelLayer = createLabelLayer(features)
    // olMap.addLayer('labels', labelLayer)

    if (features.length > 0) {
      let extent = null
      features.forEach((f) => {
        const fe = getFeatureExtent(f)
        if (!extent) {
          extent = fe
        } else {
          extent = [
            Math.min(extent[0], fe[0]),
            Math.min(extent[1], fe[1]),
            Math.max(extent[2], fe[2]),
            Math.max(extent[3], fe[3]),
          ]
        }
      })
      if (extent) {
        olMap.flyToExtent(extent, { duration: 800 })
      }
    }

    currentLevel.value = 'town'
  } catch (err) {
    console.error('加载地块数据失败:', err)
  } finally {
    isLoading.value = false
  }
}

async function drillDown(feature) {
  const name = feature.get('name')
  const adcode = feature.get('adcode')
  if (!adcode) return

  // town 级别：点击地块显示详情弹窗，不再下钻
  if (currentLevel.value === 'town') {
    const props = feature.getProperties()
    showPopup('plot', props, getFeatureCenter(feature))
    return
  }

  // district 级别：调用 villageCoordinates 获取地块数据
  if (currentLevel.value === 'district') {
    try {
      const res = await villageCoordinates({ townCode: adcode })
      if (res?.flag && Array.isArray(res.data.villageList) && res.data.villageList.length > 0) {
        breadcrumb.value.push({ name, code: adcode, level: 'town', villageApiData: res.data.villageList })
        parseLayerTabs(res.data)
        await loadVillageLayer(adcode, name, res.data.villageList)
        return
      }
      showToast('没有地块数据')
    } catch (err) {
      console.warn('villageCoordinates 接口调用失败或无数据:', err)
      showToast('没有地块数据')
    }
    return
  }

  // city 级别：调用 newTownCoordinates 获取乡镇数据
  if (currentLevel.value === 'city') {
    try {
      const res = await newTownCoordinates({ adcode: adcode.toString().replace(/0+$/, '') })
      if (res?.flag && Array.isArray(res.data) && res.data.length > 0) {
        clearLayerTabs()
        breadcrumb.value.push({ name, code: adcode, level: 'district', townApiData: res.data })
        await loadTownLayer(adcode, name, res.data)
        return
      }
      showToast('没有乡镇/街道数据')
    } catch (err) {
      console.warn('newTownCoordinates 接口调用失败或无数据:', err)
      showToast('没有乡镇/街道数据')
    }
    return
  }

  // 确定下一级（country→province→city）
  const levelMap = { province: 'city' }
  const nextLevel = levelMap[currentLevel.value]
  if (!nextLevel) return

  clearLayerTabs()
  breadcrumb.value.push({ name, code: adcode, level: nextLevel })

  await loadLevel(adcode, name, nextLevel)
}

async function drillUp(index) {
  if (index < 0 || index >= breadcrumb.value.length - 1) return
  const item = breadcrumb.value[index]
  breadcrumb.value = breadcrumb.value.slice(0, index + 1)

  if (item.level !== 'town') {
    clearLayerTabs()
  }

  if (item.level === 'town' && item.villageApiData) {
    await loadVillageLayer(item.code, item.name, item.villageApiData)
    return
  }

  if (item.level === 'district' && item.townApiData) {
    await loadTownLayer(item.code, item.name, item.townApiData)
    return
  }

  await loadLevel(item.code, item.name, item.level)
}

// ===== AI 指令：path 加载失败时回退到 breadcrumb 最后一级 =====
async function fallbackToLastLevel() {
  if (breadcrumb.value.length === 0) return
  const parentIndex = breadcrumb.value.length - 1
  const parentItem = breadcrumb.value[parentIndex]

  if (parentItem.level !== 'town') {
    clearLayerTabs()
  }

  if (parentItem.level === 'town' && parentItem.villageApiData) {
    await loadVillageLayer(parentItem.code, parentItem.name, parentItem.villageApiData)
    return
  }

  if (parentItem.level === 'district' && parentItem.townApiData) {
    await loadTownLayer(parentItem.code, parentItem.name, parentItem.townApiData)
    return
  }

  await loadLevel(parentItem.code, parentItem.name, parentItem.level)
}

// ===== AI 指令：跳级加载完整路径 =====
async function loadPath(path) {
  isJumping.value = true
  try {
    clearLayerTabs()
    olMap?.removeLayer('boundary')
    olMap?.removeLayer('labels')
    breadcrumb.value = []

    for (let i = 0; i < path.length; i++) {
      const { code, level, name } = path[i]

      if (level === 'province' || level === 'city') {
        await loadLevel(code, name, level)
        breadcrumb.value.push({ name, code, level })
      } else if (level === 'district') {
        const res = await newTownCoordinates({ adcode: code.toString().replace(/0+$/, '') })
        if (res?.flag && Array.isArray(res.data) && res.data.length > 0) {
          breadcrumb.value.push({ name, code, level, townApiData: res.data })
          await loadTownLayer(code, name, res.data)
        } else {
          await fallbackToLastLevel()
          return
        }
      } else if (level === 'town') {
        const res = await villageCoordinates({ townCode: code })
        if (res?.flag && Array.isArray(res.data?.villageList) && res.data.villageList.length > 0) {
          breadcrumb.value.push({ name, code, level, villageApiData: res.data.villageList })
          parseLayerTabs(res.data)
          await loadVillageLayer(code, name, res.data.villageList)
        } else {
          await fallbackToLastLevel()
          return
        }
      } else if (level === 'village') {
        // village 级别不加载新边界，仅做 breadcrumb 标记
        breadcrumb.value.push({ name, code, level })
      }
    }
  } catch (err) {
    console.error('loadPath 执行失败:', err)
  } finally {
    isJumping.value = false
    if (currentLevel.value !== 'village') {
      await Promise.all([
        loadShangqingPoints(),
        loadInsectPoints(),
        loadServiceCenterPoints(),
      ])
    }
    refreshMarkerStyles()
  }
}

// ===== AI 指令：按名称搜索 marker feature =====
function findMarkerFeature(query) {
  if (!olMap || !query?.name) return null

  const allKeys = [...SHANGQING_LEVEL_KEYS, ...INSECT_TYPE_KEYS, ...SERVICE_CENTER_KEYS]
  const searchName = String(query.name).toLowerCase()

  for (const key of allKeys) {
    const layer = olMap.getLayer(key)
    if (!layer) continue

    const features = layer.getSource().getFeatures()
    const target = features.find((f) => {
      const props = f.getProperties()
      const nameFields = [
        props.name,
        props.userName,
        props.deviceName,
        props.stationName,
        props.town,
        props.village,
      ]
      return nameFields.some((n) => n && String(n).toLowerCase().includes(searchName))
    })

    if (target) return target
  }
  return null
}

// ===== AI 指令：统一入口 =====
async function executeCommand(cmd) {
  if (!cmd || !cmd.action) return

  switch (cmd.action) {
    case 'drillDown': {
      if (cmd.path && cmd.path.length > 0) {
        await loadPath(cmd.path)
      }
      break
    }
    case 'drillUp': {
      if (cmd.path && cmd.path.length > 0) {
        const target = cmd.path[cmd.path.length - 1]
        const index = breadcrumb.value.findIndex((b) => String(b.code) === String(target.code))
        if (index >= 0 && index < breadcrumb.value.length - 1) {
          await drillUp(index)
        } else if (cmd.path.length > 0) {
          await loadPath(cmd.path)
        }
      }
      break
    }
    case 'showPopup': {
      if (cmd.query) {
        const feature = findMarkerFeature(cmd.query)
        if (feature) {
          const markerType = feature.get('_markerType')
          const props = feature.getProperties()
          const coordinate = feature.getGeometry().getCoordinates()
          showPopup(markerType, props, coordinate)
          olMap?.map?.getView()?.animate({ center: coordinate, duration: 500 })
        } else {
          showToast('未找到指定点位')
        }
      }
      break
    }
    default:
      console.warn('未知地图命令:', cmd.action)
  }
}

let hoveredFeature = null

function handlePointerMove(event) {
  let cursorPointer = false
  const boundaryLayer = olMap.getLayer('boundary')

  if (boundaryLayer) {
    const features = []
    olMap.map.forEachFeatureAtPixel(
      event.pixel,
      (feature) => {
        features.push(feature)
      },
      { layerFilter: (layer) => layer === boundaryLayer, hitTolerance: 6 }
    )

    const polygonFeature = features.find((f) => {
      const type = f.getGeometry()?.getType()
      return (type === 'Polygon' || type === 'MultiPolygon') && f.get('adcode')
    })

    if (polygonFeature) {
      cursorPointer = true
      if (hoveredFeature !== polygonFeature) {
        olMap.clearHighlight()
        olMap.highlightFeature(polygonFeature, {
          strokeColor: 'rgba(255, 165, 0, 1)',
          fillColor: 'rgba(255, 200, 80, 0.35)',
          strokeWidth: 3,
        })
        hoveredFeature = polygonFeature
      }
    } else {
      if (hoveredFeature) {
        olMap.clearHighlight()
        hoveredFeature = null
      }
    }
  }

  const markerFeature = olMap.map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      const geomType = feature.getGeometry()?.getType()
      if (geomType === 'Point' && typeof feature.mouseIn === 'function') {
        return feature
      }
    },
    { hitTolerance: 10 }
  )

  if (markerFeature) {
    cursorPointer = true
    markerFeature.mouseIn()
  } else if (globalState.hoveredFeature && typeof globalState.hoveredFeature.mouseOut === 'function') {
    globalState.hoveredFeature.mouseOut()
    globalState.hoveredFeature = null
  }

  if (olMap?.map?.getTargetElement()) {
    olMap.map.getTargetElement().style.cursor = cursorPointer ? 'pointer' : ''
  }
}

function handleFeatureClick({ event, features }) {
  // 优先检测 marker 点击
  const markerFeature = features?.find((f) => {
    const type = f.getGeometry()?.getType()
    return type === 'Point' && typeof f.mouseClick === 'function'
  })

  if (markerFeature) {
    markerFeature.mouseClick()
    const markerType = markerFeature.get('_markerType')
    const props = markerFeature.getProperties()
    const coordinate = markerFeature.getGeometry().getCoordinates()
    if (markerType) {
      showPopup(markerType, props, coordinate)
    }
    return
  }

  // 再检测 polygon 点击
  const polygonFeature = features?.find((f) => {
    const type = f.getGeometry()?.getType()
    return type === 'Polygon' || type === 'MultiPolygon'
  })

  if (polygonFeature) {
    const adcode = polygonFeature.get('adcode')
    if (!adcode) return
    if (currentLevel.value === 'town') {
      const props = polygonFeature.getProperties()
      showPopup('plot', props, getFeatureCenter(polygonFeature))
      return
    }
    drillDown(polygonFeature)
  }
}

let pointerMoveKey = null
let prevZoom = null

onMounted(async () => {
  if (!mapContainer.value) return

  olMap = new OlMap(mapContainer.value, {
    center: levelConfig.country.center,
    zoom: levelConfig.country.zoom,
    controls: { zoom: false, rotate: false, attribution: false, zoomSlider: false, scaleLine: false },
  })

  prevZoom = olMap.map.getView().getZoom()

  // 直接绑定 OpenLayers 原生 pointermove，设置 layerFilter 和 hitTolerance
  pointerMoveKey = olMap.map.on('pointermove', handlePointerMove)
  olMap.on('featureClick', handleFeatureClick)

  await loadLevel(320000, '江苏省', 'province')

  // 初始化图例对应的 13 个空矢量图层
  initLegendLayers()

  // 加载墒情点位（首次）
  loadShangqingPoints()
  // 加载虫情点位（首次）
  loadInsectPoints()
  // 加载服务中心点位（首次）
  loadServiceCenterPoints()

  // 初始化弹框 overlay
  if (popupRef.value) {
    popupOverlay = olMap.createOverlay({
      element: popupRef.value,
      positioning: 'bottom-center',
      stopEvent: true,
      autoPan: true,
      autoPanMargin: 80,
    })
    olMap.addOverlay('popup', popupOverlay)
  }

  // 监听 AI 地图指令（处理挂载后到达的命令）
  const unwatchCmd = watch(() => mapCmdStore.pending, async (cmd) => {
    if (!cmd) return
    await executeCommand(cmd)
    mapCmdStore.pending = null
  })

  // 处理挂载前已到达的命令（AI 先输出 add-grid-map 紧接着 map-action 时）
  if (mapCmdStore.pending) {
    await executeCommand(mapCmdStore.pending)
    mapCmdStore.pending = null
  }

  // 保存 unwatch 引用用于卸载清理
  olMap._unwatchCmd = unwatchCmd

})

onUnmounted(() => {
  if (pointerMoveKey && olMap?.map) {
    olMap.map.un('pointermove', handlePointerMove)
  }
  olMap?._unwatchCmd?.()
  olMap?.destroy()
  olMap = null
})

defineExpose({
  getMap: () => olMap,
  executeCommand,
})
</script>

<template>
  <div class="map-view-wrapper">
    <div ref="mapContainer" class="map-view"></div>

    <!-- 面包屑导航 -->
    <div class="map-breadcrumb">
      <span
        v-for="(item, index) in breadcrumb"
        :key="item.code"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumb.length - 1 }"
        @click="drillUp(index)"
      >
        {{ item.name }}
        <span v-if="index < breadcrumb.length - 1" class="breadcrumb-separator">&gt;</span>
      </span>
    </div>

    <!-- 层级提示 -->
    <!-- <div class="map-level-badge">
      {{ { province: '省级', city: '市级', town: '乡镇级', village: '地块级' }[currentLevel] }}
    </div> -->

    <!-- 提示信息 -->
    <div v-if="toastVisible" class="map-toast">{{ toastMsg }}</div>

    <!-- 图层切换按钮 -->
    <div v-if="layerTabs.length > 0" class="map-layer-tabs">
      <button
        v-for="tab in layerTabs"
        :key="tab.key"
        class="layer-tab-btn"
        :class="{ active: activeLayerTab === tab.key }"
        @click="switchLayerTab(tab)"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 加载指示器 -->
    <div v-if="isLoading" class="map-loading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 图例面板 -->
    <div class="map-legend">
      <label class="legend-title legend-all">
        <input
          v-model="legendAllChecked"
          type="checkbox"
          class="legend-checkbox"
          @change="toggleAllLegendLayers"
        />
        <span>图例（全选）</span>
      </label>
      <div class="legend-list">
        <label
          v-for="item in legendItems"
          :key="item.key"
          class="legend-item"
        >
          <input
            v-model="item.visible"
            type="checkbox"
            class="legend-checkbox"
            @change="toggleLegendLayer(item)"
          />
          <img
            v-if="item.icon"
            :src="item.icon"
            class="legend-icon"
            alt=""
          />
          <span class="legend-name">{{ item.name }}</span>
        </label>
      </div>
    </div>

    <!-- 地图弹框 -->
    <div ref="popupRef">
      <MapPopup
        :type="popupState.type"
        :data="popupState.data"
        v-show="popupState.visible"
        @close="hidePopup"
      />
    </div>
  </div>
</template>

<style scoped>
.map-view-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.map-view {
  width: 100%;
  height: 100%;
}

/* 面包屑导航 */
.map-breadcrumb {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.breadcrumb-item {
  cursor: pointer;
  color: var(--text-muted, #666);
  transition: color 0.2s;
  user-select: none;
}

.breadcrumb-item:not(.active):hover {
  color: var(--accent, #2563eb);
}

.breadcrumb-item.active {
  color: var(--text, #1a1a1a);
  font-weight: 600;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 2px;
  color: var(--text-muted, #999);
  font-size: 11px;
}

/* 层级徽章 */
/* .map-level-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  background: rgba(72, 160, 220, 0.9);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  user-select: none;
} */

/* 提示信息 */
.map-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 110;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 6px;
  pointer-events: none;
  animation: fadeInOut 2.5s ease-in-out forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translate(-50%, -40%); }
  15% { opacity: 1; transform: translate(-50%, -50%); }
  85% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -60%); }
}

/* 加载指示器 */
.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  color: var(--text-muted, #666);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(72, 160, 220, 0.2);
  border-top-color: rgba(72, 160, 220, 1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 图层切换按钮 */
.map-layer-tabs {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.layer-tab-btn {
  padding: 5px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-muted, #666);
  transition: all 0.2s;
  white-space: nowrap;
  user-select: none;
}

.layer-tab-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.layer-tab-btn.active {
  background: rgba(72, 160, 220, 0.9);
  color: #fff;
}

/* 图例面板 */
.map-legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 14px;
  max-height: 320px;
  overflow-y: auto;
  min-width: 200px;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text, #1a1a1a);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.legend-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-muted, #555);
  user-select: none;
  transition: color 0.2s;
}

.legend-item:hover {
  color: var(--text, #1a1a1a);
}

.legend-checkbox {
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.legend-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
}

.legend-name {
  line-height: 1.3;
}
</style>
