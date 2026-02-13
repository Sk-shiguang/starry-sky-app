<template>
  <view class="tools-page">
    <StarBackground />
    
    <!-- 页面标题 -->
    <view class="page-header" :style="headerStyle">
      <text class="page-title">探索工具</text>
      <text class="page-subtitle">发现更多有趣功能</text>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-bar glass-card" :style="searchStyle">
      <text class="search-icon">🔍</text>
      <input 
        class="search-input"
        type="text"
        placeholder="搜索工具..."
        placeholder-class="placeholder"
        v-model="searchKey"
        @focus="searchFocused = true"
        @blur="searchFocused = false"
      />
    </view>
    
    <!-- 核心功能：AI攻略 -->
    <view class="feature-section" :style="featureStyle">
      <view class="section-header">
        <text class="section-icon">✨</text>
        <text class="section-name">AI 攻略</text>
      </view>
      
      <!-- 主功能卡片 - 流光边框效果 -->
      <view 
        class="feature-card main-feature" 
        :class="{ 'card-pressed': pressedCard === 'main' }"
        @touchstart="pressedCard = 'main'"
        @touchend="pressedCard = ''"
        @click="openTool({path: '/pages/guide-generator/index', name: '智能攻略生成'})"
      >
        <view class="feature-bg">
          <view class="gradient-orb orb-1"></view>
          <view class="gradient-orb orb-2"></view>
        </view>
        <view class="feature-content">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">🤖</text>
          </view>
          <view class="feature-info">
            <text class="feature-title">智能攻略生成</text>
            <text class="feature-desc">输入目的地，AI 一键生成专属旅游/美食攻略</text>
          </view>
          <view class="feature-arrow">→</view>
        </view>
      </view>
      
      <!-- 子功能按钮组 -->
      <view class="sub-features">
        <view 
          class="sub-feature glass-card" 
          :class="{ 'card-pressed': pressedCard === 'guides' }"
          @touchstart="pressedCard = 'guides'"
          @touchend="pressedCard = ''"
          @click="openTool({path: '/pages/my-guides/index', name: '我的攻略'})"
        >
          <view class="sub-icon-wrapper" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <text class="sub-icon">📚</text>
          </view>
          <text class="sub-name">我的攻略</text>
        </view>
        <view 
          class="sub-feature glass-card"
          :class="{ 'card-pressed': pressedCard === 'menu' }"
          @touchstart="pressedCard = 'menu'"
          @touchend="pressedCard = ''"
          @click="openTool({path: '/pages/menu/index', name: '今天吃什么'})"
        >
          <view class="sub-icon-wrapper" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <text class="sub-icon">🍜</text>
          </view>
          <text class="sub-name">美食探店</text>
        </view>
      </view>
    </view>
    
    <!-- 天文观测分类 -->
    <view class="category-section" :style="astroStyle">
      <view class="category-header">
        <text class="category-icon">🔭</text>
        <text class="category-name">天文观测</text>
      </view>
      
      <view class="tools-grid">
        <view 
          v-for="(tool, index) in filteredAstroTools" 
          :key="tool.id"
          class="tool-card glass-card"
          :class="{ 'card-pressed': pressedCard === 'astro-' + tool.id }"
          :style="{ animationDelay: (0.3 + index * 0.05) + 's' }"
          @touchstart="pressedCard = 'astro-' + tool.id"
          @touchend="pressedCard = ''"
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
    
    <!-- 实用工具分类 -->
    <view class="category-section" :style="utilityStyle">
      <view class="category-header">
        <text class="category-icon">🛠️</text>
        <text class="category-name">实用工具</text>
      </view>
      
      <view class="tools-grid">
        <view 
          v-for="(tool, index) in filteredUtilityTools" 
          :key="tool.id"
          class="tool-card glass-card"
          :class="{ 'card-pressed': pressedCard === 'utility-' + tool.id }"
          :style="{ animationDelay: (0.4 + index * 0.05) + 's' }"
          @touchstart="pressedCard = 'utility-' + tool.id"
          @touchend="pressedCard = ''"
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
import { ref, computed, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

const searchKey = ref('')
const searchFocused = ref(false)
const pressedCard = ref('')

// 入场动画状态
const headerStyle = ref('opacity: 0; transform: translateY(30rpx) scale(0.9);')
const searchStyle = ref('opacity: 0; transform: translateY(30rpx) scale(0.9);')
const featureStyle = ref('opacity: 0; transform: translateY(30rpx) scale(0.9);')
const astroStyle = ref('opacity: 0; transform: translateY(30rpx) scale(0.9);')
const utilityStyle = ref('opacity: 0; transform: translateY(30rpx) scale(0.9);')

// 天文工具
const astroTools = ref([
  {
    id: 1,
    name: '实时星图',
    desc: 'AR星空导航',
    icon: '🌌',
    path: '/pages/starmap/index',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'astro'
  },
  {
    id: 2,
    name: '月相查询',
    desc: '月相日历',
    icon: '🌙',
    path: '/pages/moon/index',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'astro'
  }
])

// 实用工具
const utilityTools = ref([
  {
    id: 3,
    name: '日出日落',
    desc: 'golden hour时间',
    icon: '🌅',
    path: '',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    isNew: true,
    category: 'utility'
  },
  {
    id: 4,
    name: '光污染地图',
    desc: '观星地点推荐',
    icon: '🗺️',
    path: '',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    isNew: true,
    category: 'utility'
  },
  {
    id: 5,
    name: '天文日历',
    desc: '天象预告',
    icon: '📅',
    path: '',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    category: 'utility'
  },
  {
    id: 6,
    name: '空间站追踪',
    desc: 'ISS过境预报',
    icon: '🛰️',
    path: '',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'utility'
  }
])

// 搜索过滤
const filteredAstroTools = computed(() => {
  if (!searchKey.value) return astroTools.value
  return astroTools.value.filter(t => t.name.includes(searchKey.value) || t.desc.includes(searchKey.value))
})

const filteredUtilityTools = computed(() => {
  if (!searchKey.value) return utilityTools.value
  return utilityTools.value.filter(t => t.name.includes(searchKey.value) || t.desc.includes(searchKey.value))
})

// 打开工具
const openTool = (tool: any) => {
  if (!tool.path) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  uni.navigateTo({ url: tool.path })
}

// 入场动画序列
onMounted(() => {
  setTimeout(() => { headerStyle.value = 'transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 1; transform: translateY(0) scale(1);' }, 100)
  setTimeout(() => { searchStyle.value = 'transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 1; transform: translateY(0) scale(1);' }, 200)
  setTimeout(() => { featureStyle.value = 'transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 1; transform: translateY(0) scale(1);' }, 300)
  setTimeout(() => { astroStyle.value = 'transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 1; transform: translateY(0) scale(1);' }, 400)
  setTimeout(() => { utilityStyle.value = 'transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 1; transform: translateY(0) scale(1);' }, 500)
})
</script>

<style scoped>
.tools-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 玻璃卡片样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

/* 页面标题 */
.page-header {
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  will-change: opacity, transform;
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
  will-change: opacity, transform;
}

.search-bar:focus-within {
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.2), inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
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
  will-change: opacity, transform;
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

/* 主功能卡片 - 流光边框 */
.feature-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.main-feature {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border: 2rpx solid transparent;
  background-clip: padding-box;
  position: relative;
}

.main-feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24rpx;
  padding: 2rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(240, 147, 251, 0.8), rgba(102, 126, 234, 0.8));
  background-size: 200% 200%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-pressed {
  transform: scale(0.98) !important;
}

