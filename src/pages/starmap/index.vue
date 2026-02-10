<template>
  <view class="starmap-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 标题 -->
    <view class="page-header">
      <text class="page-title">实时星图</text>
      
      <text class="page-subtitle">{{ location }} · {{ currentTime }}</text>
    </view>
    
    <!-- 星图画布 -->
    <view class="starmap-container glass-card">
      <canvas 
        canvas-id="starmap"
        id="starmap"
        class="starmap-canvas"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></canvas>
      
      <!-- 星座标签 -->
      <view class="constellation-labels">
        <view 
          v-for="label in visibleLabels" 
          :key="label.name"
          class="sky-label"
          :style="{ left: label.x + '%', top: label.y + '%' }"
        >
          <text class="label-dot">·</text>
          
          <text class="label-name">{{ label.name }}</text>
        </view>
      </view>
      
      <!-- 方向指示 -->
      <view class="direction-indicator">
        <text class="direction-text north">N</text>
        <text class="direction-text east">E</text>
        <text class="direction-text south">S</text>
        <text class="direction-text west">W</text>
      </view>
    </view>
    
    <!-- 控制面板 -->
    <view class="control-panel glass-card"
>
      <view class="control-row">
        <view class="control-item" @click="toggleConstellations"
>
          <view class="control-icon" :class="{ active: showConstellations }">
            <text>⭐</text>
          </view>
          
          <text class="control-label">星座连线</text>
        </view>
        
        <view class="control-item" @click="toggleGrid">
          <view class="control-icon" :class="{ active: showGrid }">
            <text>⊞</text>
          </view>
          
          <text class="control-label">坐标网格</text>
        </view>
        
        <view class="control-item" @click="toggleAR">
          <view class="control-icon ar-icon">
            <text>📷</text>
          </view>
          
          <text class="control-label">AR模式</text>
        </view>
      </view>
      
      <view class="zoom-control">
        <view class="zoom-btn" @click="zoomOut">−</view>
        
        <view class="zoom-slider"
>
          <slider 
            :value="zoomLevel" 
            min="1" 
            max="10" 
            step="0.5"
            activeColor="#64b5f6"
            backgroundColor="rgba(255,255,255,0.2)"
            block-color="#ffffff"
            @change="handleZoomChange"
          />
        </view>
        
        <view class="zoom-btn" @click="zoomIn">+</view>
      </view>
    </view>
    
    <!-- 今日可见星座 -->
    <view class="visible-section"
>
      <text class="section-title">今晚可见星座</text>
      
      
      <scroll-view scroll-x class="visible-scroll"
>
        <view 
          v-for="c in visibleConstellations" 
          :key="c.name"
          class="visible-item"
        >
          <view class="visible-time">{{ c.time }}</view>
          
          <text class="visible-icon">{{ c.icon }}</text>
          
          <text class="visible-name">{{ c.name }}</text>
          
          <text class="visible-direction">{{ c.direction }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

const location = ref('北京市')
const currentTime = ref('')

// 显示控制
const showConstellations = ref(true)
const showGrid = ref(false)
const zoomLevel = ref(5)

// 可见星座标签
const visibleLabels = [
  { name: '北斗七星', x: 30, y: 25 },
  { name: '猎户座', x: 70, y: 40 },
  { name: '仙女座', x: 20, y: 60 },
  { name: '天鹅座', x: 60, y: 20 }
]

// 今晚可见星座
const visibleConstellations = [
  { name: '猎户座', icon: '🔱', time: '20:00', direction: '东南' },
  { name: '大熊座', icon: '🐻', time: '21:30', direction: '北方' },
  { name: '仙后座', icon: '👑', time: '22:00', direction: '东北' },
  { name: '双子座', icon: '👥', time: '23:00', direction: '东方' },
  { name: '狮子座', icon: '🦁', time: '00:30', direction: '东南' }
]

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 绘制星图
const drawStarmap = () => {
  const ctx = uni.createCanvasContext('starmap')
  
  // 清空画布
  ctx.setFillStyle('transparent')
  ctx.fillRect(0, 0, 400, 400)
  
  // 绘制星星
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 400
    const y = Math.random() * 400
    const size = Math.random() * 2 + 1
    const opacity = Math.random() * 0.5 + 0.5
    
    ctx.setFillStyle(`rgba(255, 255, 255, ${opacity})`)
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 绘制星座连线（简化版北斗七星）
  if (showConstellations.value) {
    ctx.setStrokeStyle('rgba(100, 181, 246, 0.5)')
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(100, 100)
    ctx.lineTo(120, 105)
    ctx.lineTo(140, 110)
    ctx.lineTo(160, 115)
    ctx.lineTo(180, 130)
    ctx.lineTo(200, 150)
    ctx.lineTo(220, 180)
    ctx.stroke()
    
    // 绘制星座点
    const points = [[100, 100], [120, 105], [140, 110], [160, 115], [180, 130], [200, 150], [220, 180]]
    points.forEach(([x, y]) => {
      ctx.setFillStyle('#ffffff')
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.setFillStyle('rgba(100, 181, 246, 0.3)')
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  
  ctx.draw()
}

// 控制方法
const toggleConstellations = () => {
  showConstellations.value = !showConstellations.value
  drawStarmap()
}

const toggleGrid = () => {
  showGrid.value = !showGrid.value
}

const toggleAR = () => {
  uni.showToast({ title: 'AR模式开发中', icon: 'none' })
}

const zoomIn = () => {
  if (zoomLevel.value < 10) {
    zoomLevel.value += 0.5
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 0.5
  }
}

const handleZoomChange = (e: any) => {
  zoomLevel.value = e.detail.value
}

// 触摸处理
const handleTouchStart = () => {}
const handleTouchMove = () => {}
const handleTouchEnd = () => {}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000)
  
  setTimeout(() => {
    drawStarmap()
  }, 100)
})
</script>

<style scoped>
.starmap-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
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
  z-index: 10;
}

.back-icon {
  font-size: 36rpx;
  color: #ffffff;
}

.page-header {
  margin-top: 120rpx;
  margin-bottom: 30rpx;
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

.starmap-container {
  position: relative;
  height: 600rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.starmap-canvas {
  width: 100%;
  height: 100%;
}

.constellation-labels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sky-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label-dot {
  font-size: 60rpx;
  color: #64b5f6;
  line-height: 0.5;
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.8);
}

.label-name {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.5);
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  margin-top: -10rpx;
}

.direction-indicator {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 100rpx;
  height: 100rpx;
}

.direction-text {
  position: absolute;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.direction-text.north { top: 0; left: 50%; transform: translateX(-50%); }
.direction-text.east { right: 0; top: 50%; transform: translateY(-50%); }
.direction-text.south { bottom: 0; left: 50%; transform: translateX(-50%); }
.direction-text.west { left: 0; top: 50%; transform: translateY(-50%); }

.control-panel {
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.control-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.control-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.control-icon.active {
  background: rgba(100, 181, 246, 0.3);
  border-color: #64b5f6;
}

.ar-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
}

.control-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.zoom-control {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.zoom-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 36rpx;
  color: #ffffff;
}

.zoom-slider {
  flex: 1;
}

.visible-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20rpx;
  display: block;
}

.visible-scroll {
  white-space: nowrap;
}

.visible-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 25rpx 30rpx;
  margin-right: 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.visible-time {
  font-size: 22rpx;
  color: #64b5f6;
  margin-bottom: 10rpx;
}

.visible-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.visible-name {
  font-size: 26rpx;
  color: #ffffff;
  margin-bottom: 5rpx;
}

.visible-direction {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}
</style>