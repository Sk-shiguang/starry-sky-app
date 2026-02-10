<template>
  <view class="tools-page">
    <StarBackground />
    
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">星空工具箱</text>
      
      <text class="page-subtitle">探索宇宙的奥秘</text>
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
    
    <!-- 工具分类 -->
    <view class="tools-content">
      <view 
        v-for="category in filteredCategories" 
        :key="category.id"
        class="category-section"
      >
        <view class="category-header">
          <text class="category-icon">{{ category.icon }}</text>
          
          <text class="category-name">{{ category.name }}</text>
        </view>
        
        <view class="tools-grid">
          <view 
            v-for="tool in category.tools" 
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
    </view>
    
    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

const searchKey = ref('')

// 工具分类数据
const categories = [
  {
    id: 1,
    name: '星象观测',
    icon: '🔭',
    tools: [
      {
        id: 11,
        name: '实时星图',
        desc: 'AR星空导航',
        icon: '🌌',
        path: '/pages/starmap/index',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        isNew: false
      },
      {
        id: 12,
        name: '月相查询',
        desc: '月相日历',
        icon: '🌙',
        path: '/pages/moon/index',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        isNew: false
      },
      {
        id: 13,
        name: '日出日落',
        desc: 'golden hour时间',
        icon: '🌅',
        path: '',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        isNew: true
      },
      {
        id: 14,
        name: '星座识别',
        desc: '拍照识星座',
        icon: '📸',
        path: '',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        isNew: false
      }
    ]
  },
  {
    id: 2,
    name: '占星测算',
    icon: '✨',
    tools: [
      {
        id: 21,
        name: '星座运势',
        desc: '每日星运',
        icon: '♈',
        path: '/pages/constellation/index',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        isNew: false
      },
      {
        id: 22,
        name: '星盘分析',
        desc: '个人命盘',
        icon: '📊',
        path: '',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        isNew: false
      },
      {
        id: 23,
        name: '塔罗占卜',
        desc: 'AI塔罗解读',
        icon: '🃏',
        path: '',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        isNew: true
      },
      {
        id: 24,
        name: '八字测算',
        desc: '传统命理',
        icon: '☯️',
        path: '',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        isNew: false
      }
    ]
  },
  {
    id: 3,
    name: '实用工具',
    icon: '🛠️',
    tools: [
      {
        id: 31,
        name: '天文日历',
        desc: '天象预告',
        icon: '📅',
        path: '',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        isNew: false
      },
      {
        id: 32,
        name: '光污染地图',
        desc: '观星地点推荐',
        icon: '🗺️',
        path: '',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        isNew: true
      },
      {
        id: 33,
        name: '星空壁纸',
        desc: '每日天文美图',
        icon: '🖼️',
        path: '',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        isNew: false
      },
      {
        id: 34,
        name: '空间站追踪',
        desc: 'ISS过境预报',
        icon: '🛰️',
        path: '',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        isNew: false
      }
    ]
  },
  {
    id: 4,
    name: '生活服务',
    icon: '🌟',
    tools: [
      {
        id: 41,
        name: '攻略生成',
        desc: 'AI旅游美食攻略',
        icon: '📖',
        path: '/pages/guide-generator/index',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        isNew: true
      },
      {
        id: 42,
        name: '我的攻略',
        desc: '查看已保存攻略',
        icon: '📚',
        path: '/pages/my-guides/index',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        isNew: true
      }
    ]
  }
]

// 过滤后的分类
const filteredCategories = computed(() => {
  if (!searchKey.value) return categories
  
  return categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.name.includes(searchKey.value) || 
      tool.desc.includes(searchKey.value)
    )
  })).filter(cat => cat.tools.length > 0)
})

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

/* 工具内容 */
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