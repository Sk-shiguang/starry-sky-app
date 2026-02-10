<template>
  <view class="guide-generator-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack"
>
      <text class="back-icon">←</text>
    </view>
    
    <!-- 页面标题 -->
    <view class="page-header"
>
      <text class="page-title">AI 攻略生成</text>
      
      <text class="page-subtitle">输入目的地或美食，一键生成专属攻略</text>
    </view>
    
    <!-- 输入区域 -->
    <view class="input-section glass-card"
>
      <view class="input-tabs"
>
        <view 
          class="tab-item" 
          :class="{ active: guideType === 'travel' }"
          @click="guideType = 'travel'"
        >
          <text class="tab-icon">✈️</text>
          
          <text class="tab-text">旅游攻略</text>
        </view>
        
        <view 
          class="tab-item" 
          :class="{ active: guideType === 'food' }"
          @click="guideType = 'food'"
        >
          <text class="tab-icon">🍜</text>
          
          <text class="tab-text">美食探店</text>
        </view>
      </view>
      
      <view class="input-area"
>
        <text class="input-label">{{ guideType === 'travel' ? '想去哪里玩？' : '想吃什么？' }}</text>
        
        <input 
          class="keyword-input"
          type="text"
          :placeholder="guideType === 'travel' ? '例如：成都、三亚、丽江...' : '例如：火锅、日料、烧烤...'"
          placeholder-class="placeholder"
          v-model="keyword"
        />
        
        <view class="quick-tags"
>
          <text class="tags-label">热门推荐：</text>
          
          <view class="tags-list"
>
            <view 
              v-for="tag in quickTags" 
              :key="tag"
              class="tag-item"
              @click="keyword = tag"
            >
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
        </view>
        
        <view class="options-row"
>
          <view class="option-item"
>
            <text class="option-label">游玩天数</text>
            
            <view class="day-selector"
>
              <view 
                v-for="day in [1, 2, 3, 5, 7]" 
                :key="day"
                class="day-option"
                :class="{ active: days === day }"
                @click="days = day"
              >
                <text class="day-text">{{ day }}天</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="generate-btn star-btn star-btn-primary" @click="generateGuide"
>
          <text class="btn-icon">✨</text>
          
          <text class="btn-text">生成攻略</text>
        </view>
      </view>
    </view>
    
    <!-- 生成的攻略预览 -->
    <view v-if="generatedGuide" class="guide-preview-section"
>
      <view class="section-header"
>
        <text class="section-title">攻略预览</text>
        
        <view class="preview-actions"
>
          <view class="action-btn" @click="showExportOptions"
>
            <text class="action-icon">📤</text>
          </view>
        </view>
      </view>
      
      <view class="guide-card glass-card"
>
        <view class="guide-header"
>
          <text class="guide-title">{{ generatedGuide.title }}</text>
          
          <text class="guide-meta">{{ generatedGuide.subtitle }}</text>
        </view>
        
        <view class="guide-content"
>
          <view 
            v-for="(section, index) in generatedGuide.sections" 
            :key="index"
            class="content-section"
          >
            <view class="section-title-row"
>
              <text class="section-number">{{ index + 1 }}</text>
              
              <text class="section-name">{{ section.title }}</text>
            </view>
            
            <view class="section-body"
>
              <text class="section-text">{{ section.content }}</text>
              
              <view v-if="section.items" class="item-list"
>
                <view 
                  v-for="(item, idx) in section.items" 
                  :key="idx"
                  class="list-item"
                >
                  <text class="item-bullet">•</text>
                  
                  <text class="item-text">{{ item }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="guide-footer"
>
          <text class="footer-text">🌌 由星空 AI 生成 · {{ currentDate }}</text>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-btn star-btn" @click="saveGuide"
>
        <text class="btn-icon">💾</text>
        
        <text class="btn-text">保存到我的攻略</text>
      </view>
    </view>
    
    <!-- 导出选项弹窗 -->
    <view v-if="showExportModal" class="export-modal" @click="showExportModal = false"
>
      <view class="modal-content glass-card" @click.stop
>
        <text class="modal-title">导出攻略</text>
        
        <view class="export-options"
>
          <view class="export-option" @click="exportAsImage"
>
            <view class="option-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
>
              <text>🖼️</text>
            </view>
            
            <view class="option-info"
>
              <text class="option-name">导出为图片</text>
              
              <text class="option-desc">生成精美长图，方便分享</text>
            </view>
          </view>
          
          <view class="export-option" @click="exportAsDoc"
>
            <view class="option-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
>
              <text>📄</text>
            </view>
            
            <view class="option-info"
>
              <text class="option-name">导出为文档</text>
              <text class="option-desc">生成Word文档，方便打印</text>
            </view>
          </view>
        </view>
        
        <view class="modal-close" @click="showExportModal = false"
>
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

const guideType = ref<'travel' | 'food'>('travel')
const keyword = ref('')
const days = ref(3)
const generatedGuide = ref<any>(null)
const showExportModal = ref(false)

const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
})

