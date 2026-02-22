<template>
  <PageTransition type="slide-up" :duration="400">
    <view class="order-page">
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
        <view class="page-title">智能点餐</view>
        <view class="spacer"></view>
      </view>

      <!-- 用餐人数选择 -->
      <view class="section">
        <view class="section-title">选择用餐人数</view>
        <view class="people-selector">
          <button 
            v-for="(count, index) in [1, 2, 3]"
            :key="index"
            :class="['people-btn', { active: peopleCount === count }]"
            @click="peopleCount = count"
          >
            {{ count }}人
          </button>
          <button 
            :class="['people-btn', { active: peopleCount === 4 }]"
            @click="peopleCount = 4"
          >
            3+人
          </button>
        </view>
      </view>

      <!-- 菜品选择区域 -->
      <view class="section">
        <view class="section-title">选择菜品 ({{ selectedItems.length }}道)</view>
        
        <!-- 分类筛选 -->
        <view class="category-filter">
          <button 
            v-for="cat in categories"
            :key="cat.value"
            :class="['filter-btn', { active: selectedCategory === cat.value }]"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </view>

        <!-- 菜品网格 -->
        <view v-if="filteredItems.length > 0" class="food-grid">
          <view 
            v-for="item in filteredItems"
            :key="item.id"
            :class="['food-item', { selected: isItemSelected(item.id) }]"
            @click="toggleItem(item)"
          >
            <view class="item-icon">{{ item.icon }}</view>
            <view class="item-name">{{ item.name }}</view>
            <view class="item-badge">
              {{ isItemSelected(item.id) ? '✓' : '+' }}
            </view>
            <view v-if="isItemSelected(item.id)" class="selected-mark">已选</view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="empty-state">
          <view class="empty-icon">🔍</view>
          <view class="empty-text">没有找到菜品</view>
        </view>
      </view>

      <!-- 已选菜品清单 (浮动区域) -->
      <view v-if="selectedItems.length > 0" class="floating-cart">
        <view class="cart-header">
          <view class="cart-title">已选菜品 ({{ selectedItems.length }})</view>
          <button class="clear-btn" @click="clearSelection">清空</button>
        </view>

        <!-- 已选菜品列表 -->
        <view class="cart-items">
          <view v-for="item in selectedItems" :key="item.id" class="cart-item">
            <view class="cart-item-info">
              <view class="cart-item-name">{{ item.name }}</view>
              <view class="cart-item-count">数量: {{ item.quantity }}</view>
            </view>
            <view class="cart-item-controls">
              <button class="quantity-btn" @click="decreaseQuantity(item.id)">−</button>
              <view class="quantity-display">{{ item.quantity }}</view>
              <button class="quantity-btn" @click="increaseQuantity(item.id)">+</button>
            </view>
          </view>
        </view>

        <!-- 确认按钮 -->
        <button class="confirm-btn btn-primary" @click="confirmOrder">
          确认点餐 ({{ totalItems }}道)
        </button>
      </view>

      <!-- 空状态提示 -->
      <view v-else class="order-empty">
        <view class="empty-hint-emoji">🛒</view>
        <view class="empty-hint-text">还没有选择菜品呢</view>
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
const peopleCount = ref(1);
const selectedCategory = ref('all');
const allFoodItems = ref<FoodItem[]>([]);
const selectedItems = ref<Array<{ id: string; name: string; icon: string; quantity: number }>>([]);
const stars = ref<any[]>(Array(15).fill(null));

// 分类列表
const categories = [
  { label: '全部', value: 'all' },
  { label: '中餐', value: 'chinese' },
  { label: '西餐', value: 'western' },
  { label: '日料', value: 'japanese' },
  { label: '韩料', value: 'korean' },
  { label: '简餐', value: 'simple' }
];

// 计算筛选后的菜品列表
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return allFoodItems.value;
  }
  return allFoodItems.value.filter(item => item.category === selectedCategory.value);
});

// 计算总菜品数量
const totalItems = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// 检查菜品是否已选中
const isItemSelected = (itemId: string): boolean => {
  return selectedItems.value.some(item => item.id === itemId);
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

// 切换菜品选中状态
const toggleItem = (item: FoodItem) => {
  const existingIndex = selectedItems.value.findIndex(i => i.id === item.id);

  if (existingIndex > -1) {
    // 已选中，则移除
    selectedItems.value.splice(existingIndex, 1);
  } else {
    // 未选中，则添加
    selectedItems.value.push({
      id: item.id,
      name: item.name,
      icon: item.icon,
      quantity: 1
    });
  }
};

// 增加菜品数量
const increaseQuantity = (itemId: string) => {
  const item = selectedItems.value.find(i => i.id === itemId);
  if (item) {
    item.quantity++;
  }
};

// 减少菜品数量
const decreaseQuantity = (itemId: string) => {
  const item = selectedItems.value.find(i => i.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      // 数量为1时，移除该菜品
      const index = selectedItems.value.findIndex(i => i.id === itemId);
      selectedItems.value.splice(index, 1);
    }
  }
};

