<template>
  <view class="star-background">
    <!-- 渐变背景 -->
    <view class="gradient-bg"></view>
    
    <!-- 星星层 -->
    <view class="stars-layer">
      <view
        v-for="(star, index) in stars"
        :key="index"
        class="star"
        :class="star.type"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></view>
    </view>
    
    <!-- 流星层 -->
    <view class="meteors-layer">
      <view
        v-for="(meteor, index) in meteors"
        :key="'m' + index"
        class="meteor"
        :style="{
          left: meteor.left + '%',
          top: meteor.top + '%',
          animationDelay: meteor.delay + 's'
        }"
      ></view>
    </view>
    
    <!-- 星云层 -->
    <view class="nebula-layer">
      <view class="nebula nebula-1"></view>
      <view class="nebula nebula-2"></view>
      <view class="nebula nebula-3"></view>
    </view>
    
    <!-- 月亮 -->
    <view class="moon"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Star {
  left: number
  top: number
  delay: number
  duration: number
  type: 'small' | 'medium' | 'large'
}

interface Meteor {
  left: number
  top: number
  delay: number
}

const stars = ref<Star[]>([])
const meteors = ref<Meteor[]>([])

const generateStars = () => {
  const newStars: Star[] = []
  
  // 小星星
  for (let i = 0; i < 80; i++) {
    newStars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      type: 'small'
    })
  }
  
  // 中星星
  for (let i = 0; i < 30; i++) {
    newStars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2,
      type: 'medium'
    })
  }
  
  // 大星星
  for (let i = 0; i < 10; i++) {
    newStars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 2,
      type: 'large'
    })
  }
  
  stars.value = newStars
}

const generateMeteors = () => {
  const newMeteors: Meteor[] = []
  
  for (let i = 0; i < 3; i++) {
    newMeteors.push({
      left: 10 + Math.random() * 80,
      top: -10,
      delay: 3 + Math.random() * 10
    })
  }
  
  meteors.value = newMeteors
}

onMounted(() => {
  generateStars()
  generateMeteors()
})
</script>

<style scoped>
.star-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at top, #1a1f4b 0%, transparent 50%),
    radial-gradient(ellipse at bottom, #0f1535 0%, #0a0e27 100%),
    linear-gradient(180deg, #0a0e27 0%, #1a1f4b 50%, #0f1535 100%);
}

/* 星星样式 */
.stars-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: twinkle linear infinite;
}

.star.small {
  width: 2rpx;
  height: 2rpx;
  box-shadow: 0 0 4rpx rgba(255, 255, 255, 0.8);
}

.star.medium {
  width: 3rpx;
  height: 3rpx;
  box-shadow: 0 0 6rpx rgba(255, 255, 255, 0.9);
}

.star.large {
  width: 4rpx;
  height: 4rpx;
  box-shadow: 
    0 0 8rpx rgba(255, 255, 255, 1),
    0 0 16rpx rgba(100, 181, 246, 0.5);
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.2; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.3);
  }
}

/* 流星样式 */
.meteors-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.meteor {
  position: absolute;
  width: 200rpx;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform: rotate(-45deg);
  animation: meteor 4s linear infinite;
  opacity: 0;
}

.meteor::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 8rpx;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 20rpx 4rpx rgba(255, 255, 255, 0.8);
}

@keyframes meteor {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0) rotate(-45deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(-100vw) translateY(100vh) rotate(-45deg);
  }
}

/* 星云样式 */
.nebula-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(60rpx);
}

.nebula-1 {
  width: 600rpx;
  height: 600rpx;
  top: -200rpx;
  right: -200rpx;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

.nebula-2 {
  width: 500rpx;
  height: 500rpx;
  bottom: 10%;
  left: -150rpx;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.25) 0%, transparent 70%);
  animation: float 25s ease-in-out infinite reverse;
}

.nebula-3 {
  width: 400rpx;
  height: 400rpx;
  top: 40%;
  right: 10%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%);
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30rpx, -30rpx) scale(1.05); }
  66% { transform: translate(-20rpx, 20rpx) scale(0.95); }
}

/* 月亮 */
.moon {
  position: absolute;
  top: 80rpx;
  right: 60rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fffef0 0%, #f5f3e8 50%, #e8e4d8 100%);
  box-shadow: 
    0 0 60rpx 10rpx rgba(255, 254, 240, 0.3),
    0 0 100rpx 20rpx rgba(255, 254, 240, 0.1),
    inset -20rpx -20rpx 40rpx rgba(0, 0, 0, 0.05);
  animation: moon-glow 4s ease-in-out infinite;
}

.moon::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 15%;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: rgba(200, 200, 200, 0.3);
}

.moon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 60%;
  width: 15rpx;
  height: 15rpx;
  border-radius: 50%;
  background: rgba(200, 200, 200, 0.2);
}

@keyframes moon-glow {
  0%, 100% { 
    box-shadow: 
      0 0 60rpx 10rpx rgba(255, 254, 240, 0.3),
      0 0 100rpx 20rpx rgba(255, 254, 240, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 80rpx 15rpx rgba(255, 254, 240, 0.4),
      0 0 120rpx 30rpx rgba(255, 254, 240, 0.15);
  }
}
</style>