const quickTags = computed(() => {
  return guideType.value === 'travel' 
    ? ['成都', '三亚', '丽江', '大理', '厦门', '西安', '重庆', '杭州']
    : ['火锅', '日料', '烧烤', '奶茶', '甜品', '小龙虾', '烤肉', '西餐']
})

// 模拟生成攻略
const generateGuide = () => {
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入关键词', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '生成中...' })
  
  setTimeout(() => {
    if (guideType.value === 'travel') {
      generatedGuide.value = generateTravelGuide(keyword.value, days.value)
    } else {
      generatedGuide.value = generateFoodGuide(keyword.value)
    }
    uni.hideLoading()
  }, 1500)
}

const generateTravelGuide = (place: string, dayCount: number) => {
  const guides: Record<string, any> = {
    '成都': {
      title: `🐼 ${place}慢生活之旅`,
      subtitle: `${dayCount}天深度游 · 吃遍巴适成都`,
      sections: [
        {
          title: '行前准备',
          content: '成都气候湿润，建议带上雨具。身份证、手机、充电宝必备。提前下载天府通APP，方便乘坐地铁。'
        },
        {
          title: '必去景点',
          items: [
            '宽窄巷子 - 感受老成都韵味，品尝地道小吃',
            '锦里古街 - 夜景超美，三国文化氛围浓厚',
            '大熊猫繁育研究基地 - 早起看熊猫吃竹子',
            '武侯祠 - 了解三国历史，红墙竹影拍照圣地',
            '春熙路/太古里 - 时尚潮流地标，IFS爬墙熊猫'
          ]
        },
        {
          title: '美食推荐',
          items: [
            '火锅：蜀大侠、小龙坎、大龙燚',
            '串串：马路边边、钢管厂五区',
            '小吃：钟水饺、龙抄手、担担面、蛋烘糕',
            '甜品：冰粉、凉糕、三大炮'
          ]
        },
        {
          title: `行程安排`,
          content: `Day1：宽窄巷子 → 人民公园喝茶 → 锦里夜景
Day2：熊猫基地 → 武侯祠 → 春熙路购物
Day3：都江堰一日游 或 市区休闲探店`
        },
        {
          title: '实用贴士',
          content: '1. 成都美食偏辣，不吃辣记得提前说\n2. 地铁覆盖主要景点，出行方便\n3. 茶馆文化是精髓，一定要体验\n4. 熊猫基地建议7:30开园就去'
        }
      ]
    }
  }
  
  return guides[place] || {
    title: `✈️ ${place}${dayCount}日游攻略`,
    subtitle: `精选路线 · 吃住行全指南`,
    sections: [
      {
        title: '行前准备',
        content: `准备好身份证、充电器、常用药品。查询${place}当地天气，准备合适衣物。建议提前预订热门景点门票。`
      },
      {
        title: '必去景点',
        items: [
          `${place}地标景点1 - 必打卡的网红地标`,
          `${place}特色景点2 - 体验当地文化`,
          `${place}自然风光3 - 欣赏绝美风景`,
          `${place}美食街区4 - 品尝地道美食`
        ]
      },
      {
        title: '美食推荐',
        items: [
          '当地特色菜1 - 必尝招牌美食',
          '当地特色菜2 - 传统老字号',
          '街头小吃 - 边走边吃',
          '网红餐厅 - 拍照打卡'
        ]
      },
      {
        title: '住宿推荐',
        content: '推荐住在市中心或地铁站附近，交通便利。预算充足可选星级酒店，性价比可选连锁酒店或民宿。'
      },
      {
        title: '交通指南',
        content: `${place}市内交通便利，地铁、公交覆盖主要景点。建议使用打车软件，避免被宰。`
      }
    ]
  }
}

