const getDotImg = (type) => {
  switch (type) {
    case 'level01':
      return new URL('../../../assets/map/icon-dot-small-1.png', import.meta.url).href
    case 'level02':
      return new URL('../../../assets/map/icon-dot-small-2.png', import.meta.url).href
    case 'level03':
      return new URL('../../../assets/map/icon-dot-small-3.png', import.meta.url).href
    case 'level04':
      return new URL('../../../assets/map/icon-dot-small-4.png', import.meta.url).href
    case 'level05':
      return new URL('../../../assets/map/icon-dot-small-5.png', import.meta.url).href
    case 'level06':
      return new URL('../../../assets/map/icon-dot-small-6.png', import.meta.url).href
    case '40289e4f9193496e019196efc28b3055': // 智能性诱监测设备
      return new URL('../../../assets/map/icon-dot-small-7.png', import.meta.url).href
    case '40289e4f91934dcb019196f012ed245d': // 物联网虫情测报灯
      return new URL('../../../assets/map/icon-dot-small-8.png', import.meta.url).href
    case '8aae0fcb953fd2f301953ff6e56e0003': // 流行性病害检测仪
      return new URL('../../../assets/map/icon-dot-small-9.png', import.meta.url).href
    case 'nongji':
      return new URL('../../../assets/map/icon-dot-nongji.png', import.meta.url).href
    case 'nongshi':
      return new URL('../../../assets/map/icon-dot-nongshi.png', import.meta.url).href
    case 'zonghe':
      return new URL('../../../assets/map/icon-dot-zonghe.png', import.meta.url).href
    case 'jc':
      return new URL('../../../assets/map/icon-dot-wurenji.png', import.meta.url).href
    default:
      return ''
  }
}

const getNormalImg = (type) => {
  switch (type) {
    case 'level01':
      return new URL('../../../assets/map/icon-level01.png', import.meta.url).href
    case 'level02':
      return new URL('../../../assets/map/icon-level02.png', import.meta.url).href
    case 'level03':
      return new URL('../../../assets/map/icon-level03.png', import.meta.url).href
    case 'level04':
      return new URL('../../../assets/map/icon-level04.png', import.meta.url).href
    case 'level05':
      return new URL('../../../assets/map/icon-level05.png', import.meta.url).href
    case 'level06':
      return new URL('../../../assets/map/icon-level06.png', import.meta.url).href
    case '40289e4f9193496e019196efc28b3055': // 智能性诱监测设备
      return new URL('../../../assets/map/icon-device.png', import.meta.url).href
    case '40289e4f91934dcb019196f012ed245d': // 物联网虫情测报灯
      return new URL('../../../assets/map/icon-testLight.png', import.meta.url).href
    case '8aae0fcb953fd2f301953ff6e56e0003': // 流行性病害检测仪
      return new URL('../../../assets/map/icon-detector.png', import.meta.url).href
    case 'nongji':
      return new URL('../../../assets/map/nongji_0.png', import.meta.url).href
    case 'nongshi':
      return new URL('../../../assets/map/nongshi_0.png', import.meta.url).href
    case 'zonghe':
      return new URL('../../../assets/map/zonghe_0.png', import.meta.url).href
    case 'jc':
      return new URL('../../../assets/map/wurenji_0.png', import.meta.url).href
    default:
      return ''
  }
}

const getSelectedImg = (type) => {
  switch (type) {
    case 'level01':
      return new URL('../../../assets/map/icon-level01-select.png', import.meta.url)
        .href
    case 'level02':
      return new URL('../../../assets/map/icon-level02-select.png', import.meta.url)
        .href
    case 'level03':
      return new URL('../../../assets/map/icon-level03-select.png', import.meta.url)
        .href
    case 'level04':
      return new URL('../../../assets/map/icon-level04-select.png', import.meta.url)
        .href
    case 'level05':
      return new URL('../../../assets/map/icon-level05-select.png', import.meta.url)
        .href
    case 'level06':
      return new URL('../../../assets/map/icon-level06-select.png', import.meta.url)
        .href
    case '40289e4f9193496e019196efc28b3055': // 智能性诱监测设备
      return new URL('../../../assets/map/icon-device-select.png', import.meta.url).href
    case '40289e4f91934dcb019196f012ed245d': // 物联网虫情测报灯
      return new URL('../../../assets/map/icon-testLight-select.png', import.meta.url).href
    case '8aae0fcb953fd2f301953ff6e56e0003': // 流行性病害检测仪
      return new URL('../../../assets/map/icon-detector-select.png', import.meta.url).href
    case 'nongji':
      return new URL('../../../assets/map/nongji_1.png', import.meta.url).href
    case 'nongshi':
      return new URL('../../../assets/map/nongshi_1.png', import.meta.url).href
    case 'zonghe':
      return new URL('../../../assets/map/zonghe_1.png', import.meta.url).href
    case 'jc':
      return new URL('../../../assets/map/wurenji_1.png', import.meta.url).href
    default:
      return ''
  }
}

const getShangqingLevel = (relativeTwenty) => {
  if (relativeTwenty >= 150) return 'level01' // 渍涝
  if (relativeTwenty >= 90) return 'level02' // 过湿
  if (relativeTwenty >= 70) return 'level03' // 适宜
  if (relativeTwenty >= 60) return 'level04' // 轻旱
  if (relativeTwenty >= 50) return 'level05' // 中旱
  if (relativeTwenty >= 40) return 'level06' // 重旱
  return 'level06' // 默认重旱
}

const serviceCenterType = (type) => {
  switch (type) {
    case 1:
      return 'nongji'
    case 2:
      return 'nongshi'
    case 3:
      return 'zonghe'
    case 4:
      return 'jc'
    default:
      return ''
  }
}

const keyValueMap = {
  "nongji": '区域性综合服务中心（农技）',
  "nongshi": '区域性综合服务中心（农事）',
  "zonghe": '区域性综合服务中心（综合）',
  "jc": '无人机场',
  "level01": '渍涝（SRWC>=150%）',
  "level02": '过湿（90%<=SRWC<150%）',
  "level03": '适宜（70%<=SRWC<90%）',
  "level04": '轻旱（60%<=SRWC<70%）',
  "level05": '中旱（50%<=SRWC<60%）',
  "level06": '重旱（40%<=SRWC<50%）',
  '40289e4f9193496e019196efc28b3055': '智能性诱监测设备',
  '40289e4f91934dcb019196f012ed245d': '物联网虫情测报灯',
  '8aae0fcb953fd2f301953ff6e56e0003': '流行性病害检测仪',
}

export {
  getDotImg,
  getNormalImg,
  getSelectedImg,
  getShangqingLevel,
  serviceCenterType,
  keyValueMap,
}
