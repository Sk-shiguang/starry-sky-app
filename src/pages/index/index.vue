<template>
  <view class="index-page">
    <StarBackground />
    
    <!-- 顶部欢迎区 -->
    <view class="header-section">
      <view class="greeting">
        <text class="greeting-title">{{ greeting }}</text>
        <text class="greeting-subtitle">{{ currentDate }}</text>
      </view>
      
      <view class="user-avatar" @click="goToLogin">
        <image 
          class="avatar-img" 
          :src="isLogin ? userInfo.avatar : '/static/images/default-avatar.png'" 
        />
        <view class="avatar-glow"></view>
      </view>
    </view>
    
    <!-- 核心功能：AI 攻略生成 -->
    <view class="hero-section">
      <view class="hero-card" @click="navigateTo('/pages/guide-generator/index')">
        <view class="hero-bg">
          <view class="gradient-orb orb-1"></view>
          <view class="gradient-orb orb-2"></view>
        </view>
        <view class="hero-content">
          <view class="hero-badge">
            <text class="badge-text">✨ AI 智能生成</text>
          </view>
          <text class="hero-title">一键生成专属攻略</text>
          <text class="hero-desc">输入目的地或美食，AI 为你定制详细旅游/探店攻略</text>
          <view class="hero-btn">
            <text class="btn-text">立即体验</text>
            <text class="btn-arrow">→</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 快捷功能 -->
    <view class="quick-section">
      <view class="quick-grid">
        <view class="quick-item glass-card" @click="navigateTo('/pages/guide-generator/index')">
          <view class="quick-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <text>✈️</text>
          </view>
          <text class="quick-name">旅游攻略</text>
        </view>
        <view class="quick-item glass-card" @click="navigateTo('/pages/guide-generator/index')">
          <view class="quick-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <text>🍜</text>
          </view>
          <text class="quick-name">美食探店</text>
        </view>
        <view class="quick-item glass-card" @click="navigateTo('/pages/my-guides/index')">
          <view class="quick-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <text>📚</text>
          </view>
          <text class="quick-name">我的攻略</text>
        </view>
        <view class="quick-item glass-card" @click="navigateTo('/pages/tools/index')">
          <view class="quick-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <text>🌌</text>
          </view>
          <text class="quick-name">天文工具</text>
        </view>
      </view>
    </view>
    
    <!-- 热门目的地 -->
    <view class="destinations-section">
      <view class="section-header">
        <text class="section-title">热门目的地</text>
        <text class="section-more" @click="navigateTo('/pages/guide-generator/index')">更多 →</text>
      </view>
      
      <scroll-view scroll-x class="destinations-scroll">
        <view 
          v-for="dest in hotDestinations" 
          :key="dest.name"
          class="destination-card"
          @click="goToGenerate(dest.name)"
        >
          <view class="destination-bg" :style="{ background: dest.gradient }">
            <text class="destination-icon">{{ dest.icon }}</text>
          </view>
          <text class="destination-name">{{ dest.name }}</text>
          <text class="destination-desc">{{ dest.desc }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 天文小工具 -->
    <view class="astro-section">
      <view class="section-header">
        <text class="section-title">天文观测</text>
      </view>
      
      <view class="astro-grid">
        <view class="astro-item glass-card" @click="navigateTo('/pages/starmap/index')">
          <view class="astro-icon-wrapper" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <text class="astro-icon">🌌</text>
          </view>
          <view class="astro-info">
            <text class="astro-name">实时星图</text>
            <text class="astro-desc">探索夜空奥秘</text>
          </view>
        </view>
        <view class="astro-item glass-card" @click="navigateTo('/pages/moon/index')">
          <view class="astro-icon-wrapper" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <text class="astro-icon">🌙</text>
          </view>
          <view class="astro-info">
            <text class="astro-name">月相查询</text>
            <text class="astro-desc">了解月亮变化</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 今日天文事件 -->
    <view class="events-section">
      <text class="section-title">今日天象</text>
      <view class="event-card glass-card">
        <view class="event-icon">🌙</view>
        <view class="event-info">
          <text class="event-title">{{ todayEvent.title }}</text>
          <text class="event-time">{{ todayEvent.time }}</text>
          <text class="event-desc">{{ todayEvent.desc }}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

// 用户信息
const isLogin = ref(false)
const userInfo = ref({
  avatar: '',
  nickname: ''
})

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，仰望星空'
  if (hour < 12) return '早安，追逐星光'
  if (hour < 18) return '午安，星空相伴'
  return '晚安，星河入梦'
})

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
})

