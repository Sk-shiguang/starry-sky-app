<template>
  <view class="app-container">
    <StarBackground />
    <slot />
  </view>
</template>

<script setup lang="ts">
import StarBackground from './components/StarBackground.vue'
</script>

<style>
/* 全局星空主题样式 */
page {
  background: linear-gradient(180deg, #0a0e27 0%, #1a1f4b 50%, #0f1535 100%);
  min-height: 100vh;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-container {
  min-height: 100vh;
  position: relative;
}

/* 通用卡片样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
}

/* 发光文字 */
.glow-text {
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.5),
               0 0 40rpx rgba(100, 181, 246, 0.3);
}

/* 星星动画 */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20rpx rgba(100, 181, 246, 0.4); }
  50% { box-shadow: 0 0 40rpx rgba(100, 181, 246, 0.8); }
}

/* 按钮样式 */
.star-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50rpx;
  color: white;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.star-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.star-btn:active::before {
  left: 100%;
}

.star-btn-primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.star-btn-secondary {
  background: transparent;
  border: 2rpx solid rgba(100, 181, 246, 0.5);
}
</style>