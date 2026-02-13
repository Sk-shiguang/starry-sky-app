<template>
  <!-- 菜单卡片组件 -->
  <view class="menu-card" @click="handleCardClick">
    <!-- 菜品图标/emoji -->
    <view class="card-icon">{{ item.icon }}</view>

    <!-- 菜品名称 -->
    <view class="card-name">{{ item.name }}</view>

    <!-- 菜品信息 -->
    <view class="card-info">
      <view class="info-tag category-tag">{{ getCategoryLabel(item.category) }}</view>
      <view class="info-tag difficulty-tag">
        <text v-for="i in item.difficulty" :key="i">⭐</text>
      </view>
    </view>

    <!-- 卡片底部额外信息 -->
    <view v-if="showBadge && item.isTakeout" class="card-badge">🛵 可外卖</view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { FoodItem } from '../../api/menu';

interface Props {
  item: FoodItem;
  showBadge?: boolean; // 是否显示外卖徽章
}

const props = withDefaults(defineProps<Props>(), {
  showBadge: false
});

const emit = defineEmits<{
  click: [item: FoodItem];
}>();

// 分类名称映射
const categoryLabel: Record<string, string> = {
  chinese: '中餐',
  western: '西餐',
  japanese: '日料',
  korean: '韩料',
  simple: '简餐'
};

// 获取分类标签文本
const getCategoryLabel = (category: string): string => {
  return categoryLabel[category] || category;
};

// 处理卡片点击
const handleCardClick = () => {
  emit('click', props.item);
};
</script>

<style scoped>
.menu-card {
  /* Glass Card 毛玻璃风格 */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-height: 220rpx;
}

.menu-card:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.menu-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.15);
}

/* 菜品图标 */
.card-icon {
  font-size: 80rpx;
  line-height: 80rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

/* 菜品名称 */
.card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  max-width: 160rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 卡片信息 */
.card-info {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-top: 5rpx;
}

/* 信息标签 */
.info-tag {
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  color: #ffffff;
  background: rgba(102, 126, 234, 0.2);
  border: 1rpx solid rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.category-tag {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.difficulty-tag {
  background: transparent;
  border: none;
  padding: 0;
  gap: 2rpx;
  display: flex;
}

.difficulty-tag text {
  font-size: 18rpx;
}

/* 卡片徽章 */
.card-badge {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  font-size: 18rpx;
  background: rgba(240, 147, 251, 0.2);
  border: 1rpx solid rgba(240, 147, 251, 0.4);
  padding: 6rpx 10rpx;
  border-radius: 12rpx;
  color: #f093fb;
  font-weight: 600;
}
</style>
