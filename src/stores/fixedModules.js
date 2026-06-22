// 固定模块仓库：预置的、不可由用户编辑的模块模板
// 如需新增固定模块，把配置文件 import 进来并加入 fixedModules 数组

import { demoStatTrendModule } from '../data/fixedModules/demoStatTrend.js'
import { agricultureExpertsModule } from '../data/fixedModules/agricultureExperts.js'
import {
  agricultureDroneListModule,
  agricultureYieldStatsModule,
  agricultureFlightEstimateModule,
  agricultureReportBasicModule,
  agricultureFlightAdviceModule,
} from '../data/fixedModules/agricultureDrones.js'

export const fixedModules = [
  demoStatTrendModule,
  agricultureExpertsModule,
  agricultureDroneListModule,
  agricultureYieldStatsModule,
  agricultureFlightEstimateModule,
  agricultureReportBasicModule,
  agricultureFlightAdviceModule,
]

export function getFixedModuleById(instanceId) {
  return fixedModules.find((m) => m.instanceId === instanceId)
}

export function cloneFixedModule(instanceId) {
  const source = getFixedModuleById(instanceId)
  if (!source) return null
  return JSON.parse(JSON.stringify(source))
}
