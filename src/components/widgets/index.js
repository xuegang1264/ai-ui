import Chart from './Chart.vue'
import ElTable from './element-plus/ElTable.vue'
import ElCard from './element-plus/ElCard.vue'
import ElForm from './element-plus/ElForm.vue'
import FilterBar from './element-plus/FilterBar.vue'
import MapView from '../olmap/MapView.vue'
import KvLayout from './KeyValue.vue'
import LayoutNode from './layoutNode.vue'
import TextView from './TextView.vue'

// 这里的节点组件是固定的，不能随意删除或修改
import AgricultureExpertList from '../fixed/AgricultureExpertList.vue'
import AgricultureDroneList from '../fixed/AgricultureDroneList.vue'


export const widgetMap = {
  Chart,
  ElTable,
  ElCard,
  ElForm,
  Map: MapView,
  MapView,
  KvLayout,
  LayoutNode,
  AgricultureExpertList,
  AgricultureDroneList,
  TextView,
  FilterBar,
}
