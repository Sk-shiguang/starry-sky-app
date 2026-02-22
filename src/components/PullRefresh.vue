<template>
  <view class="pull-refresh" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <view class="refresh-indicator" :style="{ height: pullDistance + 'px', opacity: pullDistance > 0 ? 1 : 0 }">
      <view class="refresh-content" :class="{ 'is-refreshing': isRefreshing }">
        <view class="refresh-icon">
          <text v-if="!isRefreshing" :style="{ transform: `rotate(${pullDistance * 2}deg)` }">↓</text>
          <view v-else class="refresh-spinner"></view>
        </view>
        <text class="refresh-text">{{ refreshText }}</text>
      </view>
    </view>
    <view class="refresh-content-wrap" :style="{ transform: `translateY(${pullDistance}px)` }">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  threshold?: number
  maxDistance?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 80,
  maxDistance: 120
})

const emit = defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)
const pullDistance = ref(0)
const startY = ref(0)

const refreshText = computed(() => {
  if (isRefreshing.value) return '刷新中...'
  if (pullDistance.value >= props.threshold) return '松开刷新'
  return '下拉刷新'
})

const handleTouchStart = (e: TouchEvent) => {
  if (isRefreshing.value) return
  startY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  if (isRefreshing.value) return
  const currentY = e.touches[0].clientY
  const diff = currentY - startY.value
  
  if (diff > 0) {
    // 阻尼效果
    const damped = Math.min(diff * 0.5, props.maxDistance)
    pullDistance.value = damped
  }
}

const handleTouchEnd = () => {
  if (isRefreshing.value) return
  
  if (pullDistance.value >= props.threshold) {
    isRefreshing.value = true
    pullDistance.value = props.threshold
    emit('refresh')
  } else {
    pullDistance.value = 0
  }
}

const finishRefresh = () => {
  isRefreshing.value = false
  pullDistance.value = 0
}

defineExpose({ finishRefresh })
</script>

<style scoped>
.pull-refresh {
  position: relative;
}

.refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.3s;
}

.refresh-content {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 20rpx 0;
  transition: all 0.3s;
}

.refresh-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-icon text {
  font-size: 32rpx;
  color: #64b5f6;
  transition: transform 0.1s;
}

.refresh-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid rgba(100, 181, 246, 0.3);
  border-top-color: #64b5f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.refresh-content-wrap {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>