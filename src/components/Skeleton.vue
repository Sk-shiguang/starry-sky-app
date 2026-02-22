<template>
  <view class="skeleton" :class="{ animate: animated }">
    <!-- 标题骨架 -->
    <view v-if="showTitle" class="skeleton-title">
      <view class="skeleton-line" :style="{ width: titleWidth + '%' }"></view>
    </view>
    
    <!-- 段落骨架 -->
    <view v-if="showParagraph" class="skeleton-paragraph">
      <view 
        v-for="i in paragraphLines" 
        :key="i"
        class="skeleton-line"
        :style="{ width: getLineWidth(i) + '%' }"
      ></view>
    </view>
    
    <!-- 卡片骨架 -->
    <view v-if="showCard" class="skeleton-card">
      <view class="skeleton-header">
        <view class="skeleton-avatar"></view>
        <view class="skeleton-meta">
          <view class="skeleton-line" style="width: 40%"></view>
          <view class="skeleton-line" style="width: 60%"></view>
        </view>
      </view>
      <view class="skeleton-content">
        <view class="skeleton-line" style="width: 100%"></view>
        <view class="skeleton-line" style="width: 80%"></view>
        <view class="skeleton-line" style="width: 60%"></view>
      </view>
    </view>
    
    <!-- 网格骨架 -->
    <view v-if="showGrid" class="skeleton-grid">
      <view 
        v-for="i in gridCount" 
        :key="i"
        class="skeleton-grid-item"
      >
        <view class="skeleton-icon"></view>
        <view class="skeleton-text">
          <view class="skeleton-line" style="width: 70%"></view>
        </view>
      </view>
    </view>
    
    <!-- 列表骨架 -->
    <view v-if="showList" class="skeleton-list">
      <view 
        v-for="i in listCount" 
        :key="i"
        class="skeleton-list-item"
      >
        <view class="skeleton-thumb"></view>
        <view class="skeleton-info">
          <view class="skeleton-line" style="width: 70%"></view>
          <view class="skeleton-line" style="width: 50%"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  animated?: boolean
  showTitle?: boolean
  showParagraph?: boolean
  showCard?: boolean
  showGrid?: boolean
  showList?: boolean
  titleWidth?: number
  paragraphLines?: number
  gridCount?: number
  listCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  showTitle: false,
  showParagraph: false,
  showCard: false,
  showGrid: false,
  showList: false,
  titleWidth: 60,
  paragraphLines: 3,
  gridCount: 4,
  listCount: 4
})

const getLineWidth = (index: number) => {
  // 最后一行短一些，模拟自然段落
  if (index === props.paragraphLines) {
    return 40 + Math.random() * 30
  }
  return 90 + Math.random() * 10
}
</script>

<style scoped>
.skeleton {
  padding: 20rpx;
}

.skeleton-line {
  height: 16rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

.skeleton-title {
  margin-bottom: 30rpx;
}

.skeleton-title .skeleton-line {
  height: 40rpx;
  background: rgba(255, 255, 255, 0.15);
}

.skeleton-paragraph {
  margin-bottom: 30rpx;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.skeleton-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 20rpx;
}

.skeleton-meta {
  flex: 1;
}

.skeleton-content {
  padding-left: 100rpx;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.skeleton-grid-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skeleton-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 15rpx;
}

.skeleton-text {
  width: 100%;
  display: flex;
  justify-content: center;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  padding: 25rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
}

.skeleton-thumb {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 20rpx;
}

.skeleton-info {
  flex: 1;
}

/* 闪光动画效果 */
.skeleton.animate .skeleton-line,
.skeleton.animate .skeleton-avatar,
.skeleton.animate .skeleton-icon,
.skeleton.animate .skeleton-thumb {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>