const generateFoodGuide = (food: string) => {
  const guides: Record<string, any> = {
    '火锅': {
      title: `🔥 ${food}探店攻略`,
      subtitle: '吃遍全城最正宗的火锅',
      sections: [
        {
          title: '火锅类型',
          content: '川渝火锅：麻辣鲜香，牛油锅底\n北派火锅：清汤涮肉，讲究原汁原味\n粤式火锅：清淡养生，海鲜为主\n日式火锅：寿喜烧、涮涮锅'
        },
        {
          title: '必点菜品',
          items: [
            '毛肚 - 七上八下，脆嫩爽口',
            '鸭肠 - 处理干净，口感Q弹',
            '黄喉 - ' +
'脆嫩可口',
            '嫩牛肉 - 现切现涮，鲜嫩多汁',
            '虾滑 - 手工制作，鲜美弹牙',
            '土豆片 - 软糯入味，必点素菜'
          ]
        },
        {
          title: '蘸料搭配',
          content: '经典油碟：香油+蒜泥+香菜+葱花\n干碟：辣椒面+花生碎+芝麻\n麻酱碟：适合北方火锅\n海鲜汁：适合清淡锅底'
        },
        {
          title: '推荐店铺',
          items: [
            '海底捞 - 服务一流，适合聚餐',
            '小龙坎 - 正宗川味，辣而不燥',
            '巴奴毛肚火锅 - 毛肚专家',
            '电台巷火锅 - 复古怀旧风',
            '凑凑火锅 - 台式火锅，奶茶超赞'
          ]
        },
        {
          title: '吃锅小贴士',
          content: '1. 先涮肉后涮菜，保持汤底鲜美\n2. 毛肚七上八下，老了咬不动\n3. 辣锅配冰粉，解辣又解腻\n4. 不要喝火锅汤，嘌呤太高\n5. 吃完火锅别急着喝冷饮，伤胃'
        }
      ]
    }
  }
  
  return guides[food] || {
    title: `🍽️ ${food}美食攻略`,
    subtitle: '精选全城最好吃的' + food,
    sections: [
      {
        title: `${food}简介`,
        content: `${food}是一道深受大家喜爱的美食，有着悠久的历史和丰富的做法。不同地区有不同风味，值得逐一品尝。`
      },
      {
        title: '推荐店铺',
        items: [
          `老字号${food}店 - 传统味道，口碑保证`,
          `网红${food}店 - 颜值超高，适合拍照`,
          `本地人推荐的${food}店 - 藏在巷子里的小店`,
          `高端${food}店 - 精致环境，商务宴请`
        ]
      },
      {
        title: '吃法推荐',
        content: `不同的吃法会带来不同的体验。可以尝试传统做法，也可以试试创新口味。建议搭配适合的饮品，味道更佳。`
      },
      {
        title: '注意事项',
        content: '1. 注意卫生，选择干净卫生的店铺\n2. 适量食用，不要暴饮暴食\n3. 注意食物过敏\n4. 特殊时期注意饮食禁忌'
      }
    ]
  }
}

const showExportOptions = () => {
  showExportModal.value = true
}

const exportAsImage = () => {
  showExportModal.value = false
  uni.showLoading({ title: '生成图片中...' })
  
  // 模拟生成图片
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '图片已保存', icon: 'success' })
  }, 1500)
}

const exportAsDoc = () => {
  showExportModal.value = false
  uni.showLoading({ title: '生成文档中...' })
  
  // 模拟生成文档
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '文档已生成', icon: 'success' })
  }, 1500)
}

const saveGuide = () => {
  if (!generatedGuide.value) return
  
  // 保存到本地存储
  const savedGuides = uni.getStorageSync('myGuides') || []
  const newGuide = {
    id: Date.now(),
    type: guideType.value,
    keyword: keyword.value,
    title: generatedGuide.value.title,
    createTime: new Date().toISOString(),
    content: generatedGuide.value
  }
  
  savedGuides.unshift(newGuide)
  uni.setStorageSync('myGuides', savedGuides)
  
  uni.showToast({ title: '保存成功', icon: 'success' })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.guide-generator-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
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

.page-header {
  margin-top: 120rpx;
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
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.input-section {
  padding: 40rpx;
  margin-bottom: 30rpx;
}

.input-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  background: rgba(100, 181, 246, 0.2);
  border-color: #64b5f6;
}

.tab-icon {
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.tab-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.input-area {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20rpx;
  display: block;
}

.keyword-input {
  height: 100rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  color: #ffffff;
  margin-bottom: 25rpx;
}

.placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.quick-tags {
  margin-bottom: 30rpx;
}

.tags-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15rpx;
  display: block;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.tag-item {
  padding: 12rpx 25rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.tag-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.options-row {
  margin-bottom: 30rpx;
}

.option-item {
  margin-bottom: 20rpx;
}

.option-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15rpx;
  display: block;
}

.day-selector {
  display: flex;
  gap: 15rpx;
}

.day-option {
  padding: 15rpx 30rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  border: 2rpx solid transparent;
}

.day-option.active {
  background: rgba(100, 181, 246, 0.2);
  border-color: #64b5f6;
}

.day-text {
  font-size: 26rpx;
  color: #ffffff;
}

.generate-btn {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
}

.btn-icon {
  font-size: 36rpx;
}

.btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 攻略预览 */
.guide-preview-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.preview-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.action-icon {
  font-size: 32rpx;
}

.guide-card {
  padding: 40rpx;
  margin-bottom: 30rpx;
}

.guide-header {
  text-align: center;
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.guide-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15rpx;
  display: block;
}

.guide-meta {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 35rpx;
}

.content-section {
  display: flex;
  flex-direction: column;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 15rpx;
}

.section-number {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.section-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.section-body {
  padding-left: 55rpx;
}

.section-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  white-space: pre-line;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.list-item {
  display: flex;
  gap: 10rpx;
}

.item-bullet {
  font-size: 28rpx;
  color: #64b5f6;
}

.item-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  flex: 1;
}

.guide-footer {
  margin-top: 40rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.save-btn {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  background: transparent;
  border: 2rpx solid rgba(100, 181, 246, 0.5);
}

/* 导出弹窗 */
.export-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 100%;
  padding: 40rpx;
  border-radius: 40rpx 40rpx 0 0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40rpx;
  display: block;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
  margin-bottom: 40rpx;
}

.export-option {
  display: flex;
  align-items: center;
  gap: 25rpx;
  padding: 25rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
}

.option-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.option-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.option-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.modal-close {
  padding: 30rpx;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
}

.modal-close text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>