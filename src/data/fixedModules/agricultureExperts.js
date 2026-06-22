/**
 * 固定模块：农技专家名片列表
 * 复用设计图布局，颜色使用当前主题 token
 */

const CITIES = [
  '南京市',
  '镇江市',
  '盐城市',
  '苏州市',
  '无锡市',
  '常州市',
  '扬州市',
  '泰州市',
  '淮安市',
  '宿迁市',
  '徐州市',
  '连云港市',
  '南通市',
]

const FIRST_NAMES = [
  '王', '李', '张', '刘', '陈', '杨', '赵', '黄',
]

const LAST_NAMES = [
  '敦强', '凤娇', '伟', '敏', '建军', '芳', '强', '丽',
  '磊', '静', '洋', '艳', '勇', '杰', '娟', '涛',
]

const TITLES = ['农艺师', '高级农艺师', '助理农艺师']

const SPECIALTIES = [
  '植保', '园艺', '土壤肥料', '植物保护', '果树栽培',
  '蔬菜园艺', '粮油作物', '农业生态', '农机推广', '水产养殖',
]

function createExpert(index, cityIndex) {
  const name = `${FIRST_NAMES[index % FIRST_NAMES.length]}${LAST_NAMES[(index + cityIndex) % LAST_NAMES.length]}`
  return {
    name,
    title: TITLES[index % TITLES.length],
    specialty: SPECIALTIES[(index + cityIndex) % SPECIALTIES.length],
    avatar: '',
    phone: `13800${String(cityIndex).padStart(2, '0')}${String(index + 1).padStart(3, '0')}`,
  }
}

const detailGroups = CITIES.map((city, cityIndex) => ({
  region: city,
  experts: Array.from({ length: 8 }, (_, i) => createExpert(i, cityIndex)),
}))

const previewExperts = detailGroups[9].experts.slice(0, 8)

export const agricultureExpertsModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-experts',
  layout: {
    x: 0,
    y: 0,
    w: 24,
    h: 16,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '农技专家',
  },
  style: {
    background: 'var(--surface)',
    borderRadius: '12px',
  },
  runtime: {
    visible: true,
    zIndex: 1,
    loading: false,
    data: null,
  },
  children: [
    {
      stableKey: 'AgricultureExpertList',
      instanceId: 'fixed-agriculture-experts-1',
      parentInstanceId: 'fixed-agriculture-experts',
      props: {
        detailTitle: '各市农服中心概况',
        detailGroups,
        detailPageSize: 21,
        experts: previewExperts,
        pageSize: 2,
      },
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}
