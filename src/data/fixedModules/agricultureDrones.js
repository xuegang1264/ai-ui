/**
 * 农业固定模块集合：
 * - 无人机调度列表
 * - 各地块产量估算统计
 * - 最新巡飞产量预估结果
 * - 农情分析报告基本情况
 * - 巡飞结果管理建议
 *
 * 其中文本类模块统一使用 TextView.vue，表格类模块统一使用 ElTable.vue，
 * 不再为每个模块单独开发定制组件。
 */

/**
 * 固定模块：无人机调度列表
 */
export const agricultureDroneListModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-drone-list',
  layout: {
    x: 0,
    y: 0,
    w: 13,
    h: 67,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '无人机调度',
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
      stableKey: 'AgricultureDroneList',
      instanceId: 'fixed-agriculture-drone-list-1',
      parentInstanceId: 'fixed-agriculture-drone-list',
      props: {},
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}

/**
 * 固定模块：各地块产量估算统计情况
 */
export const agricultureYieldStatsModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-yield-stats',
  layout: {
    "x": 47,
    "y": 0,
    "w": 13,
    "h": 66,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '各地块产量估算统计情况',
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
      stableKey: 'ElTable',
      instanceId: 'fixed-agriculture-yield-stats-1',
      parentInstanceId: 'fixed-agriculture-yield-stats',
      props: {
        data: [
          { plotId: 'W-1', area: '13.12', yield: '400-450' },
          { plotId: 'W-2', area: '7.83', yield: '400-450' },
          { plotId: 'W-3', area: '8.83', yield: '400-450' },
          { plotId: 'W-4', area: '10.67', yield: '400-450' },
          { plotId: 'W-5', area: '13.58', yield: '400-450' },
          { plotId: 'W-6', area: '19.44', yield: '400-450' },
          { plotId: 'W-7', area: '17.32', yield: '400-450' },
          { plotId: 'W-8', area: '9.36', yield: '400-450' },
          { plotId: 'W-9', area: '2.73', yield: '350-400' },
          { plotId: 'W-10', area: '8.20', yield: '400-450' },
          { plotId: 'W-11', area: '1.12', yield: '350-400' },
          { plotId: 'W-12', area: '1.54', yield: '400-450' },
          { plotId: 'W-13', area: '0.78', yield: '350-400' },
          { plotId: 'W-14', area: '13.74', yield: '400-450' },
        ],
        columns: [
          { prop: 'plotId', label: '地块编号', width: 100 },
          { prop: 'area', label: '地块面积(亩)', width: 120 },
          { prop: 'yield', label: '单产水平(kg/亩)', minWidth: 140 },
        ],
        size: 'small',
        stripe: true,
      },
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}

/**
 * 固定模块：最新巡飞产量预估结果
 */
export const agricultureFlightEstimateModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-flight-estimate',
  layout: {
    "x": 0,
    "y": 67,
    "w": 13,
    "h": 33,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '最新巡飞产量预估结果',
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
      stableKey: 'TextView',
      instanceId: 'fixed-agriculture-flight-estimate-1',
      parentInstanceId: 'fixed-agriculture-flight-estimate',
      props: {
        format: 'rich',
        align: 'left',
        size: 'normal',
        content: `<p>常熟市古里镇白茆区域性农业服务中心支塘 + 古里片区，本次小麦种植区域为机场覆盖范围，<strong style="color:#F7D147">监测面积 3928.59 亩</strong>，当前已进入灌浆中后期产量形成关键阶段。</p>
<p>从片区苗情来看，航拍显示田块规整、水系配套完善，小麦整体长势均衡向好。基于多光谱遥感估产模型分析，片区小麦<strong style="color:#F7D147">平均亩产可达 400-450 公斤</strong>，其中：>400kg/亩占比 <strong style="color:#F7D147">15.07%</strong>、300-400kg/亩占比 <strong style="color:#F7D147">40.93%</strong>、200-300kg/亩占比 <strong style="color:#F7D147">36.30%</strong>、&lt;200kg/亩占比 <strong style="color:#F7D147">7.70%</strong>。</p>`,
      },
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}

/**
 * 固定模块：农情分析报告基本情况
 */
export const agricultureReportBasicModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-report-basic',
  layout: {
    "x": 47,
    "y": 66,
    "w": 13,
    "h": 34,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '农情分析报告基本情况',
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
      stableKey: 'KvLayout',
      instanceId: 'fixed-agriculture-report-basic-1',
      parentInstanceId: 'fixed-agriculture-report-basic',
      props: {
        direction: 'column',
        textDirection: 'row',
        items: [
          { label: '机场归属', value: '常熟市古里镇白茆机场' },
          { label: '巡田时间', value: '2026/05/16' },
          { label: '监测作物', value: '小麦' },
          { label: '农情类型', value: '产量估算' },
          { label: '监测面积', value: '3928.59', unit: '亩' },
        ],
      },
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}

/**
 * 固定模块：巡飞结果管理建议
 */
export const agricultureFlightAdviceModule = {
  stableKey: 'grid-item',
  instanceId: 'fixed-agriculture-flight-advice',
  layout: {
    "x": 13,
    "y": 74,
    "w": 34,
    "h": 26,
    draggable: true,
    resizable: true,
  },
  props: {
    title: '巡飞结果管理建议',
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
      stableKey: 'TextView',
      instanceId: 'fixed-agriculture-flight-advice-1',
      parentInstanceId: 'fixed-agriculture-flight-advice',
      props: {
        format: 'rich',
        align: 'left',
        size: 'normal',
        content: `<p>结合常熟市近期天气及片区小麦成熟进度，当前小麦处于灌浆中后期，预计 <strong style="color:#F7D147">5 月 27 日</strong>前后进入蜡熟末期（九成熟），达到机收最佳状态。受 <strong style="color:#F7D147">5 月 19-23 日、25 日</strong>阵性降水影响，土壤墒情偏大，低洼田块需提前做好排水降湿，待雨停后晾晒 <strong style="color:#F7D147">2-3 天</strong>，确保机械下地条件。</p>
<p>最佳收割窗口期锁定 <strong style="color:#F7D147">5 月 28 日至 6 月 5 日</strong>，需调配 <strong style="color:#F7D147">8-10 台</strong>联合收割机集中抢收；优先收割地势高、成熟度均匀的田块，再推进低洼地块；作业时段避开早晚露水，以上午 9 点至下午 6 点为主，同步配置烘干设备，防止籽粒受潮霉变，预计 <strong style="color:#F7D147">6 月 5 日</strong>前可完成全部 <strong style="color:#F7D147">3928.59 亩</strong>小麦收割，抢在 6 月上旬连阴雨来临前实现颗粒归仓，同时做好已收小麦的烘干、转运与仓储管理，防范穗发芽和品质下降风险。</p>`,
      },
      style: {
        flex: 1,
      },
    },
  ],
  direction: 'row',
}
