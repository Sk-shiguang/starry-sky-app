<template>
  <view 
    class="page-transition" 
    :class="[transitionClass, { 'is-loading': isLoading }]"
    :style="transitionStyle"
  >
    <!-- 骨架屏加载层 -->
    <view v-if="showSkeleton && isLoading" class="skeleton-layer">
      <slot name="skeleton">
        <Skeleton v-bind="skeletonProps" />
      </slot>
    </view>
    
    <!-- 实际内容 -->
    <view 
      class="content-layer"
      :class="{ 'content-visible': !isLoading || contentReady }"
    >
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Skeleton from './Skeleton.vue'

interface Props {
  // 转场类型
  type?: 'fade' | 'slide-up' | 'slide-right' | 'scale' | 'none'
  // 动画持续时间(ms)
  duration?: number
  // 延迟时间(ms)
  delay?: number
  // 是否显示骨架屏
  showSkeleton?: boolean
  // 骨架屏配置
  skeletonProps?: {
    animated?: boolean
    showTitle?: boolean
    showParagraph?: boolean
    showCard?: boolean
    showGrid?: boolean
    showList?: boolean
    [key: string]: any
  }
  // 加载状态
  loading?: boolean
  // 页面名称(用于调试)
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'fade',
  duration: 400,
  delay: 0,
  showSkeleton: false,
  skeletonProps: () => ({ animated: true, showCard: true }),
  loading: false,
  name: ''
})

const emit = defineEmits<{
  enter: []
  enterComplete: []
  leave: []
  leaveComplete: []
}>()

// 内部状态
const isEntering = ref(true)
const isLeaving = ref(false)
const isLoading = ref(props.loading)
const contentReady = ref(false)

// 计算转场类名
const transitionClass = computed(() => {
  if (isLeaving.value) return `leave-${props.type}`
  if (isEntering.value) return `enter-${props.type}`
  return 'entered'
})

// 计算转场样式
const transitionStyle = computed(() => {
  return {
    transitionDuration: `${props.duration}ms`,
    transitionDelay: `${props.delay}ms`
  }
})

// 监听加载状态变化
watch(() => props.loading, (newVal) => {
  if (newVal) {
    isLoading.value = true
    contentReady.value = false
  } else {
    // 加载完成，先显示内容再移除骨架屏
    contentReady.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 100)
  }
})

// 页面进入动画
const startEnter = () => {
  isEntering.value = true
  emit('enter')
  
  setTimeout(() => {
    isEntering.value = false
    emit('enterComplete')
  }, props.duration + props.delay)
}

// 页面离开动画
const startLeave = () => {
  return new Promise<void>((resolve) => {
    isLeaving.value = true
    emit('leave')
    
    setTimeout(() => {
      isLeaving.value = false
      emit('leaveComplete')
      resolve()
    }, props.duration)
  })
}

// 设置加载完成
const setLoaded = () => {
  contentReady.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 100)
}

// 重新加载
const reload = () => {
  isLoading.value = true
  contentReady.value = false
}

onMounted(() => {
  startEnter()
  
  // 如果初始不是加载状态，自动标记内容就绪
  if (!props.loading) {
    setTimeout(() => {
      contentReady.value = true
    }, props.delay)
  }
})

defineExpose({
  startLeave,
  setLoaded,
  reload,
  isEntering: () => isEntering.value,
  isLeaving: () => isLeaving.value
})
</script>

<style scoped>
.page-transition {
  min-height: 100vh;
  position: relative;
}

/* ========== 淡入淡出 ========== */
.enter-fade {
  opacity: 0;
}

.entered,
.leave-fade {
  opacity: 1;
}

.leave-fade {
  opacity: 0;
}

/* ========== 向上滑入 ========== */
.enter-slide-up {
  opacity: 0;
  transform: translateY(40rpx);
}

.entered,
.leave-slide-up {
  opacity: 1;
  transform: translateY(0);
}

.leave-slide-up {
  opacity: 0;
  transform: translateY(-30rpx);
}

/* ========== 向右滑入 ========== */
.enter-slide-right {
  opacity: 0;
  transform: translateX(-50rpx);
}

.entered,
.leave-slide-right {
  opacity: 1;
  transform: translateX(0);
}

.leave-slide-right {
  opacity: 0;
  transform: translateX(50rpx);
}

/* ========== 缩放进入 ========== */
.enter-scale {
  opacity: 0;
  transform: scale(0.92);
}

.entered,
.leave-scale {
  opacity: 1;
  transform: scale(1);
}

.leave-scale {
  opacity: 0;
  transform: scale(1.05);
}

/* ========== 无动画 ========== */
.enter-none,
.leave-none {
  opacity: 1;
  transform: none;
}

/* ========== 过渡动画配置 ========== */
.page-transition {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ========== 骨架屏层 ========== */
.skeleton-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ========== 内容层 ========== */
.content-layer {
  opacity: 0;
  transform: translateY(10rpx);
  transition: all 0.3s ease;
}

.content-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
