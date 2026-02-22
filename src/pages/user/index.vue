<template>
  <PageTransition type="fade" :duration="400">
    <view class="user-page">
    <StarBackground />
    
    <!-- 顶部发光背景 -->
    <view class="glow-bg">
      <view class="glow-orb orb-1"></view>
      <view class="glow-orb orb-2"></view>
      <view class="glow-orb orb-3"></view>
    </view>
    
    <!-- 用户头像区 - 3D悬浮效果 -->
    <view class="avatar-section">
      <view class="avatar-container">
        <view class="avatar-glow-ring"></view>
        <view class="avatar-glow-ring ring-2"></view>
        <view class="avatar-glow-ring ring-3"></view>
        <image 
          class="avatar" 
          :src="userInfo.avatar || '/static/images/default-avatar.png'" 
        />
        <view class="level-badge">
          <text class="level-text">Lv.{{ userLevel }}</text>
        </view>
      </view>
      
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname || '星空旅人' }}</text>
        <view class="user-tags">
          <view class="tag constellation-tag">
            <text class="tag-icon">♓</text>
            <text class="tag-text">{{ userInfo.constellation || '双鱼座' }}</text>
          </view>
          <view v-if="isVip" class="tag vip-tag pulse">
            <text class="tag-icon">👑</text>
            <text class="tag-text">VIP</text>
          </view>
        </view>
      </view>
      
      <view class="edit-btn" @click="editProfile">
        <text class="edit-icon">✏️</text>
      </view>
    </view>
    
    <!-- 经验进度条 -->
    <view class="exp-section">
      <view class="exp-bar-bg">
        <view class="exp-bar-fill" :style="{ width: expPercent + '%' }">
          <view class="exp-shine"></view>
          <!-- 星星碎片动画 -->
          <view class="exp-sparkles">
            <view class="exp-sparkle es1">✦</view>
            <view class="exp-sparkle es2">✧</view>
            <view class="exp-sparkle es3">✦</view>
            <view class="exp-sparkle es4">✧</view>
          </view>
        </view>
      </view>
      <view class="exp-text">
        <text class="exp-label">升级进度</text>
        <text class="exp-value">{{ currentExp }}/{{ nextLevelExp }} XP</text>
      </view>
    </view>
    
    <!-- 数据展示 - 霓虹灯效果 -->
    <view class="stats-grid">
      <view class="stat-card" @click="goToGuides">
        <view class="stat-glow"></view>
        <text class="stat-value neon-text">{{ stats.guides }}</text>
        <text class="stat-label">我的攻略</text>
      </view>
      <view class="stat-card">
        <view class="stat-glow pink"></view>
        <text class="stat-value neon-text pink">{{ stats.checkins }}</text>
        <text class="stat-label">连续签到</text>
      </view>
      <view class="stat-card">
        <view class="stat-glow cyan"></view>
        <text class="stat-value neon-text cyan">{{ stats.tools }}</text>
        <text class="stat-label">使用工具</text>
      </view>
    </view>
    
    <!-- VIP 卡片 - 流光效果 -->
    <view v-if="!isVip" class="vip-card" @click="openVip">
      <view class="vip-gradient"></view>
      <view class="vip-shine"></view>
      <view class="vip-content">
        <view class="vip-left">
          <text class="vip-title">✨ 升级 VIP</text>
          <text class="vip-desc">解锁 AI 无限生成、专属主题等特权</text>
        </view>
        <view class="vip-btn">
          <text class="vip-btn-text">立即开通</text>
        </view>
      </view>
    </view>
    
    <!-- 成就徽章墙 -->
    <view class="badges-section">
      <view class="section-header">
        <text class="section-title">🏆 成就徽章</text>
        <text class="section-more" @click="viewAllBadges">全部 ></text>
      </view>
      <scroll-view scroll-x class="badges-scroll">
        <view 
          v-for="(badge, index) in badges" 
          :key="index"
          class="badge-item"
          :class="{ unlocked: badge.unlocked }"
        >
          <view class="badge-icon-wrapper" :style="{ background: badge.gradient }">
            <text class="badge-icon">{{ badge.icon }}</text>
          </view>
          <text class="badge-name">{{ badge.name }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 功能菜单 - 3D悬浮卡片 -->
    <view class="menu-section">
      <view class="section-title">功能菜单</view>
      <view class="menu-grid">
        <view 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="menu-card"
          @click="handleMenuClick(item)"
        >
          <view class="menu-icon-wrapper" :style="{ background: item.gradient }">
            <text class="menu-icon">{{ item.icon }}</text>
          </view>
          <text class="menu-name">{{ item.name }}</text>
          <view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
        </view>
      </view>
    </view>
    
    <!-- 设置区 -->
    <view class="settings-section">
      <view class="settings-card">
        <view 
          v-for="(item, index) in settingsItems" 
          :key="index"
          class="settings-item"
          @click="handleMenuClick(item)"
        >
          <view class="settings-icon-wrapper" :style="{ background: item.gradient }">
            <text class="settings-icon">{{ item.icon }}</text>
          </view>
          <text class="settings-name">{{ item.name }}</text>
          <view class="settings-arrow">
            <text class="arrow-icon">›</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view v-if="isLogin" class="logout-section">
      <view class="logout-btn" @click="logout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
    
    <view class="bottom-space"></view>
  </view>
  </PageTransition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'
import PageTransition from '@/components/PageTransition.vue'

// 用户状态
const isLogin = ref(false)
const isVip = ref(false)
const userLevel = ref(5)
const currentExp = ref(850)
const nextLevelExp = ref(1000)

const expPercent = computed(() => Math.round((currentExp.value / nextLevelExp.value) * 100))

const userInfo = ref({
  avatar: '',
  nickname: '',
  constellation: '双鱼座'
})

// 统计数据
const stats = ref({
  guides: 0,
  checkins: 3,
  tools: 12
})

// 成就徽章
const badges = ref([
  { name: '初次探索', icon: '🚀', unlocked: true, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: '攻略达人', icon: '📝', unlocked: true, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { name: '星空观测', icon: '🔭', unlocked: true, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { name: '连续签到', icon: '📅', unlocked: false, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { name: '美食猎人', icon: '🍜', unlocked: false, gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { name: 'VIP会员', icon: '👑', unlocked: false, gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' }
])

// 功能菜单
const menuItems = [
  {
    name: '我的收藏',
    icon: '⭐',
    path: '',
    badge: 5,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    name: '我的攻略',
    icon: '📚',
    path: '/pages/my-guides/index',
    badge: 0,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    name: '旅行足迹',
    icon: '🗺️',
    path: '',
    badge: 0,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    name: '消息通知',
    icon: '🔔',
    path: '',
    badge: 2,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]

// 设置项
const settingsItems = [
  {
    name: '账号设置',
    icon: '⚙️',
    path: '',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    name: '主题换肤',
    icon: '🎨',
    path: '',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    name: '帮助与反馈',
    icon: '❓',
    path: '',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: '关于我们',
    icon: 'ℹ️',
    path: '',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
]

// 编辑资料
const editProfile = () => {
  uni.showToast({ title: '编辑资料功能开发中', icon: 'none' })
}

// 查看全部徽章
const viewAllBadges = () => {
  uni.showToast({ title: '成就系统开发中', icon: 'none' })
}

// 打开VIP
const openVip = () => {
  uni.showToast({ title: 'VIP功能开发中', icon: 'none' })
}

// 菜单点击
const handleMenuClick = (item: any) => {
  if (!item.path) {
    uni.showToast({ title: `${item.name}功能开发中`, icon: 'none' })
    return
  }
  uni.navigateTo({ url: item.path })
}

// 跳转到我的攻略
const goToGuides = () => {
  uni.navigateTo({ url: '/pages/my-guides/index' })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('myGuides')
        isLogin.value = false
        userInfo.value = {
          avatar: '',
          nickname: '',
          constellation: '双鱼座'
        }
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
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
  
  // 加载攻略数量
  const guides = uni.getStorageSync('myGuides') || []
  stats.value.guides = guides.length
})
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 顶部发光背景 */
.glow-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 600rpx;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100rpx);
  opacity: 0.4;
}

.orb-1 {
  width: 500rpx;
  height: 500rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -200rpx;
  right: -150rpx;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 400rpx;
  height: 400rpx;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 100rpx;
  left: -150rpx;
  animation: float 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300rpx;
  height: 300rpx;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 50rpx;
  right: 100rpx;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30rpx) scale(1.1); }
}

/* 头像区 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

.avatar-container {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-right: 30rpx;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.avatar-container:active .avatar {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* 升级版光环效果 - 呼吸+旋转 */
.avatar-glow-ring {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  border-top-color: #667eea;
  border-right-color: #764ba2;
  animation: rotate 4s linear infinite, ring-glow 3s ease-in-out infinite;
  z-index: 1;
}

.avatar-glow-ring.ring-2 {
  top: -20rpx;
  left: -20rpx;
  right: -20rpx;
  bottom: -20rpx;
  border-top-color: #f093fb;
  border-left-color: #f5576c;
  animation: rotate 6s linear infinite reverse, ring-glow 4s ease-in-out infinite 0.5s;
  opacity: 0.6;
}

/* 新增第三层光环 */
.avatar-glow-ring.ring-3 {
  top: -30rpx;
  left: -30rpx;
  right: -30rpx;
  bottom: -30rpx;
  border: 2rpx solid transparent;
  border-bottom-color: #4facfe;
  border-right-color: #00f2fe;
  animation: rotate 8s linear infinite, ring-glow 5s ease-in-out infinite 1s;
  opacity: 0.4;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.level-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  z-index: 3;
  box-shadow: 0 4rpx 15rpx rgba(245, 87, 108, 0.4);
}

.level-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 700;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15rpx;
  display: block;
  text-shadow: 0 0 30rpx rgba(100, 181, 246, 0.5);
}

.user-tags {
  display: flex;
  gap: 15rpx;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.constellation-tag {
  background: rgba(102, 126, 234, 0.2);
  border: 2rpx solid rgba(102, 126, 234, 0.4);
  color: #667eea;
}

.vip-tag {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #ffffff;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.4); }
  50% { box-shadow: 0 0 20rpx 10rpx rgba(245, 87, 108, 0); }
}

.edit-btn {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(10rpx);
}

.edit-icon {
  font-size: 32rpx;
}

/* 经验进度条 */
.exp-section {
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.exp-bar-bg {
  height: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  overflow: visible;
  margin-bottom: 12rpx;
  position: relative;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  border-radius: 8rpx;
  position: relative;
  transition: width 0.5s ease;
  overflow: visible;
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.4);
}

.exp-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shine 2s infinite;
}

/* 星星碎片溢出动画 */
.exp-sparkles {
  position: absolute;
  top: 50%;
  right: -10rpx;
  transform: translateY(-50%);
  pointer-events: none;
}

.exp-sparkle {
  position: absolute;
  font-size: 16rpx;
  color: #fee140;
  text-shadow: 0 0 10rpx #fee140;
  animation: sparkle-overflow 2s ease-in-out infinite;
}

.exp-sparkle.es1 { 
  top: -20rpx; 
  right: 0;
  animation-delay: 0s; 
}
.exp-sparkle.es2 { 
  top: -5rpx; 
  right: -15rpx;
  animation-delay: 0.3s; 
  font-size: 12rpx;
}
.exp-sparkle.es3 { 
  top: 5rpx; 
  right: 5rpx;
  animation-delay: 0.6s; 
}
.exp-sparkle.es4 { 
  top: 15rpx; 
  right: -10rpx;
  animation-delay: 0.9s; 
  font-size: 10rpx;
}

@keyframes sparkle-overflow {
  0%, 100% { 
    opacity: 0; 
    transform: translateY(0) scale(0) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: translateY(-10rpx) scale(1) rotate(180deg); 
  }
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.exp-text {
  display: flex;
  justify-content: space-between;
}

.exp-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.exp-value {
  font-size: 24rpx;
  color: #64b5f6;
  font-weight: 600;
}

/* 数据展示 - 霓虹灯效果 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 30rpx 20rpx;
  position: relative;
  overflow: hidden;
  text-align: center;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stat-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-glow.pink {
  background: radial-gradient(circle, rgba(245, 87, 108, 0.3) 0%, transparent 70%);
}

.stat-glow.cyan {
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%);
}

.stat-card:active .stat-glow {
  opacity: 1;
}

.neon-text {
  font-size: 48rpx;
  font-weight: 700;
  color: #667eea;
  text-shadow: 0 0 10rpx rgba(102, 126, 234, 0.5), 0 0 20rpx rgba(102, 126, 234, 0.3);
  display: block;
  margin-bottom: 10rpx;
}

.neon-text.pink {
  color: #f5576c;
  text-shadow: 0 0 10rpx rgba(245, 87, 108, 0.5), 0 0 20rpx rgba(245, 87, 108, 0.3);
}

.neon-text.cyan {
  color: #4facfe;
  text-shadow: 0 0 10rpx rgba(79, 172, 254, 0.5), 0 0 20rpx rgba(79, 172, 254, 0.3);
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* VIP卡片 - 流光效果 */
.vip-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.vip-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.4) 0%, rgba(254, 225, 64, 0.4) 100%);
}

