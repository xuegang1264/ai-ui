<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  experts: { type: Array, default: () => DEFAULT_EXPERTS },
  pageSize: { type: Number, default: 2 },
  detailTitle: { type: String, default: '各市农服中心概况' },
  detailGroups: { type: Array, default: () => DEFAULT_DETAIL_GROUPS },
  detailPageSize: { type: Number, default: 21 },
})

const emit = defineEmits(['contact'])

function avatarInitial(name) {
  return name ? name.charAt(0) : '?'
}

// 顶部小列表分页
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.experts.length / props.pageSize))
)

const pagedExperts = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.experts.slice(start, start + props.pageSize)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 详情弹框
const detailVisible = ref(false)
const activeRegionIndex = ref(0)
const detailPage = ref(1)

const activeGroup = computed(() => props.detailGroups[activeRegionIndex.value] || null)
const activeGroupExperts = computed(() => activeGroup.value?.experts || [])

const detailTotalPages = computed(() =>
  Math.max(1, Math.ceil(activeGroupExperts.value.length / props.detailPageSize))
)

const pagedDetailExperts = computed(() => {
  const start = (detailPage.value - 1) * props.detailPageSize
  return activeGroupExperts.value.slice(start, start + props.detailPageSize)
})

function openDetail() {
  detailVisible.value = true
  activeRegionIndex.value = 0
  detailPage.value = 1
}

function closeDetail() {
  detailVisible.value = false
}

function switchRegion(index) {
  activeRegionIndex.value = index
  detailPage.value = 1
}

function goToDetailPage(page) {
  if (page < 1 || page > detailTotalPages.value) return
  detailPage.value = page
}

function onOverlayKeydown(e) {
  if (e.key === 'Escape') closeDetail()
}

watch(
  () => props.detailGroups,
  () => {
    activeRegionIndex.value = 0
    detailPage.value = 1
  }
)

function handleContact(expert) {
  emit('contact', expert)
}
</script>

<template>
  <div class="expert-list">
    <button class="detail-trigger" @click="openDetail">详情</button>

    <div class="expert-cards">
      <div
        v-for="expert in pagedExperts"
        :key="expert.name"
        class="expert-card expert-card--horizontal"
      >
        <div class="expert-avatar expert-avatar--horizontal">
          <img
            v-if="expert.avatar"
            :src="expert.avatar"
            :alt="expert.name"
          />
          <span v-else class="expert-avatar-placeholder">
            {{ avatarInitial(expert.name) }}
          </span>
        </div>
        <div class="expert-info expert-info--horizontal">
          <div class="expert-name" :title="expert.name">{{ expert.name }}</div>
          <div class="expert-title" :title="expert.title">{{ expert.title }}</div>
          <div class="expert-specialty" :title="`专业：${expert.specialty}`">专业：{{ expert.specialty }}</div>
          <button class="expert-contact" @click="handleContact(expert)">联系方式</button>
        </div>
      </div>
    </div>

    <div class="expert-footer">
      <div class="expert-pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- 详情弹框 -->
    <Teleport to="body">
      <div
        v-if="detailVisible"
        class="detail-overlay"
        @click="closeDetail"
        @keydown="onOverlayKeydown"
        tabindex="-1"
      >
        <div class="detail-modal" @click.stop>
          <div class="detail-header">
            <span class="detail-title">{{ detailTitle }}</span>
            <button class="detail-close" @click="closeDetail">×</button>
          </div>

          <div v-if="detailGroups.length > 0" class="detail-tabs">
            <button
              v-for="(group, index) in detailGroups"
              :key="group.region"
              class="detail-tab"
              :class="{ active: index === activeRegionIndex }"
              @click="switchRegion(index)"
            >
              {{ group.region }}
            </button>
          </div>

          <div class="detail-body">
            <div class="detail-grid">
              <div
                v-for="expert in pagedDetailExperts"
                :key="expert.name"
                class="expert-card expert-card--vertical"
              >
                <div class="expert-avatar expert-avatar--vertical">
                  <img
                    v-if="expert.avatar"
                    :src="expert.avatar"
                    :alt="expert.name"
                  />
                  <span v-else class="expert-avatar-placeholder">
                    {{ avatarInitial(expert.name) }}
                  </span>
                </div>
                <div class="expert-info expert-info--vertical">
                  <div class="expert-name" :title="expert.name">{{ expert.name }}</div>
                  <div class="expert-title" :title="expert.title">{{ expert.title }}</div>
                  <div class="expert-specialty" :title="`专业：${expert.specialty}`">专业：{{ expert.specialty }}</div>
                  <button class="expert-contact" @click="handleContact(expert)">联系方式</button>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-footer">
            <div class="expert-pagination">
              <button
                v-for="page in detailTotalPages"
                :key="page"
                class="page-btn"
                :class="{ active: page === detailPage }"
                @click="goToDetailPage(page)"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
