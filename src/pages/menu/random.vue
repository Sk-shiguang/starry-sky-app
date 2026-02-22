<template>
  <PageTransition type="slide-up" :duration="400">
    <view class="random-page">
    <!-- 星轨背景 -->
    <view class="star-trails">
      <view class="trail trail-1"></view>
      <view class="trail trail-2"></view>
      <view class="trail trail-3"></view>
      <view v-for="(star, index) in stars" :key="index" class="star" :style="getStarStyle(index)"></view>
    </view>

    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 页面顶部导航 -->
      <view class="page-header">
        <button class="back-button" @click="goBack">←</button>
        <view class="page-title">今天吃什么</view>
        <view class="spacer"></view>
      </view>

      <!-- 转盘/骰子区域 -->
      <view class="wheel-container">
        <!-- 转盘指针 -->
        <view class="pointer"></view>

        <!-- 转盘动画区域 -->
        <view 
          :class="['wheel', { spinning: isSpinning }]"
          :style="getWheelStyle()"
          @click="handleWheelClick"
        >
          <!-- 8个扇形区域 -->
          <view v-for="(item, index) in wheelItems" :key="index" class="wheel-segment" :style="getSegmentStyle(index)">
            <view class="segment-icon">{{ item.icon }}</view>
            <view class="segment-name">{{ item.name }}</view>
          </view>

          <!-- 骰子中心 -->
          <view class="wheel-center">
            <view class="center-icon">🎲</view>
            <view class="center-text">{{ isSpinning ? '转中...' : '点我' }}</view>
          </view>
        </view>
      </view>

      <!-- 转盘标题文字 -->
      <view class="wheel-hint">
        {{ isSpinning ? '命运之轮在旋转...' : '点击转盘开始你的美食之旅' }}
      </view>

      <!-- 推荐结果展示区域 -->
      <view v-if="recommendedFood && !isSpinning" class="result-section">
        <!-- 推荐标题 -->
        <view class="result-title">
          🎉 今天命运的食物是...
        </view>

        <!-- 菜品卡片 -->
        <view class="food-result-card glass-card">
          <view class="result-icon">{{ recommendedFood.icon }}</view>
          <view class="result-name">{{ recommendedFood.name }}</view>
          <view class="result-info">
            <view class="info-item">
              <span class="info-label">分类:</span>
              <span class="info-value">{{ getCategoryLabel(recommendedFood.category) }}</span>
            </view>
            <view class="info-item">
              <span class="info-label">难度:</span>
              <span class="info-value">
                <text v-for="i in recommendedFood.difficulty" :key="i">⭐</text>
              </span>
            </view>
          </view>
        </view>

        <!-- 双路线选择按钮 -->
        <view class="choice-buttons">
          <button class="choice-btn btn-primary" @click="handleChooseCooking">
            👨‍🍳 自己做饭
          </button>
          <button class="choice-btn btn-secondary" @click="handleChooseTakeout">
            🛵 点外卖
          </button>
        </view>
      </view>

      <!-- 初始提示 -->
      <view v-else-if="!isSpinning && !recommendedFood" class="empty-hint">
        <view class="hint-emoji">🌟</view>
        <view class="hint-text">还没有推荐结果呢</view>
        <view class="hint-subtitle">点击上方转盘，让命运决定今天吃什么！</view>
      </view>
    </view>
  </view>
  </PageTransition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PageTransition from '@/components/PageTransition.vue';
import MenuAPI, { type FoodItem } from '../../api/menu';

// 数据状态
const isSpinning = ref(false);
const recommendedFood = ref<FoodItem | null>(null);
const wheelRotation = ref(0);
const stars = ref<any[]>(Array(15).fill(null));
const allFoodItems = ref<FoodItem[]>([]);

