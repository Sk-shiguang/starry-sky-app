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
/* ==================== 全局 CSS 变量（新配色方案）==================== */
page {
  /* 背景渐变 */
  --bg-primary: linear-gradient(135deg, #141E61, #511EA2);
  --bg-dark: linear-gradient(180deg, #0a0e27 0%, #1a1f4b 50%, #0f1535 100%);
  
  /* 按钮/高亮 */
  --gradient-primary: linear-gradient(135deg, #667eea, #f093fb);
  --gradient-secondary: linear-gradient(135deg, #667eea, #764ba2);
  --color-danger: #f5576c;
  --color-success: #38f9d7;
  
  /* 文字 */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.6);
  
  /* 毛玻璃 */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(10px);
  
  /* 发光 */
  --glow-blue: rgba(100, 181, 246, 0.5);
  --glow-purple: rgba(102, 126, 234, 0.5);
  
  /* 应用背景 */
  background: var(--bg-dark);
  min-height: 100vh;
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-container {
  min-height: 100vh;
  position: relative;
}

/* ==================== 通用卡片样式（升级版）==================== */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1rpx solid var(--glass-border);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-card-hover {
  transform: translateY(-5rpx);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

/* ==================== 文字与发光效果 ==================== */
.glow-text {
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.5),
               0 0 40rpx rgba(100, 181, 246, 0.3);
}

.glow-text-strong {
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.6),
               0 0 60rpx rgba(100, 181, 246, 0.4);
}

/* ==================== 核心动画 ==================== */
/* 星星闪烁 */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 浮动效果 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

/* 脉冲发光 */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20rpx rgba(100, 181, 246, 0.4); }
  50% { box-shadow: 0 0 40rpx rgba(100, 181, 246, 0.8); }
}

/* 边框流光 */
@keyframes border-flow {
  0%, 100% { border-color: rgba(102, 126, 234, 0.4); }
  50% { border-color: rgba(240, 147, 251, 0.6); }
}

/* 光环旋转 */
@keyframes ring-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* 渐变流光 */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 星光碎片 */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}

/* 飞入效果 */
@keyframes fly-in {
  0% { opacity: 0; transform: translateY(30rpx) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* 呼吸效果 */
@keyframes breathe {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(1.1); }
}

/* ==================== 按钮样式（升级版）==================== */
.star-btn {
  background: var(--gradient-secondary);
  border: none;
  border-radius: 50rpx;
  color: white;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.star-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

.star-btn:active::before {
  left: 100%;
}

.star-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.2);
}

.star-btn-primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8rpx 24rpx rgba(79, 172, 254, 0.3);
}

.star-btn-secondary {
  background: transparent;
  border: 2rpx solid rgba(100, 181, 246, 0.5);
}

/* 流光边框效果 */
.border-glow {
  position: relative;
}

.border-glow::after {
  content: '';
  position: absolute;
  top: -2rpx;
  left: -2rpx;
  right: -2rpx;
  bottom: -2rpx;
  border-radius: inherit;
  background: linear-gradient(135deg, #667eea, #f093fb, #667eea);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.border-glow:hover::after,
.border-glow:active::after {
  opacity: 1;
}
</style>