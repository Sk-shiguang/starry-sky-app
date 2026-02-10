<template>
  <view class="constellation-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 星座选择器 -->
    <view class="constellation-selector">
      <scroll-view scroll-x class="constellation-scroll">
        <view 
          v-for="c in constellations" 
          :key="c.id"
          class="constellation-item"
          :class="{ active: currentConstellation.id === c.id }"
          @click="selectConstellation(c)"
        >
          <text class="constellation-icon">{{ c.icon }}</text>
          
          <text class="constellation-name">{{ c.name }}</text>
          
          <text class="constellation-date">{{ c.date }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 今日运势卡片 -->
    <view class="fortune-card glass-card">
      <view class="card-header">
        <view class="header-left">
          <text class="card-title">今日运势</text>
          
          <text class="card-date">{{ today }}</text>
        </view>
        
        <view class="fortune-score">
          <text class="score-value">{{ fortune.total }}</text>
          
          <text class="score-label">总分</text>
        </view>
      </view>
      
      
      <view class="fortune-items">
        <view v-for="item in fortune.items" :key="item.name" class="fortune-row">
          <view class="fortune-label">
            <text class="label-icon">{{ item.icon }}</text>
            
            <text class="label-text">{{ item.name }}</text>
          </view>
          
          <view class="fortune-bar">
            <view class="bar-bg"></view>
            
            <view class="bar-fill" :style="{ width: item.value + '%', background: item.color }"></view>
          </view>
          
          <text class="fortune-value">{{ item.value }}%</text>
        </view>
      </view>
    </view>
    
    <!-- 幸运信息 -->
    <view class="lucky-section">
      <view class="lucky-grid">
        <view class="lucky-card glass-card">
          <text class="lucky-label">幸运数字</text>
          
          <view class="lucky-numbers">
            <text v-for="n in fortune.lucky.numbers" :key="n" class="lucky-number">{{ n }}</text>
          </view>
        </view>
        
        <view class="lucky-card glass-card">
          <text class="lucky-label">幸运颜色</text>
          
          <view class="lucky-colors">
            <view 
              v-for="c in fortune.lucky.colors" 
              :key="c.name"
              class="color-dot"
              :style="{ background: c.value }"
            >
              <view class="color-tooltip">{{ c.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 运势详解 -->
    <view class="detail-section">
      <view class="detail-card glass-card">
        <view class="detail-tabs">
          <view 
            v-for="tab in detailTabs" 
            :key="tab.key"
            class="detail-tab"
            :class="{ active: currentTab === tab.key }"
            @click="currentTab = tab.key"
          >
            <text class="tab-text">{{ tab.name }}</text>
          </view>
        </view>
        
        <view class="detail-content">
          <text class="detail-text">{{ currentDetail }}</text>
        </view>
      </view>
    </view>
    
    <!-- 分享按钮 -->
    <view class="share-section">
      <view class="share-btn star-btn star-btn-primary" @click="shareFortune">
        <text class="share-icon">📤</text>
        <text class="share-text">分享今日运势</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

// 星座数据
const constellations = [
  { id: 1, name: '白羊座', icon: '♈', date: '3.21-4.19', element: '火' },
  { id: 2, name: '金牛座', icon: '♉', date: '4.20-5.20', element: '土' },
  { id: 3, name: '双子座', icon: '♊', date: '5.21-6.21', element: '风' },
  { id: 4, name: '巨蟹座', icon: '♋', date: '6.22-7.22', element: '水' },
  { id: 5, name: '狮子座', icon: '♌', date: '7.23-8.22', element: '火' },
  { id: 6, name: '处女座', icon: '♍', date: '8.23-9.22', element: '土' },
  { id: 7, name: '天秤座', icon: '♎', date: '9.23-10.23', element: '风' },
  { id: 8, name: '天蝎座', icon: '♏', date: '10.24-11.22', element: '水' },
  { id: 9, name: '射手座', icon: '♐', date: '11.23-12.21', element: '火' },
  { id: 10, name: '摩羯座', icon: '♑', date: '12.22-1.19', element: '土' },
  { id: 11, name: '水瓶座', icon: '♒', date: '1.20-2.18', element: '风' },
  { id: 12, name: '双鱼座', icon: '♓', date: '2.19-3.20', element: '水' }
]

const currentConstellation = ref(constellations[11])

// 今日日期
const today = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

// 运势数据
const fortune = ref({
  total: 88,
  items: [
    { name: '综合运势', icon: '⭐', value: 88, color: '#667eea' },
    { name: '爱情运势', icon: '❤️', value: 92, color: '#f093fb' },
    { name: '事业学业', icon: '💼', value: 85, color: '#4facfe' },
    { name: '财富运势', icon: '💰', value: 80, color: '#43e97b' },
    { name: '健康指数', icon: '💪', value: 90, color: '#fa709a' }
  ],
  lucky: {
    numbers: [3, 7, 21],
    colors: [
      { name: '星空蓝', value: '#64b5f6' },
      { name: '梦幻紫', value: '#9c88ff' }
    ]
  }
})

// 详情标签
const detailTabs = [
  { name: '今日概述', key: 'overview' },
  { name: '爱情分析', key: 'love' },
  { name: '工作学习', key: 'career' },
  { name: '财富建议', key: 'wealth' }
]

const currentTab = ref('overview')

const details = {
  overview: '今日星象显示，月亮进入你的星座，带来充沛的情感能量。这是一个适合内省和规划的日子，你的直觉会特别敏锐。晚上适合与朋友聚会或独自冥想，星空会给你带来灵感。',
  love: '感情方面今日运势极佳。单身者可能在社交场合遇到有趣的人，已有伴侣的人适合安排浪漫约会。今晚的星空特别适合表白或求婚。',
  career: '工作上会有新的机会出现，保持开放的心态。创意类的工作今日会特别顺利。适合与同事头脑风暴，可能会有突破性的想法诞生。',
  wealth: '财运平稳，不适合大额投资，但小额理财可以尝试。今日可能会有意外的小收入。购物时留意蓝色系的物品，可能会带来好运。'
}

const currentDetail = computed(() => details[currentTab.value as keyof typeof details])

// 选择星座
const selectConstellation = (c: typeof constellations[0]) => {
  currentConstellation.value = c
  // 模拟切换星座后刷新运势
  fortune.value.total = Math.floor(Math.random() * 30) + 70
  fortune.value.items.forEach(item => {
    item.value = Math.floor(Math.random() * 30) + 70
  })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 分享
const shareFortune = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}
</script>

<style scoped>
.constellation-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding-bottom: 40rpx;
}

/* 返回按钮 */
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

/* 星座选择器 */
.constellation-selector {
  padding-top: 160rpx;
  margin-bottom: 30rpx;
}

.constellation-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.constellation-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 25rpx;
  margin: 0 10rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid transparent;
  transition: all 0.3s;
}

.constellation-item.active {
  background: rgba(100, 181, 246, 0.2);
  border-color: rgba(100, 181, 246, 0.5);
}

.constellation-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.constellation-name {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.constellation-date {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 运势卡片 */
.fortune-card {
  margin: 0 30rpx 30rpx;
  padding: 40rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40rpx;
}

.card-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10rpx;
  display: block;
}

.card-date {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.fortune-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border-radius: 20rpx;
}

.score-value {
  font-size: 56rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.5);
}

.score-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.fortune-items {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.fortune-row {
  display: flex;
  align-items: center;
}

.fortune-label {
  display: flex;
  align-items: center;
  width: 160rpx;
  gap: 10rpx;
}

.label-icon {
  font-size: 28rpx;
}

.label-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.fortune-bar {
  flex: 1;
  height: 16rpx;
  margin: 0 20rpx;
  position: relative;
}

.bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
}

.bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 8rpx;
  transition: width 0.5s ease;
  box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.3);
}

.fortune-value {
  width: 70rpx;
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}

/* 幸运信息 */
.lucky-section {
  margin: 0 30rpx 30rpx;
}

.lucky-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.lucky-card {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lucky-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20rpx;
}

.lucky-numbers {
  display: flex;
  gap: 20rpx;
}

.lucky-number {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.4);
}

.lucky-colors {
  display: flex;
  gap: 20rpx;
}

.color-dot {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 15rpx rgba(0, 0, 0, 0.3);
  position: relative;
}

.color-tooltip {
  position: absolute;
  bottom: -40rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

/* 详情区 */
.detail-section {
  margin: 0 30rpx 30rpx;
}

.detail-card {
  padding: 30rpx;
}

.detail-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
  overflow-x: auto;
}

.detail-tab {
  padding: 15rpx 25rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.detail-tab.active {
  background: rgba(100, 181, 246, 0.3);
}

.tab-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.detail-tab.active .tab-text {
  color: #ffffff;
  font-weight: 500;
}

.detail-content {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
}

.detail-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

/* 分享区 */
.share-section {
  margin: 0 30rpx;
}

.share-btn {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
}

.share-icon {
  font-size: 36rpx;
}

.share-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>