// 热门目的地
const hotDestinations = [
  { name: '成都', icon: '🐼', desc: '美食之都', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' },
  { name: '三亚', icon: '🏖️', desc: '热带海滨', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { name: '丽江', icon: '🏔️', desc: '古城风情', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { name: '大理', icon: '🌸', desc: '风花雪月', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { name: '西安', icon: '🏛️', desc: '历史古都', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: '重庆', icon: '🌉', desc: '山城夜景', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' }
]

// 今日天象
const todayEvent = ref({
  title: '蛾眉月',
  time: '月出 10:23 · 月落 23:45',
  desc: '今晚可以观测到美丽的蛾眉月，适合拍摄月亮与行星的合影。'
})

// 导航方法
const goToLogin = () => {
  if (!isLogin.value) {
    uni.navigateTo({ url: '/pages/login/index' })
  } else {
    uni.navigateTo({ url: '/pages/user/index' })
  }
}

const navigateTo = (path: string) => {
  if (path === '/pages/tools/index') {
    uni.switchTab({ url: path })
  } else {
    uni.navigateTo({ url: path })
  }
}

const goToGenerate = (destination: string) => {
  uni.navigateTo({ 
    url: `/pages/guide-generator/index?keyword=${encodeURIComponent(destination)}`
  })
}

onMounted(() => {
  // 检查登录状态
  const token = uni.getStorageSync('token')
  if (token) {
    isLogin.value = true
    const savedUserInfo = uni.getStorageSync('userInfo')
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
  }
})
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 顶部欢迎区 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}

.greeting {
  display: flex;
  flex-direction: column;
}

.greeting-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.5);
  margin-bottom: 10rpx;
}

.greeting-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

.user-avatar {
  position: relative;
  width: 100rpx;
  height: 100rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(100, 181, 246, 0.5);
}

.avatar-glow {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
  filter: blur(20rpx);
  z-index: -1;
}

/* 核心功能区 */
.hero-section {
  margin-bottom: 40rpx;
}

.hero-card {
  position: relative;
  border-radius: 32rpx;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.25));
  border: 2rpx solid rgba(102, 126, 234, 0.4);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80rpx);
  opacity: 0.5;
}

.orb-1 {
  width: 400rpx;
  height: 400rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -150rpx;
  right: -100rpx;
}

.orb-2 {
  width: 300rpx;
  height: 300rpx;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -100rpx;
  left: -100rpx;
}

.hero-content {
  position: relative;
  padding: 50rpx;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30rpx;
  margin-bottom: 25rpx;
}

.badge-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}

.hero-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20rpx;
  display: block;
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.5);
}

.hero-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 35rpx;
  display: block;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  padding: 24rpx 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.4);
}

.btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  margin-right: 15rpx;
}

.btn-arrow {
  font-size: 32rpx;
  color: #ffffff;
}

/* 快捷功能 */
.quick-section {
  margin-bottom: 50rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24rpx 10rpx;
  text-align: center;
}

.quick-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  font-size: 42rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.quick-item:active .quick-icon {
  transform: scale(0.95);
}

.quick-name {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

/* 热门目的地 */
.destinations-section {
  margin-bottom: 50rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.3);
}

.section-more {
  font-size: 26rpx;
  color: #64b5f6;
}

.destinations-scroll {
  white-space: nowrap;
}

.destination-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  margin-right: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  min-width: 160rpx;
}

.destination-bg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15rpx;
}

.destination-icon {
  font-size: 50rpx;
}

.destination-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 5rpx;
}

.destination-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 天文观测 */
.astro-section {
  margin-bottom: 50rpx;
}

.astro-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.astro-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
}

.astro-icon-wrapper {
  width: 84rpx;
  height: 84rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.astro-icon {
  font-size: 42rpx;
  line-height: 1;
}

.astro-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.astro-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6rpx;
  display: block;
  line-height: 1.3;
}

.astro-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.3;
}

/* 天象区 */
.events-section {
  margin-bottom: 40rpx;
}

.event-card {
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.event-icon {
  font-size: 60rpx;
  line-height: 1;
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.event-time {
  font-size: 24rpx;
  color: #64b5f6;
  margin-bottom: 15rpx;
}

.event-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.bottom-space {
  height: 40rpx;
}
</style>
