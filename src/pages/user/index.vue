<template>
  <view class="user-page">
    <StarBackground />
    
    <!-- 用户信息卡片 -->
    <view class="user-card glass-card">
      <view class="user-info">
        <view class="avatar-section">
          <image 
            class="avatar" 
            :src="userInfo.avatar || '/static/images/default-avatar.png'" 
          />
          <view class="avatar-ring"></view>
        </view>
        
        <view class="info-section">
          <text class="nickname">{{ userInfo.nickname || '星空旅人' }}</text>
          
          <view class="user-tags">
            <view class="tag constellation-tag">
              <text class="tag-icon">♓</text>
              <text class="tag-text">{{ userInfo.constellation || '双鱼座' }}</text>
            </view>
            
            <view v-if="isVip" class="tag vip-tag">
              <text class="tag-icon">👑</text>
              <text class="tag-text">VIP</text>
            </view>
          </view>
        </view>
        
        <view class="edit-btn" @click="editProfile">
          <text class="edit-icon">✏️</text>
        </view>
      </view>
      
      <!-- 数据统计 -->
      <view class="stats-section">
        <view class="stat-item" @click="goToGuides">
          <text class="stat-value">{{ stats.guides }}</text>
          
          <text class="stat-label">我的攻略</text>
        </view>
        
        <view class="stat-item">
          <text class="stat-value">{{ stats.checkins }}</text>
          
          <text class="stat-label">连续签到</text>
        </view>
        
        <view class="stat-item">
          <text class="stat-value">{{ stats.tools }}</text>
          
          <text class="stat-label">使用工具</text>
        </view>
      </view>
    </view>
    
    <!-- VIP 卡片 -->
    <view v-if="!isVip" class="vip-card" @click="openVip">
      <view class="vip-bg"></view>
      
      <view class="vip-content">
        <view class="vip-left">
          <text class="vip-title">✨ 升级 VIP</text>
          
          <text class="vip-desc">解锁全部高级功能，畅享星空之旅</text>
        </view>
        
        <view class="vip-btn">
          <text class="vip-btn-text">立即开通</text>
        </view>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group glass-card">
        <view 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="menu-item"
          @click="handleMenuClick(item)"
        >
          <view class="menu-icon" :style="{ background: item.gradient }">
            <text class="icon-text">{{ item.icon }}</text>
          </view>
          
          <text class="menu-text">{{ item.name }}</text>
          
          <view class="menu-right">
            <text v-if="item.badge" class="badge">{{ item.badge }}</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 其他功能 -->
    <view class="menu-section">
      <view class="menu-group glass-card">
        <view 
          v-for="(item, index) in otherItems" 
          :key="index"
          class="menu-item"
          @click="handleMenuClick(item)"
        >
          <view class="menu-icon" :style="{ background: item.gradient }">
            <text class="icon-text">{{ item.icon }}</text>
          </view>
          
          <text class="menu-text">{{ item.name }}</text>
          
          <view class="menu-right">
            <text class="arrow">></text>
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
    
    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

// 用户状态
const isLogin = ref(false)
const isVip = ref(false)

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

// 菜单项
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
    name: '星座管理',
    icon: '♈',
    path: '',
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

const otherItems = [
  {
    name: '设置',
    icon: '⚙️',
    path: '',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    name: '帮助与反馈',
    icon: '❓',
    path: '',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    name: '关于我们',
    icon: 'ℹ️',
    path: '',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
]

// 编辑资料
const editProfile = () => {
  uni.showToast({ title: '编辑资料功能开发中', icon: 'none' })
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

/* 用户卡片 */
.user-card {
  padding: 40rpx;
  margin-top: 40rpx;
  margin-bottom: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-section {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  margin-right: 30rpx;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(100, 181, 246, 0.5);
}

.avatar-ring {
  position: absolute;
  top: -8rpx;
  left: -8rpx;
  right: -8rpx;
  bottom: -8rpx;
  border: 2rpx solid rgba(100, 181, 246, 0.3);
  border-radius: 50%;
  border-top-color: #64b5f6;
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.info-section {
  flex: 1;
}

.nickname {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15rpx;
  display: block;
}

.user-tags {
  display: flex;
  gap: 15rpx;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.constellation-tag {
  background: rgba(102, 126, 234, 0.2);
  border: 1rpx solid rgba(102, 126, 234, 0.4);
  color: #667eea;
}

.vip-tag {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #ffffff;
}

.tag-icon {
  font-size: 24rpx;
}

.tag-text {
  font-size: 22rpx;
}

.edit-btn {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.edit-icon {
  font-size: 32rpx;
}

/* 统计数据 */
.stats-section {
  display: flex;
  justify-content: space-around;
  padding-top: 30rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #64b5f6;
  text-shadow: 0 0 20rpx rgba(100, 181, 246, 0.3);
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* VIP卡片 */
.vip-card {
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.vip-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.3) 0%, rgba(254, 225, 64, 0.3) 100%);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.vip-content {
  position: relative;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10rpx;
  display: block;
}

.vip-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.vip-btn {
  padding: 15rpx 30rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 30rpx;
}

.vip-btn-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 菜单区 */
.menu-section {
  margin-bottom: 30rpx;
}

.menu-group {
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: rgba(255, 255, 255, 0.05);
}

.menu-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25rpx;
}

.icon-text {
  font-size: 36rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #ffffff;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.badge {
  min-width: 36rpx;
  height: 36rpx;
  background: #f5576c;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: #ffffff;
  padding: 0 10rpx;
}

.arrow {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 退出登录 */
.logout-section {
  margin-top: 40rpx;
}

.logout-btn {
  padding: 30rpx;
  text-align: center;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 16rpx;
  border: 1rpx solid rgba(245, 87, 108, 0.3);
}

.logout-text {
  font-size: 30rpx;
  color: #f5576c;
}

.bottom-space {
  height: 40rpx;
}
</style>