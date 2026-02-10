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
    
    <!-- 今日运势卡片 -->
    <view class="fortune-card glass-card">
      <view class="fortune-header">
        <text class="fortune-title">✨ 今日星运</text>
        <text class="fortune-constellation">{{ userInfo.constellation || '双鱼座' }}</text>
      </view>
      
      <view class="fortune-content">
        <view class="fortune-item">
          <text class="fortune-label">综合运势</text>
          <view class="fortune-stars">
            <text v-for="n in 5" :key="n" class="star-icon">{{ n <= fortune.overall ? '★' : '☆' }}</text>
          </view>
        </view>
        
        <view class="fortune-item">
          <text class="fortune-label">幸运色</text>
          <view class="lucky-color" :style="{ background: fortune.color }">
            <text class="color-name">{{ fortune.colorName }}</text>
          </view>
        </view>
        
        <view class="fortune-item">
          <text class="fortune-label">幸运数字</text>
          <text class="lucky-number">{{ fortune.number }}</text>
        </view>
      </view>
      
      <view class="fortune-advice">
        <text class="advice-text">💫 {{ fortune.advice }}</text>
      </view>
    </view>
    
    <!-- 核心功能入口 -->
    <view class="tools-section">
      <text class="section-title">星空工具箱</text>
      
      <view class="tools-grid">
        <view 
          v-for="tool in mainTools" 
          :key="tool.id"
          class="tool-item glass-card"
          @click="navigateTo(tool.path)"
        >
          <view class="tool-icon" :style="{ background: tool.gradient }">
            <text class="icon-text">{{ tool.icon }}</text>
          </view>
          <text class="tool-name">{{ tool.name }}</text>
          <text class="tool-desc">{{ tool.desc }}</text>
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
  nickname: '',
  constellation: '双鱼座'
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

// 今日运势
const fortune = ref({
  overall: 4,
  color: '#64b5f6',
  colorName: '星空蓝',
  number: 7,
  advice: '今日适合冥想静思，夜晚的星空会给你带来灵感。'
})

// 核心工具
const mainTools = [
  {
    id: 1,
    name: '星座运势',
    desc: '查看今日星运',
    icon: '♈',
    path: '/pages/constellation/index',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '实时星图',
    desc: '探索夜空奥秘',
    icon: '🌌',
    path: '/pages/starmap/index',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: '月相查询',
    desc: '了解月亮变化',
    icon: '🌙',
    path: '/pages/moon/index',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: '更多工具',
    desc: '探索全部功能',
    icon: '✨',
    path: '/pages/tools/index',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
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

/* 运势卡片 */
.fortune-card {
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.fortune-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.fortune-constellation {
  font-size: 26rpx;
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.15);
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}

.fortune-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.fortune-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fortune-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15rpx;
}

.fortune-stars {
  display: flex;
  gap: 8rpx;
}

.star-icon {
  font-size: 28rpx;
  color: #ffd700;
  text-shadow: 0 0 10rpx rgba(255, 215, 0, 0.5);
}

.lucky-color {
  width: 80rpx;
  height: 40rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20rpx rgba(100, 181, 246, 0.3);
}

.color-name {
  font-size: 20rpx;
  color: #ffffff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.lucky-number {
  font-size: 36rpx;
  font-weight: 700;
  color: #64b5f6;
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.5);
}

.fortune-advice {
  padding: 20rpx;
  background: rgba(100, 181, 246, 0.1);
  border-radius: 16rpx;
  border-left: 4rpx solid #64b5f6;
}

.advice-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

/* 工具区 */
.tools-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 30rpx;
  display: block;
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.3);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.tool-item {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}

.tool-item:active {
  transform: scale(0.98);
}

.tool-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.icon-text {
  font-size: 48rpx;
}

.tool-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.tool-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
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