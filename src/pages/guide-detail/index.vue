<template>
  <PageTransition type="slide-up" :duration="400" :show-skeleton="loading" :skeleton-props="skeletonProps">
    <view class="guide-detail-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 更多操作 -->
    <view class="more-btn" @click="showMoreActions">
      <text class="more-icon">⋮</text>
    </view>
    
    <!-- 攻略内容 -->
    <view v-if="guide" class="guide-content-wrapper">
      <view class="guide-header glass-card">
        <view class="header-type" :style="{ background: getTypeColor(guide.type) }">
          <text class="type-icon">{{ guide.type === 'travel' ? '✈️' : '🍜' }}</text>
          
          <text class="type-text">{{ guide.type === 'travel' ? '旅游攻略' : '美食探店' }}</text>
        </view>
        
        <text class="guide-title">{{ guide.content.title }}</text>
        
        <text class="guide-subtitle">{{ guide.content.subtitle }}</text>
        
        <view class="guide-meta-info">
          <text class="meta-item">📍 {{ guide.keyword }}</text>
          
          <text class="meta-item">📅 {{ formatDate(guide.createTime) }}</text>
        </view>
      </view>
      
      <view class="content-sections">
        <view 
          v-for="(section, index) in guide.content.sections" 
          :key="index"
          class="section-card glass-card"
        >
          <view class="section-header-row">
            <view class="section-number" :style="{ background: getTypeColor(guide.type) }">
              <text>{{ index + 1 }}</text>
            </view>
            
            <text class="section-title-text">{{ section.title }}</text>
          </view>
          
          <view class="section-body">
            <text v-if="section.content" class="section-content">{{ section.content }}</text>
            
            <view v-if="section.items" class="items-list">
              <view 
                v-for="(item, idx) in section.items" 
                :key="idx"
                class="list-item-row"
              >
                <view class="item-dot" :style="{ background: getTypeColor(guide.type) }"></view>
                
                <text class="item-text">{{ item }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 底部版权 -->
      <view class="guide-footer">
        <text class="footer-brand">🌌 星空 · 记录你的每一次旅行</text>
        
        <text class="footer-date">生成于 {{ formatFullDate(guide.createTime) }}</text>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-space"></view>
    </view>
    
    <!-- 底部操作栏 -->
    <view v-if="guide" class="bottom-actions">
      <view class="action-btn share" @click="shareGuide">
        <text class="btn-icon">📤</text>
        
        <text class="btn-label">分享</text>
      </view>
      
      <view class="action-btn primary" @click="exportGuide">
        <text class="btn-icon">💾</text>
        <text class="btn-label">导出</text>
      </view>
    </view>
  </view>
  </PageTransition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarBackground from '@/components/StarBackground.vue'
import PageTransition from '@/components/PageTransition.vue'

const guide = ref<any>(null)
const loading = ref(true)
const skeletonProps = {
  animated: true,
  showTitle: true,
  showParagraph: true,
  showCard: true,
  paragraphLines: 5
}

onMounted(() => {
  const currentGuide = uni.getStorageSync('currentGuide')
  if (currentGuide) {
    guide.value = currentGuide
    // 模拟加载延迟后隐藏骨架屏
    setTimeout(() => {
      loading.value = false
    }, 500)
  } else {
    uni.showToast({ title: '攻略不存在', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

const getTypeColor = (type: string) => {
  return type === 'travel' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
}

const formatDate = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatFullDate = (time: string) => {
  const date = new Date(time)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

const showMoreActions = () => {
  uni.showActionSheet({
    itemList: ['编辑', '导出为图片', '导出为文档', '删除'],
    itemColor: '#ffffff',
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          uni.showToast({ title: '编辑功能开发中', icon: 'none' })
          break
        case 1:
          exportAsImage()
          break
        case 2:
          exportAsDoc()
          break
        case 3:
          deleteGuide()
          break
      }
    }
  })
}

const shareGuide = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

const exportGuide = () => {
  uni.showActionSheet({
    itemList: ['导出为图片', '导出为文档'],
    success: (res) => {
      if (res.tapIndex === 0) {
        exportAsImage()
      } else {
        exportAsDoc()
      }
    }
  })
}

const exportAsImage = () => {
  uni.showLoading({ title: '生成图片中...' })
  
  // 模拟生成图片
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '图片已保存到相册', icon: 'success' })
  }, 2000)
}

const exportAsDoc = () => {
  uni.showLoading({ title: '生成文档中...' })
  
  // 模拟生成文档
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '文档已生成', icon: 'success' })
  }, 2000)
}

const deleteGuide = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这份攻略吗？删除后无法恢复。',
    confirmColor: '#f5576c',
    success: (res) => {
      if (res.confirm) {
        const guides = uni.getStorageSync('myGuides') || []
        const index = guides.findIndex((g: any) => g.id === guide.value.id)
        if (index > -1) {
          guides.splice(index, 1)
          uni.setStorageSync('myGuides', guides)
          uni.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      }
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.guide-detail-page {
  min-height: 100vh;
  padding: 40rpx 30rpx 160rpx;
  position: relative;
  z-index: 1;
}

.back-btn {
  position: fixed;
  top: 80rpx;
  left: 30rpx;
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.back-icon {
  font-size: 36rpx;
  color: #ffffff;
}

.more-btn {
  position: fixed;
  top: 80rpx;
  right: 30rpx;
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.more-icon {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
}

/* 攻略头部 */
.guide-header {
  margin-top: 120rpx;
  margin-bottom: 30rpx;
  padding: 40rpx;
  text-align: center;
}

.header-type {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 10rpx 25rpx;
  border-radius: 30rpx;
  margin-bottom: 30rpx;
}

.type-icon {
  font-size: 28rpx;
}

.type-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}

.guide-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.4;
  margin-bottom: 15rpx;
  display: block;
}

.guide-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25rpx;
  display: block;
}

.guide-meta-info {
  display: flex;
  justify-content: center;
  gap: 30rpx;
}

.meta-item {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 内容区 */
.content-sections {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.section-card {
  padding: 35rpx;
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 25rpx;
}

.section-number {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-number text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 700;
}

.section-title-text {
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
}

.section-body {
  padding-left: 70rpx;
}

.section-content {
  font-size: 29rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.9;
  white-space: pre-line;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.list-item-row {
  display: flex;
  gap: 15rpx;
  align-items: flex-start;
}

.item-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-top: 14rpx;
  flex-shrink: 0;
}

.item-text {
  font-size: 29rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  flex: 1;
}

/* 底部版权 */
.guide-footer {
  text-align: center;
  padding: 60rpx 0;
}

.footer-brand {
  font-size: 28rpx;
  color: #64b5f6;
  margin-bottom: 15rpx;
  display: block;
}

.footer-date {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

.bottom-space {
  height: 100rpx;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 40rpx;
  display: flex;
  gap: 20rpx;
  z-index: 10;
}

.action-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-label {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>