<template>
  <view class="menu-page">
    <!-- 星轨背景 -->
    <view class="star-trails">
      <view class="trail trail-1"></view>
      <view class="trail trail-2"></view>
      <view class="trail trail-3"></view>
      <view v-for="(star, index) in stars" :key="index" class="star" :style="getStarStyle(index)"></view>
    </view>

    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 页面标题 -->
      <view class="page-title">🍽️ 今天吃什么</view>

      <!-- 今日推荐卡片 -->
      <view class="recommend-card glass-card" @click="goToRandom">
        <view class="recommend-inner">
          <view class="recommend-emoji">🎲</view>
          <view class="recommend-text">
            <view class="recommend-title">不知道吃什么？</view>
            <view class="recommend-subtitle">点我试试今日运气</view>
          </view>
          <view class="recommend-arrow">→</view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions">
        <button class="action-button glass-card" @click="goToConfig">
          <view class="action-icon">📝</view>
          <view class="action-label">配置菜单</view>
        </button>
        <button class="action-button glass-card" @click="goToRandom">
          <view class="action-icon">🎲</view>
          <view class="action-label">随机选</view>
        </button>
      </view>

      <!-- 菜单统计 -->
      <view class="menu-stat glass-card">
        <view class="stat-content">
          <view class="stat-icon">📊</view>
          <view class="stat-text">
            <view class="stat-number">{{ totalCount }}</view>
            <view class="stat-label">道菜品</view>
          </view>
        </view>
      </view>

      <!-- 菜品网格展示 -->
      <view v-if="items.length > 0" class="menu-section">
        <view class="section-title">我的菜单</view>
        <view class="menu-grid">
          <MenuCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :show-badge="true"
            @click="handleItemClick"
          />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <view class="empty-icon">🍽️</view>
        <view class="empty-text">还没有配置菜品呢</view>
        <button class="empty-btn btn-primary" @click="goToConfig">
          现在就去配置 →
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import MenuAPI, { type FoodItem } from '../../api/menu';
import MenuCard from './components/MenuCard.vue';

// 数据状态
const items = ref<FoodItem[]>([]);
const stars = ref<any[]>(Array(15).fill(null)); // 15颗星星

// 计算菜品总数
const totalCount = computed(() => {
  return items.value.length;
});

// 生成随机星星样式
const getStarStyle = (index: number) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;
  const randomDelay = Math.random() * 2;

  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animation: `twinkle ${randomDuration}s ease-in-out ${randomDelay}s infinite`
  };
};

// 刷新菜品列表
const refreshItems = () => {
  items.value = MenuAPI.getAll();
};

// 导航到配置页
const goToConfig = () => {
  uni.navigateTo({ url: '/pages/menu/config' });
};

// 导航到随机推荐页
const goToRandom = () => {
  uni.navigateTo({ url: '/pages/menu/random' });
};

// 处理菜品点击，进入点餐页
const handleItemClick = (item: FoodItem) => {
  uni.navigateTo({ url: '/pages/menu/order' });
};

// 监听页面显示（返回时刷新）
const onShow = () => {
  refreshItems();
};

onMounted(() => {
  // 初始化菜品数据
  MenuAPI.initDefaultItems();
  refreshItems();
  // 注册页面显示监听
  uni.$on('menu-updated', onShow);
});

onUnmounted(() => {
  // 清理监听
  uni.$off('menu-updated', onShow);
});
</script>

<style scoped>
.menu-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #141e61, #511ea2);
  overflow: hidden;
}

/* 星轨背景 */
.star-trails {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.trail {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
}

.trail-1 {
  width: 350rpx;
  height: 350rpx;
  background: radial-gradient(circle, #667eea 0%, transparent 70%);
  top: 5%;
  left: 5%;
  animation: float 15s ease-in-out infinite;
}

.trail-2 {
  width: 450rpx;
  height: 450rpx;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  bottom: 10%;
  right: 10%;
  animation: float 20s ease-in-out infinite reverse;
}

.trail-3 {
  width: 300rpx;
  height: 300rpx;
  background: radial-gradient(circle, #4facfe 0%, transparent 70%);
  top: 50%;
  right: 2%;
  animation: float 25s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(80rpx); }
}

/* 星星闪烁 */
.star {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* 页面内容 */
.page-content {
  position: relative;
  z-index: 1;
  padding: 30rpx;
  min-height: 100vh;
}

/* 页面标题 */
.page-title {
  font-size: 56rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 40rpx;
  text-align: center;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes fly-in {
  0% {
    opacity: 0;
    transform: translateY(30rpx) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 今日推荐卡片 */
.recommend-card {
  margin-bottom: 40rpx;
  cursor: pointer;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s backwards;
}

.recommend-inner {
  display: flex;
  align-items: center;
  gap: 25rpx;
  padding: 35rpx;
}

.recommend-emoji {
  font-size: 80rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15rpx); }
}

.recommend-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.recommend-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}

.recommend-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.recommend-arrow {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.6);
  animation: arrow-move 2s ease-in-out infinite;
}

@keyframes arrow-move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10rpx); }
}

.recommend-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.3) !important;
  border-color: rgba(102, 126, 234, 0.4) !important;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.action-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 25rpx;
  border: none;
  background: transparent;
  cursor: pointer;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s backwards;
}

.action-icon {
  font-size: 48rpx;
}

.action-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.action-button:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.25) !important;
  border-color: rgba(102, 126, 234, 0.3) !important;
}

/* 菜单统计 */
.menu-stat {
  margin-bottom: 40rpx;
  padding: 25rpx;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s backwards;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.stat-icon {
  font-size: 48rpx;
}

.stat-text {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 菜单区域 */
.menu-section {
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s backwards;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 25rpx;
}

/* 菜品网格 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;
  text-align: center;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s backwards;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30rpx;
}

.empty-btn {
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Glass Card 样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  border: 1rpx solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1) !important;
}

/* 主按钮 */
.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: #ffffff !important;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3) !important;
  border: none !important;
}

.btn-primary:hover {
  transform: translateY(-3rpx);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4) !important;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 44rpx;
  }

  .recommend-inner {
    padding: 25rpx;
  }
}
</style>
