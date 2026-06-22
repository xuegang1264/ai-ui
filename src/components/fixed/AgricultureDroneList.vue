<script setup>
import { ref } from 'vue'

const emit = defineEmits(['view-report'])

const selectedDrone = ref(null)

const levelOptions = ['省级', '市级', '区级', '街道']
const currentLevel = ref('省级')

const regionOptions = ['江苏省', '南京市', '苏州市', '无锡市']
const currentRegion = ref('江苏省')

const taskTypeOptions = ['全部任务', '植保作业', '巡查监测', '测绘巡航']
const currentTaskType = ref('全部任务')

const drones = [
  {
    id: 'UAV-001',
    name: '植保无人机 001',
    status: 'idle',
    statusText: '空闲',
    location: '南京市浦口区江浦街道',
    battery: 86,
    image: '',
    video: '',
  },
  {
    id: 'UAV-002',
    name: '植保无人机 002',
    status: 'working',
    statusText: '作业中',
    location: '南京市浦口区桥林街道',
    battery: 62,
    image: '',
    video: '',
  },
  {
    id: 'UAV-003',
    name: '测绘无人机 003',
    status: 'idle',
    statusText: '空闲',
    location: '南京市六合区龙池街道',
    battery: 74,
    image: '',
    video: '',
  },
  {
    id: 'UAV-004',
    name: '巡查无人机 004',
    status: 'working',
    statusText: '作业中',
    location: '南京市江宁区东山街道',
    battery: 45,
    image: '',
    video: '',
  },
  {
    id: 'UAV-005',
    name: '植保无人机 005',
    status: 'idle',
    statusText: '空闲',
    location: '南京市溧水区永阳街道',
    battery: 91,
    image: '',
    video: '',
  },
]

function selectDrone(drone) {
  selectedDrone.value = drone
}

function closeVideo() {
  selectedDrone.value = null
}

function createTask() {
  // TODO: 新建调度任务逻辑
}

function handleQuery() {
  // TODO: 查询逻辑
}

function viewReport(drone) {
  emit('view-report', drone)
}
</script>

<template>
  <div class="drone-list">
    <!-- 第一行：调度层级 + 下拉框 -->
    <div class="drone-row">
      <span class="drone-label">无人机调度层级</span>
      <select v-model="currentLevel" class="drone-select">
        <option v-for="opt in levelOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <!-- 第二行：新建调度任务 -->
    <button class="drone-btn drone-btn--primary" @click="createTask">
      + 新建调度任务
    </button>

    <!-- 第三行：筛选 + 查询 -->
    <div class="drone-row">
      <select v-model="currentRegion" class="drone-select">
        <option v-for="opt in regionOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <select v-model="currentTaskType" class="drone-select">
        <option v-for="opt in taskTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button class="drone-btn drone-btn--query" @click="handleQuery">查询</button>
    </div>

    <!-- 飞行视频（点击列表项后显示） -->
    <div v-if="selectedDrone" class="drone-video">
      <div class="drone-video-header">
        <span class="drone-video-title">{{ selectedDrone.name }} 飞行视频</span>
        <button class="drone-video-close" @click="closeVideo">×</button>
      </div>
      <div class="drone-video-player">
        <video v-if="selectedDrone.video" :src="selectedDrone.video" controls muted autoplay></video>
        <div v-else class="drone-video-placeholder">飞行视频占位</div>
      </div>
    </div>

    <!-- 无人机列表 -->
    <div class="drone-list-container">
      <div
        v-for="drone in drones"
        :key="drone.id"
        class="drone-item"
        :class="{ active: selectedDrone?.id === drone.id }"
        @click="selectDrone(drone)"
      >
        <div class="drone-thumb">
          <img v-if="drone.image" :src="drone.image" :alt="drone.name" />
          <span v-else class="drone-thumb-placeholder">无人机</span>
        </div>
        <div class="drone-info">
          <div class="drone-info-main">
            <div class="drone-info-left">
              <span class="drone-name">{{ drone.name }}</span>
              <div class="drone-location">{{ drone.location }}</div>
              <div class="drone-meta">电量 {{ drone.battery }}%</div>
            </div>
            <div class="drone-info-right">
              <span
                class="drone-status"
                :class="drone.status === 'working' ? 'drone-status--working' : 'drone-status--idle'"
              >
                {{ drone.statusText }}
              </span>
              <button class="drone-btn drone-btn--report" @click.stop="viewReport(drone)">
                飞行报告
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgricultureDroneList',
}
</script>

<style scoped>
.drone-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  height: 100%;
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-sizing: border-box;
  overflow: hidden;
}

.drone-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.drone-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h);
  white-space: nowrap;
}

.drone-select {
  flex: 1 1 auto;
  min-width: 0;
  padding: 6px 10px;
  font-size: 0.85rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.drone-select:focus {
  border-color: var(--accent);
}

.drone-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

/* .drone-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
} */

.drone-btn--primary {
  width: 100%;
  padding: 8px 14px;
  color: var(--surface);
  background: var(--accent);
  border-color: var(--accent);
}

.drone-btn--primary:hover {
  opacity: 0.9;
}

.drone-btn--query {
  color: var(--accent);
  background: var(--accent-bg);
  border-color: var(--accent);
}

.drone-btn--query:hover {
  color: var(--surface);
  background: var(--accent);
}

.drone-btn--report {
  padding: 4px 10px;
  font-size: 0.75rem;
  color: var(--accent);
  background: var(--accent-bg);
  border-color: var(--accent);
}

.drone-btn--report:hover {
  color: var(--surface);
  background: var(--accent);
}

.drone-video {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.drone-video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.drone-video-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drone-video-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 1rem;
  line-height: 1;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all 0.2s;
}

.drone-video-close:hover {
  color: var(--text);
  background: var(--surface);
  border-color: var(--border);
}

.drone-video-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: oklch(25% 0.02 260 / 0.08);
  border-radius: var(--radius-btn);
  overflow: hidden;
}

.drone-video-player video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drone-video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.drone-list-container {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  overflow-y: auto;
}

.drone-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.2s;
}

.drone-item:hover {
  border-color: var(--accent);
}

.drone-item.active {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.drone-thumb {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  border-radius: var(--radius-btn);
  overflow: hidden;
}

.drone-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drone-thumb-placeholder {
  font-size: 0.65rem;
  color: var(--accent);
  writing-mode: vertical-rl;
  letter-spacing: 2px;
}

.drone-info {
  flex: 1 1 auto;
  min-width: 0;
}

.drone-info-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
}

.drone-info-left {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drone-info-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.drone-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drone-status {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: var(--radius-badge);
}

.drone-status--idle {
  color: var(--accent);
  background: var(--accent-bg);
}

.drone-status--working {
  color: var(--surface);
  background: var(--accent);
}

.drone-location {
  font-size: 0.8rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drone-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
