<template>
  <view class="loading-overlay" v-if="visible" @touchmove.prevent>
    <view class="loading-content">
      <!-- 星空加载动画 -->
      <view class="star-loader">
        <view class="star-orbit">
          <view class="star-item s1"></view>
          <view class="star-item s2"></view>
          <view class="star-item s3"></view>
        </view>
        <view class="center-glow"></view>
      </view>
      <text class="loading-text">{{ text }}</text>
      <view v-if="showProgress" class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  text?: string
  showProgress?: boolean
  progress?: number
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  showProgress: false,
  progress: 0
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 星空加载动画 */
.star-loader {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 30rpx;
}

.star-orbit {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: rotate 2s linear infinite;
}

.star-item {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20rpx #fff, 0 0 40rpx rgba(100, 181, 246, 0.8);
}

.star-item.s1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.star-item.s2 {
  bottom: 10rpx;
  left: 10rpx;
  animation-delay: -0.66s;
}

.star-item.s3 {
  bottom: 10rpx;
  right: 10rpx;
  animation-delay: -1.33s;
}

.center-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40rpx;
  height: 40rpx;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
}

.loading-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20rpx;
}

.progress-bar {
  width: 200rpx;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #f093fb);
  border-radius: 2rpx;
  transition: width 0.3s ease;
}
</style>