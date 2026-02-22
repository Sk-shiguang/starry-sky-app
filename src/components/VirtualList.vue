<template>
  <view class="virtual-list" :style="containerStyle">
    <!-- 顶部加载状态 -->
    <view v-if="loading && !isRefresh" class="loading-header">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 可滚动区域 -->
    <scroll-view
      class="scroll-container"
      :scroll-y="true"
      :scroll-top="scrollTop"
      :lower-threshold="lowerThreshold"
      @scroll="onScroll"
      @scrolltolower="onScrollToLower"
      @scrolltoupper="onScrollToUpper"
      :refresher-enabled="enableRefresh"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
      <!-- 骨架屏(首次加载) -->
      <view v-if="loading && list.length === 0" class="skeleton-container">
        <Skeleton 
          :show-list="true" 
          :list-count="pageSize"
          :animated="true"
        />
      </view>
      
      <!-- 实际列表内容 -->
      <view v-else class="list-content">
        <!-- 列表项 -->
        <view 
          v-for="(item, index) in displayList" 
          :key="getItemKey(item, index)"
          class="list-item"
          :style="getItemStyle(index)"
          @click="onItemClick(item, index)"
        >
          <slot :item="item" :index="index" />
        </view>
        
        <!-- 底部加载更多 -->
        <view v-if="hasMore" class="load-more">
          <view v-if="loadingMore" class="loading-spinner small"></view>
          <text class="load-more-text">{{ loadingMore ? '加载中...' : '上拉加载更多' }}</text>
        </view>
        
        <!-- 没有更多数据 -->
        <view v-else-if="list.length > 0 && showNoMore" class="no-more">
          <text class="no-more-text">—— 到底了 ——</text>
        </view>
        
        <!-- 空状态 -->
        <view v-if="!loading && list.length === 0" class="empty-state">
          <slot name="empty">
            <text class="empty-text">暂无数据</text>
          </slot>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Skeleton from './Skeleton.vue'

interface Props {
  // 数据源
  list: any[]
  // 唯一键字段名
  keyField?: string
  // 每页数量
  pageSize?: number
  // 是否有更多数据
  hasMore?: boolean
  // 加载状态
  loading?: boolean
  // 是否正在加载更多
  loadingMore?: boolean
  // 是否启用下拉刷新
  enableRefresh?: boolean
  // 是否正在刷新
  isRefreshing?: boolean
  // 列表项高度(rpx)，用于虚拟滚动计算
  itemHeight?: number
  // 可视区域外预渲染数量
  bufferSize?: number
  // 滚动到底部阈值
  lowerThreshold?: number
  // 是否显示"没有更多"提示
  showNoMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'id',
  pageSize: 10,
  hasMore: true,
  loading: false,
  loadingMore: false,
  enableRefresh: true,
  isRefreshing: false,
  itemHeight: 150,
  bufferSize: 5,
  lowerThreshold: 100,
  showNoMore: true
})

const emit = defineEmits<{
  scroll: [event: any]
  scrolltolower: []
  scrolltoupper: []
  refresh: []
  itemClick: [item: any, index: number]
}>()

// 滚动相关状态
const scrollTop = ref(0)
const isRefresh = ref(false)

// 获取列表项唯一键
const getItemKey = (item: any, index: number) => {
  return item?.[props.keyField] ?? `item-${index}`
}

// 计算容器样式
const containerStyle = computed(() => {
  return {
    height: '100%'
  }
})

// 显示的列表(目前显示全部，可优化为虚拟列表)
const displayList = computed(() => {
  return props.list
})

// 获取列表项样式
const getItemStyle = (index: number) => {
  // 添加交错动画延迟
  const delay = Math.min(index * 0.05, 0.5)
  return {
    animationDelay: `${delay}s`
  }
}

// 滚动事件
const onScroll = (e: any) => {
  scrollTop.value = e.detail.scrollTop
  emit('scroll', e)
}

// 滚动到底部
const onScrollToLower = () => {
  if (!props.loadingMore && props.hasMore) {
    emit('scrolltolower')
  }
}

// 滚动到顶部
const onScrollToUpper = () => {
  emit('scrolltoupper')
}

// 下拉刷新
const onRefresh = () => {
  isRefresh.value = true
  emit('refresh')
}

// 刷新完成恢复
const onRestore = () => {
  isRefresh.value = false
}

// 列表项点击
const onItemClick = (item: any, index: number) => {
  emit('itemClick', item, index)
}

// 监听刷新状态变化
watch(() => props.isRefreshing, (newVal) => {
  if (!newVal) {
    isRefresh.value = false
  }
})
</script>

<style scoped>
.virtual-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll-container {
  flex: 1;
  height: 100%;
}

/* 顶部加载状态 */
.loading-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  gap: 20rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.1);
  border-top-color: #64b5f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.small {
  width: 28rpx;
  height: 28rpx;
  border-width: 2rpx;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 骨架屏容器 */
.skeleton-container {
  padding: 20rpx;
}

/* 列表内容 */
.list-content {
  padding: 20rpx;
}

.list-item {
  animation: slide-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载更多 */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  gap: 15rpx;
}

.load-more-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 没有更多 */
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.no-more-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.3);
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 底部占位 */
.bottom-space {
  height: 40rpx;
}
</style>