.vip-shine {
  position: absolute;
  top: 0;
  left: -100%;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: vipShine 3s infinite;
}

@keyframes vipShine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.vip-content {
  position: relative;
  padding: 35rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10rpx;
  display: block;
  text-shadow: 0 0 20rpx rgba(255, 255, 255, 0.3);
}

.vip-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.vip-btn {
  padding: 18rpx 35rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border-radius: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}

.vip-btn-text {
  font-size: 26rpx;
  color: #f5576c;
  font-weight: 700;
}

/* 成就徽章 */
.badges-section {
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}

.section-more {
  font-size: 26rpx;
  color: #64b5f6;
}

.badges-scroll {
  white-space: nowrap;
}

.badge-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
  opacity: 0.4;
  transform: scale(0.9);
  transition: all 0.3s;
}

.badge-item.unlocked {
  opacity: 1;
  transform: scale(1);
  animation: fly-in 0.6s ease-out;
}

/* 解锁徽章的光效 */
.badge-item.unlocked .badge-icon-wrapper {
  animation: badge-glow 2s ease-in-out infinite;
  box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.3);
}

@keyframes badge-glow {
  0%, 100% { 
    box-shadow: 0 0 15rpx rgba(255, 255, 255, 0.2);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 30rpx rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
}

.badge-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.2);
}