.feature-card:active {
  transform: translateY(-5rpx);
  box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.3);
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
  animation: orb-float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300rpx;
  height: 300rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -100rpx;
  right: -50rpx;
  animation-delay: 0s;
}

.orb-2 {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -50rpx;
  left: -50rpx;
  animation-delay: -3s;
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20rpx, -20rpx) scale(1.1); }
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
  animation: icon-breathe 3s ease-in-out infinite;
}

@keyframes icon-breathe {
  0%, 100% { box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 10rpx 40rpx rgba(102, 126, 234, 0.6); }
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
  animation: arrow-pulse 2s ease-in-out infinite;
}

@keyframes arrow-pulse {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(10rpx); opacity: 1; }
}

/* 子功能按钮组 */
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
  transition: all 0.3s ease;
}

.sub-feature:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.1);
}

.sub-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.3);
}

.sub-icon {
  font-size: 40rpx;
}

.sub-name {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 分类区 */
.category-section {
  margin-bottom: 40rpx;
  will-change: opacity, transform;
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
  transition: all 0.3s ease;
}

.tool-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
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
  transition: transform 0.3s ease;
}

.tool-card:active .tool-icon-wrapper {
  transform: scale(0.95);
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

/* NEW 角标 */
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
  animation: new-pulse 2s ease-in-out infinite;
}

@keyframes new-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.4); }
  50% { box-shadow: 0 0 10rpx 5rpx rgba(245, 87, 108, 0); }
}

.bottom-space {
  height: 40rpx;
}

/* 响应式适配 */
@media (min-width: 768rpx) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
