<template>
  <view class="tools-page">
    <StarBackground />
    
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">探索工具</text>
      <text class="page-subtitle">发现更多有趣功能</text>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-bar glass-card">
      <text class="search-icon">🔍</text>
      <input 
        class="search-input"
        type="text"
        placeholder="搜索工具..."
        placeholder-class="placeholder"
        v-model="searchKey"
      />
    </view>
    
    <!-- 核心功能：攻略生成 -->
    <view class="feature-section">
      <view class="section-header">
        <text class="section-icon">✨</text>
        <text class="section-name">AI 攻略</text>
      </view>
      
      <view class="feature-card main-feature" @click="openTool({path: '/pages/guide-generator/index'})">
        <view class="feature-bg">
          <view class="gradient-orb orb-1"></view>
          <view class="gradient-orb orb-2"></view>
        </view>
        <view class="feature-content">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">🎯</text>
          </view>
          <view class="feature-info">
            <text class="feature-title">智能攻略生成</text>
            <text class="feature-desc">输入目的地，AI 一键生成专属旅游/美食攻略</text>
          </view>
          <view class="feature-arrow">→</view>
        </view>
      </view>
      
      <view class="sub-features">
        <view class="sub-feature glass-card" @click="openTool({path: '/pages/my-guides/index'})">
          <text class="sub-icon">📚</text>
          <text class="sub-name">我的攻略</text>
        </view>
        <view class="sub-feature glass-card" @click="openTool({path: '/pages/guide-generator/index'})">
          <text class="sub-icon">🍜</text>
          <text class="sub-name">美食探店</text>
        </view>
      </view>
    </view>
    
    <!-- 天文工具 -->
    <view class="category-section">
      <view class="category-header">
        <text class="category-icon">🔭</text>
        <text class="category-name">天文观测</text>
      </view>
      
      <view class="tools-grid">
        <view 
          v-for="tool in astroTools" 
          :key="tool.id"
          class="tool-card glass-card"
          @click="openTool(tool)"
        >
          <view class="tool-icon-wrapper" :style="{ background: tool.gradient }">
            <text class="tool-icon-text">{{ tool.icon }}</text>
          </view>
          <text class="tool-name">{{ tool.name }}</text>
          <text class="tool-desc">{{ tool.desc }}</text>
        </view>
      </view>
    </view>
    
    <!-- 实用工具 -->
    <view class="category-section">
      <view class="category-header">
        <text class="category-icon">🛠️</text>
        <text class="category-name">实用工具</text>
      </view>
      
      <view class="tools-grid">
        <view 
          v-for="tool in utilityTools" 
          :key="tool.id"
          class="tool-card glass-card"
          @click="openTool(tool)"
        >
          <view class="tool-icon-wrapper" :style="{ background: tool.gradient }">
            <text class="tool-icon-text">{{ tool.icon }}</text>
          </view>
          <text class="tool-name">{{ tool.name }}</text>
          <text class="tool-desc">{{ tool.desc }}</text>
          <view v-if="tool.isNew" class="new-badge">NEW</view>
        </view>
      </view>
    </view>
    
    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

const searchKey = ref('')

// 天文工具
const astroTools = [
  {
    id: 1,
    name: '实时星图',
    desc: 'AR星空导航',
    icon: '🌌',
    path: '/pages/starmap/index',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '月相查询',
    desc: '月相日历',
    icon: '🌙',
    path: '/pages/moon/index',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
]

// 实用工具
const utilityTools = [
  {
    id: 3,
    name: '日出日落',
    desc: 'golden hour时间',
    icon: '🌅',
    path: '',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    isNew: true
  },
  {
    id: 4,
    name: '光污染地图',
    desc: '观星地点推荐',
    icon: '🗺️',
    path: '',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    isNew: true
  },
  {
    id: 5,
    name: '天文日历',
    desc: '天象预告',
    icon: '📅',
    path: '',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 6,
    name: '空间站追踪',
    desc: 'ISS过境预报',
    icon: '🛰️',
    path: '',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
]

// 打开工具
const openTool = (tool: any) => {
  if (!tool.path) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  uni.navigateTo({ url: tool.path })
}
</script>

<style scoped>
.tools-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 页面标题 */
.page-header {
  margin-top: 60rpx;
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
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  margin-bottom: 40rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

.search-input {
  flex: 1;
  height: 60rpx;
  font-size: 30rpx;
  color: #ffffff;
}

.placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 核心功能区 */
.feature-section {
  margin-bottom: 50rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
}

.section-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
}

.section-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.feature-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.main-feature {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border: 2rpx solid rgba(102, 126, 234, 0.5);
}

.feature-bg {
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
  filter: blur(60rpx);
  opacity: 0.6;
}

.orb-1 {
  width: 300rpx;
  height: 300rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -100rpx;
  right: -50rpx;
}

.orb-2 {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -50rpx;
  left: -50rpx;
}

.feature-content {
  position: relative;
  display: flex;
  align-items: center;
  padding: 40rpx;
  z-index: 1;
}

.feature-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.4);
}

.feature-icon {
  font-size: 50rpx;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10rpx;
  display: block;
}

.feature-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.feature-arrow {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 子功能 */
.sub-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.sub-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
}

.sub-icon {
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.sub-name {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 分类区 */
.category-section {
  margin-bottom: 40rpx;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
}

.category-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
}

.category-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.tool-card {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s;
}

.tool-card:active {
  transform: scale(0.98);
}

.tool-icon-wrapper {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.tool-icon-text {
  font-size: 44rpx;
}

.tool-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.tool-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.new-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 10rpx;
  font-size: 18rpx;
  color: #ffffff;
  font-weight: 600;
}

.bottom-space {
  height: 40rpx;
}
</style>
