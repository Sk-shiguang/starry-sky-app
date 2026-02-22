<template>
  <view class="my-guides-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">我的攻略</text>
      <text class="page-subtitle" v-if="!loading">共 {{ guides.length }} 份攻略</text>
      <text class="page-subtitle" v-else>加载中...</text>
    </view>
    
    <!-- 虚拟列表 -->
    <VirtualList
      :list="guides"
      key-field="id"
      :loading="loading"
      :has-more="hasMore"
      :loading-more="loadingMore"
      :enable-refresh="true"
      :is-refreshing="isRefreshing"
      @refresh="onRefresh"
      @scrolltolower="loadMore"
      @item-click="viewGuide"
      class="guides-virtual-list"
    >
      <!-- 列表项 -->
      <template #default="{ item: guide }">
        <view class="guide-item glass-card">
          <view class="guide-type-icon" :style="{ background: getTypeColor(guide.type) }">
            <text>{{ guide.type === 'travel' ? '✈️' : '🍜' }}</text>
          </view>
          
          <view class="guide-info">
            <text class="guide-title">{{ guide.title }}</text>
            <view class="guide-meta">
              <text class="guide-keyword">{{ guide.keyword }}</text>
              <text class="guide-date">{{ formatDate(guide.createTime) }}</text>
            </view>
          </view>
          
          <view class="guide-actions" @click.stop>
            <view class="action-item" @click="exportGuide(guide)">
              <text class="action-icon">📤</text>
            </view>
            <view class="action-item delete" @click="deleteGuide(guide)">
              <text class="action-icon">🗑️</text>
            </view>
          </view>
        </view>
      </template>
      
      <!-- 空状态 -->
      <template #empty>
        <view class="empty-state">
          <view class="empty-icon">📋</view>
          <text class="empty-title">还没有攻略</text>
          <text class="empty-desc">去生成你的第一份专属攻略吧</text>
          <view class="create-btn star-btn star-btn-primary" @click="goToGenerator">
            <text>生成攻略</text>
          </view>
        </view>
      </template>
    </VirtualList>
    
    <!-- 悬浮添加按钮 -->
    <view v-if="guides.length > 0" class="fab-btn" @click="goToGenerator">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'
import VirtualList from '@/components/VirtualList.vue'

interface Guide {
  id: number
  type: 'travel' | 'food'
  keyword: string
  title: string
  createTime: string
  content: any
}

const guides = ref<Guide[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const isRefreshing = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 10

onMounted(() => {
  loadGuides()
})

// 加载攻略列表
const loadGuides = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    page.value = 1
  }
  
  // 模拟异步加载(实际项目中应该是 API 请求)
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const saved = uni.getStorageSync('myGuides') || []
  
  if (isLoadMore) {
    // 模拟分页加载
    const start = (page.value - 1) * pageSize
    const end = start + pageSize
    const newItems = saved.slice(start, end)
    
    if (newItems.length > 0) {
      guides.value.push(...newItems)
      page.value++
    }
    
    // 判断是否还有更多
    hasMore.value = end < saved.length
    loadingMore.value = false
  } else {
    // 首次加载
    guides.value = saved.slice(0, pageSize)
    hasMore.value = saved.length > pageSize
    loading.value = false
    isRefreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true
  loadGuides()
}

// 加载更多
const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadGuides(true)
  }
}

const getTypeColor = (type: string) => {
  return type === 'travel' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
}

const formatDate = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const viewGuide = (guide: Guide) => {
  uni.setStorageSync('currentGuide', guide)
  uni.navigateTo({ 
    url: '/pages/guide-detail/index',
    success: () => {
      // 页面转场动画
    }
  })
}

const exportGuide = (guide: Guide) => {
  uni.showActionSheet({
    itemList: ['导出为图片', '导出为文档'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showLoading({ title: '生成图片中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '图片已保存', icon: 'success' })
        }, 1500)
      } else {
        uni.showLoading({ title: '生成文档中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '文档已生成', icon: 'success' })
        }, 1500)
      }
    }
  })
}

const deleteGuide = (guide: Guide) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这份攻略吗？',
    confirmColor: '#f5576c',
    success: (res) => {
      if (res.confirm) {
        const index = guides.value.findIndex(g => g.id === guide.id)
        if (index > -1) {
          // 添加删除动画效果
          guides.value.splice(index, 1)
          // 同步更新本地存储
          const saved = uni.getStorageSync('myGuides') || []
          const savedIndex = saved.findIndex((g: Guide) => g.id === guide.id)
          if (savedIndex > -1) {
            saved.splice(savedIndex, 1)
            uni.setStorageSync('myGuides', saved)
          }
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      }
    }
  })
}

const goToGenerator = () => {
  uni.navigateTo({ url: '/pages/guide-generator/index' })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.my-guides-page {
  min-height: 100vh;
  padding: 40rpx 30rpx 0;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.back-btn {
  position: fixed;
  top: 80rpx;
  left: 30rpx;
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  transition: all 0.3s ease;
}

.back-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.15);
}

.back-icon {
  font-size: 36rpx;
  color: #ffffff;
}

.page-header {
  margin-top: 120rpx;
  margin-bottom: 30rpx;
  flex-shrink: 0;
}

.page-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.5);
  margin-bottom: 10rpx;
  display: block;
}

.page-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.guides-virtual-list {
  flex: 1;
  height: calc(100vh - 240rpx);
}

/* 列表项样式 */
.guide-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.guide-item:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.08);
}

.guide-type-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.guide-info {
  flex: 1;
  min-width: 0;
}

.guide-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guide-meta {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.guide-keyword {
  font-size: 24rpx;
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.15);
  padding: 4rpx 15rpx;
  border-radius: 10rpx;
}

.guide-date {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

.guide-actions {
  display: flex;
  gap: 15rpx;
  margin-left: 20rpx;
}

.action-item {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.action-item:active {
  transform: scale(0.9);
}

.action-item.delete {
  background: rgba(245, 87, 108, 0.2);
}

.action-item.delete:active {
  background: rgba(245, 87, 108, 0.3);
}

.action-icon {
  font-size: 28rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 40rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15rpx); }
}

.empty-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 60rpx;
}

.create-btn {
  width: 300rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-btn text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 悬浮按钮 */
.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 40rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
}

.fab-btn:active {
  transform: scale(0.95);
  box-shadow: 0 6rpx 24rpx rgba(102, 126, 234, 0.3);
}

.fab-icon {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 300;
}
</style>