.badge-icon {
  font-size: 48rpx;
}

.badge-name {
  font-size: 24rpx;
  color: #ffffff;
}

/* 功能菜单 */
.menu-section {
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.menu-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 30rpx 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s;
}

.menu-card:active {
  transform: translateY(-5rpx);
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon-wrapper {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}

.menu-icon {
  font-size: 42rpx;
}

.menu-name {
  font-size: 24rpx;
  color: #ffffff;
  text-align: center;
}

.menu-badge {
  position: absolute;
  top: 15rpx;
  right: 15rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #f5576c;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #ffffff;
  padding: 0 8rpx;
  font-weight: 600;
}

/* 设置区 */
.settings-section {
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

.settings-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  overflow: hidden;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-icon-wrapper {
  width: 60rpx;
  height: 60rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25rpx;
}

.settings-icon {
  font-size: 32rpx;
}

.settings-name {
  flex: 1;
  font-size: 30rpx;
  color: #ffffff;
}

.settings-arrow {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 退出登录 */
.logout-section {
  margin-top: 40rpx;
  position: relative;
  z-index: 1;
}

.logout-btn {
  padding: 30rpx;
  text-align: center;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 20rpx;
  border: 1rpx solid rgba(245, 87, 108, 0.3);
}

.logout-text {
  font-size: 30rpx;
  color: #f5576c;
  font-weight: 500;
}

.bottom-space {
  height: 60rpx;
}
</style>