// 转盘显示的8个菜品类型
const wheelItems = computed(() => {
  const items = allFoodItems.value;
  const categories = ['chinese', 'western', 'japanese', 'korean', 'simple'];
  
  // 从各分类中获取一道菜品示例
  const wheelDisplay = categories.map(category => {
    const categoryItems = items.filter(item => item.category === category);
    return categoryItems.length > 0 ? categoryItems[0] : {
      id: category,
      name: getCategoryLabel(category),
      icon: getCategoryIcon(category),
      category,
      difficulty: 1,
      tags: [],
      isTakeout: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  // 补充到8个，如果菜品不足则重复
  while (wheelDisplay.length < 8) {
    const randomIndex = Math.floor(Math.random() * items.length);
    wheelDisplay.push(items[randomIndex]);
  }

  return wheelDisplay.slice(0, 8);
});

// 分类图标映射
const categoryIconMap: Record<string, string> = {
  chinese: '🍜',
  western: '🍝',
  japanese: '🍱',
  korean: '🥩',
  simple: '🥗'
};

// 分类名称映射
const categoryLabelMap: Record<string, string> = {
  chinese: '中餐',
  western: '西餐',
  japanese: '日料',
  korean: '韩料',
  simple: '简餐'
};

// 获取分类图标
const getCategoryIcon = (category: string): string => {
  return categoryIconMap[category] || '🍽️';
};

// 获取分类标签
const getCategoryLabel = (category: string): string => {
  return categoryLabelMap[category] || category;
};

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

// 获取转盘样式
const getWheelStyle = () => {
  return {
    transform: `rotate(${wheelRotation.value}deg)`
  };
};

// 获取扇形区域样式
const getSegmentStyle = (index: number) => {
  const rotation = (360 / 8) * index;
  return {
    transform: `rotate(${rotation}deg)`
  };
};

// 处理转盘点击
const handleWheelClick = async () => {
  if (isSpinning.value) return;
  if (allFoodItems.value.length === 0) {
    uni.showToast({
      title: '还没有配置菜品呢',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  isSpinning.value = true;
  recommendedFood.value = null;

  // 随机转盘，随机圈数 (2-4圈) + 随机角度 (0-360)
  const rounds = 2 + Math.random() * 2; // 2-4圈
  const randomAngle = Math.random() * 360;
  const totalRotation = rounds * 360 + randomAngle;

  // 更新转盘旋转角度 (使用过渡效果)
  wheelRotation.value = totalRotation;

  // 模拟转盘动画时长 2-3秒
  const duration = 2000 + Math.random() * 1000;
  
  await new Promise(resolve => setTimeout(resolve, duration));

  // 计算落在哪个菜品
  const normalizedAngle = randomAngle % 360;
  const segmentIndex = Math.floor(normalizedAngle / (360 / 8));
  const selectedWheelItem = wheelItems.value[segmentIndex];

  // 从所有菜品中随机选择该分类的菜品，或直接随机选择
  const random = MenuAPI.getRandom();
  if (random) {
    recommendedFood.value = random;
  }

  isSpinning.value = false;
};

// 选择自己做饭
const handleChooseCooking = () => {
  if (!recommendedFood.value) return;
  
  // 暂时显示提示（食谱详情页开发中）
  uni.showModal({
    title: '👨‍🍳 自己做饭',
    content: `${recommendedFood.value.name}\n\n食谱功能开发中，敬请期待！`,
    showCancel: false,
    confirmText: '我知道了',
    success: () => {
      // 稍后可以跳转到食谱详情页
    }
  });
};

// 选择点外卖
const handleChooseTakeout = () => {
  if (!recommendedFood.value) return;

  if (!recommendedFood.value.isTakeout) {
    uni.showToast({
      title: '这道菜不支持外卖呢',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  uni.showModal({
    title: '🛵 点外卖',
    content: `${recommendedFood.value.name}\n\n推荐商家功能开发中，敬请期待！\n\n您可以在美团、饿了么等平台搜索这道菜品。`,
    showCancel: false,
    confirmText: '我知道了',
    success: () => {
      // 稍后可以跳转到推荐商家列表
    }
  });
};

// 返回首页
const goBack = () => {
  uni.navigateBack();
};

// 初始化菜品数据
const initData = () => {
  MenuAPI.initDefaultItems();
  allFoodItems.value = MenuAPI.getAll();
};

onMounted(() => {
  initData();
  // 注册菜品更新监听
  uni.$on('menu-updated', initData);
});

onUnmounted(() => {
  uni.$off('menu-updated', initData);
});
</script>

<style scoped>
.random-page {
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
  display: flex;
  flex-direction: column;
}

/* 页面顶部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  gap: 20rpx;
}

.back-button {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.back-button:active {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  transform: scale(0.95);
}

.page-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
  text-align: center;
}

.spacer {
  width: 60rpx;
}

/* 转盘容器 */
.wheel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 40rpx 0;
  perspective: 1000px;
}

/* 转盘指针 */
.pointer {
  position: absolute;
  top: -30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20rpx solid transparent;
  border-right: 20rpx solid transparent;
  border-top: 30rpx solid rgba(255, 200, 100, 0.8);
  z-index: 10;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.3));
}

/* 转盘 */
.wheel {
  width: 500rpx;
  height: 500rpx;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    from 0deg,
    rgba(102, 126, 234, 0.3),
    rgba(240, 147, 251, 0.3),
    rgba(79, 172, 254, 0.3),
    rgba(245, 87, 108, 0.3),
    rgba(102, 126, 234, 0.3)
  );
  border: 3rpx solid rgba(102, 126, 234, 0.5);
  box-shadow: 
    0 0 40rpx rgba(102, 126, 234, 0.4),
    inset 0 0 40rpx rgba(255, 255, 255, 0.05);
  transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.wheel.spinning {
  transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.wheel:not(.spinning):hover {
  box-shadow: 
    0 0 60rpx rgba(102, 126, 234, 0.6),
    inset 0 0 40rpx rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

/* 转盘扇形区域 */
.wheel-segment {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  gap: 10rpx;
}

.segment-icon {
  font-size: 50rpx;
  line-height: 50rpx;
}

.segment-name {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-align: center;
  max-width: 60rpx;
  word-wrap: break-word;
}

/* 转盘中心 */
.wheel-center {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.4);
  z-index: 5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wheel:hover .wheel-center {
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.6);
}

.wheel:active .wheel-center {
  transform: translate(-50%, -50%) scale(0.98);
}

.center-icon {
  font-size: 50rpx;
  line-height: 50rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

.center-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 转盘提示文字 */
.wheel-hint {
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 30rpx;
  min-height: 30rpx;
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 推荐结果区域 */
.result-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25rpx;
  margin-top: 30rpx;
  animation: slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
}

/* 菜品结果卡片 */
.food-result-card {
  width: 100%;
  max-width: 400rpx;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  border: 1rpx solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1) !important;
}

.result-icon {
  font-size: 100rpx;
  line-height: 100rpx;
  animation: float 3s ease-in-out infinite;
}

.result-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  width: 100%;
  text-align: center;
}

.info-item {
  display: flex;
  justify-content: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.info-label {
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  color: #ffffff;
  font-weight: 600;
}

/* 选择按钮 */
.choice-buttons {
  display: flex;
  gap: 20rpx;
  width: 100%;
  max-width: 400rpx;
  margin-top: 20rpx;
}

.choice-btn {
  flex: 1;
  padding: 25rpx 30rpx;
  border-radius: 50rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: #ffffff !important;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3) !important;
}

.btn-primary:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4) !important;
}

.btn-secondary {
  background: transparent !important;
  border: 2rpx solid rgba(240, 147, 251, 0.5) !important;
  color: #ffffff !important;
}

.btn-secondary:active {
  background: rgba(240, 147, 251, 0.1) !important;
  border-color: rgba(240, 147, 251, 0.8) !important;
}

/* 空提示 */
.empty-hint {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.hint-emoji {
  font-size: 120rpx;
  opacity: 0.5;
  animation: float 4s ease-in-out infinite;
}

.hint-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.hint-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* Glass Card 通用样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  border: 1rpx solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1) !important;
}
</style>