const CITIES = [
  '南京市', '镇江市', '盐城市', '苏州市', '无锡市', '常州市',
  '扬州市', '泰州市', '淮安市', '宿迁市', '徐州市', '连云港市', '南通市',
]

const FIRST_NAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄']
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

export const DEFAULT_DETAIL_GROUPS = CITIES.map((city, cityIndex) => ({
  region: city,
  experts: Array.from({ length: 8 }, (_, i) => createExpert(i, cityIndex)),
}))

export const DEFAULT_EXPERTS = DEFAULT_DETAIL_GROUPS[9].experts.slice(0, 8)

export default {
  name: 'AgricultureExpertList',
}
</script>

<style scoped>
.expert-list {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  height: 100%;
  gap: var(--space-2);
  background: var(--surface);
  border-radius: var(--radius-card);
  box-sizing: border-box;
  /* overflow: hidden; */
}

.detail-trigger {
  position: fixed;
  top: 11px;
  right: 13px;
  z-index: 2;
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all 0.2s;
}

.detail-trigger:hover {
  color: var(--surface);
  background: var(--accent);
}

.expert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  flex: 1 1 auto;
  gap: var(--space-3);
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.expert-card {
  display: flex;
  align-items: stretch;
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
  min-width: 0;
}

.expert-card--horizontal {
  flex-direction: row;
}

.expert-card--vertical {
  flex-direction: column;
}

.expert-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  overflow: hidden;
}

.expert-avatar--horizontal {
  flex: 0 0 38%;
  min-width: 80px;
  max-width: 140px;
}

.expert-avatar--vertical {
  width: 100%;
  aspect-ratio: 3 / 4;
}

.expert-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expert-avatar-placeholder {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  font-family: var(--font-display);
}

.expert-avatar--vertical .expert-avatar-placeholder {
  font-size: 3rem;
}

.expert-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-1);
}

.expert-info--horizontal {
  padding: var(--space-3);
}

.expert-info--vertical {
  padding: var(--space-2);
}

.expert-name,
.expert-title,
.expert-specialty {
  min-width: 0;
  white-space: nowrap;
  /* overflow: hidden; */
  text-overflow: ellipsis;
}

.expert-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-h);
  /* line-height: 1.3; */
}

.expert-title {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.expert-specialty {
  font-size: 0.85rem;
  color: var(--text);
}

.expert-contact {
  align-self: flex-start;
  margin-top: var(--space-1);
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--surface);
  background: var(--accent);
  border: none;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: opacity 0.2s;
}

.expert-card--vertical .expert-contact {
  align-self: stretch;
  text-align: center;
}

.expert-contact:hover {
  opacity: 0.9;
}

.expert-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.expert-pagination {
  display: flex;
  gap: var(--space-1);
}

.page-btn {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-badge);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn.active {
  color: var(--surface);
  background: var(--accent);
  border-color: var(--accent);
}

/* ===== 详情弹框 ===== */
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: oklch(25% 0.02 260 / 0.45);
  backdrop-filter: blur(2px);
}

.detail-modal {
  display: flex;
  flex-direction: column;
  width: min(1160px, 92vw);
  height: min(760px, 88vh);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.detail-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.detail-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-h);
}

.detail-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all 0.2s;
}

.detail-close:hover {
  color: var(--text);
  background: var(--bg);
  border-color: var(--border);
}

.detail-tabs {
  flex-shrink: 0;
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto;
}

.detail-tab {
  flex-shrink: 0;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all 0.2s;
}

.detail-tab:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.detail-tab.active {
  color: var(--surface);
  background: var(--accent);
  border-color: var(--accent);
}

.detail-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: var(--space-3) var(--space-4);
  overflow-y: auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: var(--space-3);
}

.detail-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4) var(--space-3);
  border-top: 1px solid var(--border-light);
}
</style>