// 清空所有选中菜品
const clearSelection = () => {
  uni.showModal({
    title: '确认清空',
    content: '是否清空已选菜品？',
    confirmText: '清空',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        selectedItems.value = [];
      }
    }
  });
};

// 确认点餐
const confirmOrder = () => {
  const orderContent = selectedItems.value
    .map(item => `${item.name} x ${item.quantity}`)
    .join('\n');

  uni.showModal({
    title: '📋 确认点餐',
    content: `用餐人数: ${peopleCount.value}人\n\n${orderContent}`,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 清空选择并显示成功提示
        selectedItems.value = [];
        uni.showToast({
          title: '点餐成功！',
          icon: 'success',
          duration: 2000
        });

        // 1.5秒后返回首页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    }
  });
};

// 返回上一页
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
.order-page {
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
  padding-bottom: 350rpx;
  min-height: 100vh;
}

/* 页面顶部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  gap: 20rpx;
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

/* 区域容器 */
.section {
  margin-bottom: 40rpx;
  animation: fly-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.section:nth-child(2) {
  animation-delay: 0.1s;
}

.section:nth-child(3) {
  animation-delay: 0.2s;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20rpx;
}

/* 用餐人数选择器 */
.people-selector {
  display: flex;
  gap: 15rpx;
  flex-wrap: wrap;
}

.people-btn {
  flex: 1;
  min-width: 80rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.people-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: rgba(102, 126, 234, 0.8);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.people-btn:active {
  transform: scale(0.95);
}

/* 分类筛选 */
.category-filter {
  display: flex;
  gap: 10rpx;
  margin-bottom: 25rpx;
  overflow-x: auto;
  padding-bottom: 10rpx;
}

.filter-btn {
  padding: 12rpx 25rpx;
  border-radius: 25rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-size: 22rpx;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: rgba(102, 126, 234, 0.8);
  color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

/* 菜品网格 */
.food-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

/* 菜品项目 */
.food-item {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 25rpx 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200rpx;
}

.food-item:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.food-item.selected {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 30rpx rgba(102, 126, 234, 0.3);
}

.item-icon {
  font-size: 70rpx;
  line-height: 70rpx;
  animation: float 3s ease-in-out infinite;
}

.item-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  max-width: 120rpx;
  word-break: break-all;
  line-height: 1.2;
}

.item-badge {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
}

.selected-mark {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  background: rgba(79, 172, 254, 0.8);
  color: #ffffff;
  padding: 6rpx 10rpx;
  border-radius: 10rpx;
  font-size: 18rpx;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80rpx 30rpx;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 15rpx;
  opacity: 0.4;
}

.empty-text {
  font-size: 26rpx;
}

.order-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.empty-hint-emoji {
  font-size: 100rpx;
  opacity: 0.4;
  margin-bottom: 20rpx;
}

.empty-hint-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 浮动购物车 */
.floating-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(20, 30, 97, 0.95), rgba(81, 30, 162, 0.95));
  backdrop-filter: blur(10px);
  border-top: 2rpx solid rgba(102, 126, 234, 0.3);
  border-radius: 32rpx 32rpx 0 0;
  padding: 30rpx;
  max-height: 350rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.4);
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.cart-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
}

.clear-btn {
  padding: 8rpx 16rpx;
  background: transparent;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 15rpx;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:active {
  background: rgba(245, 87, 108, 0.2);
  border-color: rgba(245, 87, 108, 0.5);
  color: #f5576c;
}

/* 购物车项目列表 */
.cart-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.cart-item-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
}

.cart-item-count {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.6);
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 20rpx;
  padding: 5rpx 10rpx;
}

.quantity-btn {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  border: none;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.quantity-btn:active {
  transform: scale(0.9);
}

.quantity-display {
  width: 30rpx;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 20rpx;
}

/* 确认按钮 */
.confirm-btn {
  width: 100%;
  padding: 25rpx;
  border-radius: 25rpx;
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: #ffffff !important;
  font-size: 26rpx;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease;
}

.confirm-btn:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4) !important;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .food-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .food-grid {
    grid-template-columns: 1fr;
  }

  .floating-cart {
    max-height: 300rpx;
  }

  .page-content {
    padding-bottom: 320rpx;
  }
}
</style>
