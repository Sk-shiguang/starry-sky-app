<template>
  <view class="config-page">
    <!-- 星轨背景 -->
    <view class="star-trails">
      <view class="trail trail-1"></view>
      <view class="trail trail-2"></view>
      <view class="trail trail-3"></view>
    </view>

    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 页面标题 -->
      <view class="page-header">
        <view class="back-btn" @click="goBack">←</view>
        <view class="page-title">📝 菜单配置</view>
        <view class="add-btn" @click="showAddForm = true">➕</view>
      </view>

      <!-- 分类筛选 -->
      <view class="category-filter">
        <view
          v-for="cat in categories"
          :key="cat.value"
          :class="['filter-tag', { active: activeCategory === cat.value }]"
          @click="activeCategory = cat.value"
        >
          {{ cat.label }}
        </view>
      </view>

      <!-- 菜品列表 -->
      <view class="food-list">
        <!-- 空状态 -->
        <view v-if="filteredItems.length === 0" class="empty-state">
          <view class="empty-icon">🍽️</view>
          <view class="empty-text">暂无菜品</view>
          <view class="empty-hint">点击"➕"添加您的第一道菜品</view>
        </view>

        <!-- 菜品项 - 支持左滑删除 -->
        <view 
          v-for="item in filteredItems" 
          :key="item.id" 
          class="food-item-wrapper"
          :data-id="item.id"
        >
          <!-- 删除按钮背景层 -->
          <view class="delete-bg" @click="deleteItem(item.id)">
            <view class="delete-icon">🗑️</view>
            <view class="delete-text">删除</view>
          </view>
          
          <!-- 菜品卡片 - 可滑动 -->
          <view 
            class="food-item glass-card"
            :class="{ 'is-swiping': swipeState[item.id]?.startX !== 0 }"
            :style="getSwipeStyle(item.id)"
            @touchstart="handleTouchStart($event, item.id)"
            @touchmove="handleTouchMove($event, item.id)"
            @touchend="handleTouchEnd($event, item.id)"
            @touchcancel="handleTouchCancel($event, item.id)"
            @click="handleItemClick(item.id)"
          >
            <!-- 菜品基本信息 -->
            <view class="item-main">
              <view class="item-icon">{{ item.icon }}</view>
              <view class="item-details">
                <view class="item-name">{{ item.name }}</view>
                <view class="item-meta">
                  <text class="meta-tag">{{ getCategoryLabel(item.category) }}</text>
                  <text class="meta-tag">
                    <span v-for="i in item.difficulty" :key="i">⭐</span>
                  </text>
                  <text v-if="item.isTakeout" class="meta-tag takeout">🛵 可外卖</text>
                </view>
                <view v-if="item.tags && item.tags.length > 0" class="item-tags">
                  <text v-for="tag in item.tags" :key="tag" class="tag-badge">{{ tag }}</text>
                </view>
              </view>
            </view>

            <!-- 编辑按钮 -->
            <view class="item-actions">
              <button class="action-btn edit-btn" @click.stop="editItem(item)">✏️</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑菜品表单弹窗 -->
    <view v-if="showAddForm" class="modal-overlay" @click.self="closeAddForm">
      <view class="modal-content glass-card">
        <view class="modal-header">
          <view class="modal-title">{{ editingItem ? '编辑菜品' : '添加菜品' }}</view>
          <view class="modal-close" @click="closeAddForm">✕</view>
        </view>

        <!-- 表单内容 -->
        <view class="form-group">
          <label class="form-label">菜品名称 *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="输入菜品名称"
            class="form-input"
          />
        </view>

        <view class="form-group">
          <label class="form-label">菜品分类 *</label>
          <view class="form-select">
            <view
              v-for="cat in categories.filter((c) => c.value !== 'all')"
              :key="cat.value"
              :class="['select-option', { selected: formData.category === cat.value }]"
              @click="formData.category = cat.value"
            >
              {{ cat.label }}
            </view>
          </view>
        </view>

        <view class="form-group">
          <label class="form-label">菜品难度 *</label>
          <view class="difficulty-select">
            <view
              v-for="level in [1, 2, 3]"
              :key="level"
              :class="['difficulty-option', { selected: formData.difficulty === level }]"
              @click="formData.difficulty = level"
            >
              <span v-for="i in level" :key="i">⭐</span>
            </view>
          </view>
        </view>

        <view class="form-group">
          <label class="form-label">菜品emoji *</label>
          <input
            v-model="formData.icon"
            type="text"
            placeholder="输入单个emoji，如 🍜"
            class="form-input emoji-input"
            maxlength="2"
          />
        </view>

        <view class="form-group">
          <label class="form-label">菜品标签（可多选）</label>
          <view class="tags-input">
            <input
              v-model="newTag"
              type="text"
              placeholder="输入标签后按空格或逗号"
              class="tag-input"
              @keydown.space="addTag"
              @keydown.comma="addTag"
            />
            <view class="selected-tags">
              <view v-for="tag in formData.tags" :key="tag" class="selected-tag">
                {{ tag }}
                <text class="remove-tag" @click="removeTag(tag)">✕</text>
              </view>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="checkbox-item">
            <input v-model="formData.isTakeout" type="checkbox" />
            <label class="checkbox-label">可以外卖</label>
          </view>
        </view>

        <!-- 按钮组 -->
        <view class="form-actions">
          <button class="btn-secondary" @click="closeAddForm">取消</button>
          <button class="btn-primary" @click="submitForm">
            {{ editingItem ? '更新菜品' : '添加菜品' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <view v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <view class="confirm-dialog glass-card">
        <view class="confirm-title">确认删除？</view>
        <view class="confirm-text">此操作不可撤销</view>
        <view class="confirm-actions">
          <button class="btn-cancel" @click="showDeleteConfirm = false">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确认删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MenuAPI, { type FoodItem } from '../../api/menu';

// 分类定义
const categories = [
  { label: '全部', value: 'all' },
  { label: '中餐', value: 'chinese' },
  { label: '西餐', value: 'western' },
  { label: '日料', value: 'japanese' },
  { label: '韩料', value: 'korean' },
  { label: '简餐', value: 'simple' }
];

// 分类标签映射
const categoryLabel: Record<string, string> = {
  chinese: '中餐',
  western: '西餐',
  japanese: '日料',
  korean: '韩料',
  simple: '简餐'
};

// 数据状态
const items = ref<FoodItem[]>([]);
const activeCategory = ref<string>('all');
const showAddForm = ref(false);
const showDeleteConfirm = ref(false);
const editingItem = ref<FoodItem | null>(null);
const itemToDelete = ref<string | null>(null);
const newTag = ref('');

// 滑动删除相关 - 优化版
interface SwipeItemState {
  startX: number;
  currentX: number;
  isOpen: boolean;
  startY: number;
  isScrolling: boolean | null;
}

const swipeState = ref<Record<string, SwipeItemState>>({});
const SWIPE_THRESHOLD = 60; // 滑动阈值（减小以提高灵敏度）
const MAX_SWIPE = 140; // 最大滑动距离
const SCROLL_THRESHOLD = 10; // 垂直滚动阈值

// 获取滑动样式
const getSwipeStyle = (itemId: string) => {
  const state = swipeState.value[itemId];
  if (!state) return {};
  
  let translateX = 0;
  
  if (state.isOpen) {
    translateX = -MAX_SWIPE;
  } else if (state.startX !== 0) {
    const deltaX = state.currentX - state.startX;
    // 只能向左滑动，限制最大滑动距离
    translateX = Math.min(0, Math.max(-MAX_SWIPE, deltaX));
  }
  
  const isAnimating = state.isOpen || (!state.startX && translateX === 0);
  
  return {
    transform: `translateX(${translateX}rpx)`,
    transition: isAnimating ? 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
  };
};

// 关闭所有已打开的滑动项
const closeAllSwipeItems = (exceptId?: string) => {
  Object.keys(swipeState.value).forEach(id => {
    if (id !== exceptId && swipeState.value[id].isOpen) {
      swipeState.value[id].isOpen = false;
    }
  });
};

// 处理触摸开始
const handleTouchStart = (event: TouchEvent, itemId: string) => {
  const touch = event.touches[0];
  
  // 关闭其他已打开的项
  closeAllSwipeItems(itemId);
  
  if (!swipeState.value[itemId]) {
    swipeState.value[itemId] = { 
      startX: touch.clientX, 
      currentX: touch.clientX, 
      isOpen: false,
      startY: touch.clientY,
      isScrolling: null
    };
  } else {
    const state = swipeState.value[itemId];
    state.startX = touch.clientX;
    state.currentX = touch.clientX;
    state.startY = touch.clientY;
    state.isScrolling = null;
  }
};

// 处理触摸移动
const handleTouchMove = (event: TouchEvent, itemId: string) => {
  const touch = event.touches[0];
  const state = swipeState.value[itemId];
  if (!state || state.startX === 0) return;
  
  const deltaX = touch.clientX - state.startX;
  const deltaY = touch.clientY - state.startY;
  
  // 判断滑动方向（仅在开始时判断一次）
  if (state.isScrolling === null) {
    state.isScrolling = Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > SCROLL_THRESHOLD;
  }
  
  // 如果是垂直滚动，不处理水平滑动
  if (state.isScrolling) return;
  
  // 阻止默认行为，防止页面滚动
  if (Math.abs(deltaX) > SCROLL_THRESHOLD) {
    event.preventDefault();
  }
  
  // 更新当前位置
  state.currentX = touch.clientX;
};

// 处理触摸结束
const handleTouchEnd = (event: TouchEvent, itemId: string) => {
  const state = swipeState.value[itemId];
  if (!state || state.startX === 0) return;
  
  // 如果是垂直滚动，忽略此次滑动
  if (state.isScrolling) {
    state.startX = 0;
    state.currentX = 0;
    state.isScrolling = null;
    return;
  }
  
  const deltaX = state.currentX - state.startX;
  
  if (state.isOpen) {
    // 如果已经打开，向右滑动超过阈值则关闭
    if (deltaX > SWIPE_THRESHOLD * 0.6) {
      state.isOpen = false;
    }
  } else {
    // 如果未打开，向左滑动超过阈值则打开
    if (deltaX < -SWIPE_THRESHOLD) {
      state.isOpen = true;
    }
  }
  
  // 重置状态
  state.startX = 0;
  state.currentX = 0;
  state.startY = 0;
  state.isScrolling = null;
};

// 处理触摸取消
const handleTouchCancel = (event: TouchEvent, itemId: string) => {
  const state = swipeState.value[itemId];
  if (!state) return;
  
  state.startX = 0;
  state.currentX = 0;
  state.startY = 0;
  state.isScrolling = null;
};

// 处理菜品点击
const handleItemClick = (itemId: string) => {
  // 关闭所有已打开的滑动项
  closeAllSwipeItems();
};

// 表单数据
const formData = ref<{
  name: string;
  category: string;
  difficulty: 1 | 2 | 3;
  icon: string;
  tags: string[];
  isTakeout: boolean;
}>({
  name: '',
  category: 'chinese',
  difficulty: 1,
  icon: '🍽️',
  tags: [],
  isTakeout: false
});

// 计算过滤后的菜品列表
const filteredItems = computed(() => {
  return MenuAPI.getByCategory(activeCategory.value);
});

// 获取分类标签文本
const getCategoryLabel = (category: string): string => {
  return categoryLabel[category] || category;
};

// 刷新菜品列表
const refreshItems = () => {
  items.value = MenuAPI.getAll();
};

// 打开编辑表单
const editItem = (item: FoodItem) => {
  editingItem.value = item;
  formData.value = {
    name: item.name,
    category: item.category,
    difficulty: item.difficulty,
    icon: item.icon,
    tags: [...item.tags],
    isTakeout: item.isTakeout
  };
  showAddForm.value = true;
};

// 关闭表单
const closeAddForm = () => {
  showAddForm.value = false;
  editingItem.value = null;
  resetForm();
};

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    category: 'chinese',
    difficulty: 1,
    icon: '🍽️',
    tags: [],
    isTakeout: false
  };
  newTag.value = '';
};

// 添加标签
const addTag = (event: Event) => {
  event.preventDefault();
  const tag = newTag.value.trim();
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
  }
  newTag.value = '';
};

// 删除标签
const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag);
};

// 提交表单
const submitForm = () => {
  // 验证必填字段
  if (!formData.value.name.trim()) {
    uni.showToast({ title: '请输入菜品名称', icon: 'none' });
    return;
  }

  if (!formData.value.icon.trim()) {
    uni.showToast({ title: '请输入菜品emoji', icon: 'none' });
    return;
  }

  if (editingItem.value) {
    // 编辑现有菜品
    MenuAPI.update(editingItem.value.id, {
      name: formData.value.name,
      category: formData.value.category as any,
      difficulty: formData.value.difficulty,
      icon: formData.value.icon,
      tags: formData.value.tags,
      isTakeout: formData.value.isTakeout
    });
    uni.showToast({ title: '菜品已更新', icon: 'success' });
  } else {
    // 添加新菜品
    MenuAPI.add({
      name: formData.value.name,
      category: formData.value.category as any,
      difficulty: formData.value.difficulty,
      icon: formData.value.icon,
      tags: formData.value.tags,
      isTakeout: formData.value.isTakeout
    });
    uni.showToast({ title: '菜品已添加', icon: 'success' });
  }

  closeAddForm();
  refreshItems();
};

// 删除菜品
const deleteItem = (id: string) => {
  // 关闭滑动状态
  if (swipeState.value[id]) {
    swipeState.value[id].isOpen = false;
  }
  
  uni.showModal({
    title: '🗑️ 确认删除',
    content: '确定要删除这道菜品吗？此操作不可撤销。',
    confirmText: '删除',
    cancelText: '取消',
    confirmColor: '#f5576c',
    success: (res) => {
      if (res.confirm) {
        MenuAPI.delete(id);
        // 清理该项目的滑动状态
        delete swipeState.value[id];
        uni.showToast({ title: '菜品已删除', icon: 'success' });
        refreshItems();
      }
    }
  });
};

// 确认删除（兼容旧版弹窗）
const confirmDelete = () => {
  if (itemToDelete.value) {
    MenuAPI.delete(itemToDelete.value);
    uni.showToast({ title: '菜品已删除', icon: 'success' });
    refreshItems();
  }
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};

// 页面挂载
onMounted(() => {
  MenuAPI.initDefaultItems();
  refreshItems();
});
</script>

<style scoped>
.config-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #141e61, #511ea2);
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
  width: 300rpx;
  height: 300rpx;
  background: radial-gradient(circle, #667eea 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation: float 20s ease-in-out infinite;
}

.trail-2 {
  width: 400rpx;
  height: 400rpx;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  bottom: 20%;
  right: 15%;
  animation: float 25s ease-in-out infinite reverse;
}

.trail-3 {
  width: 250rpx;
  height: 250rpx;
  background: radial-gradient(circle, #4facfe 0%, transparent 70%);
  top: 40%;
  right: 5%;
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(100rpx); }
}

/* 页面内容 */
.page-content {
  position: relative;
  z-index: 1;
  padding: 30rpx;
  min-height: 100vh;
}

/* 页面头 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
}

.back-btn,
.add-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.25), inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
}

.back-btn {
  font-weight: bold;
  font-size: 40rpx;
  padding-bottom: 4rpx;
}

.back-btn:active,
.add-btn:active {
  background: rgba(102, 126, 234, 0.35);
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(0.92);
}

.back-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

/* 分类筛选 */
.category-filter {
  display: flex;
  gap: 15rpx;
  margin-bottom: 40rpx;
  overflow-x: auto;
  padding-bottom: 10rpx;
}

.filter-tag {
  padding: 12rpx 24rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-tag.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

/* 菜品列表 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 菜品项包装器 - 用于滑动删除 */
.food-item-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 24rpx;
}

/* 删除按钮背景 */
.delete-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 140rpx;
  background: linear-gradient(135deg, #f5576c, #e53e3e);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  cursor: pointer;
  border-radius: 0 24rpx 24rpx 0;
  transition: all 0.2s ease;
}

.delete-bg:active {
  background: linear-gradient(135deg, #e53e3e, #c53030);
}

.delete-icon {
  font-size: 44rpx;
  transition: transform 0.2s ease;
}

.delete-bg:active .delete-icon {
  transform: scale(0.9);
}

.delete-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 菜品项 - 可滑动 */
.food-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx;
  gap: 20rpx;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.05) !important;
  will-change: transform;
  touch-action: pan-y;
}

/* 滑动时的视觉反馈 */
.food-item.is-swiping {
  opacity: 0.95;
}

/* 滑动操作提示 */
.swipe-hint {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;
  text-align: center;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 菜品项已移动到滑动容器内定义 */

/* 菜品主体 */
.item-main {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  flex: 1;
}

.item-icon {
  font-size: 60rpx;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.item-meta {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
  font-size: 24rpx;
}

.meta-tag {
  padding: 4rpx 10rpx;
  background: rgba(102, 126, 234, 0.15);
  border: 1rpx solid rgba(102, 126, 234, 0.3);
  border-radius: 10rpx;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
}

.meta-tag.takeout {
  background: rgba(240, 147, 251, 0.15);
  border-color: rgba(240, 147, 251, 0.3);
  color: #f093fb;
}

.item-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  margin-top: 5rpx;
}

.tag-badge {
  padding: 4rpx 8rpx;
  background: rgba(79, 172, 254, 0.15);
  border: 1rpx solid rgba(79, 172, 254, 0.3);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #4facfe;
}

/* 操作按钮 */
.item-actions {
  display: flex;
  gap: 10rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.edit-btn:hover {
  background: rgba(79, 172, 254, 0.2);
}

.delete-btn:hover {
  background: rgba(245, 87, 108, 0.2);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 30rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  border-radius: 32rpx;
  padding: 40rpx;
  max-height: 80vh;
  overflow-y: auto;
}

/* 模态框头 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.modal-close {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #ffffff;
}

/* 表单组 */
.form-group {
  margin-bottom: 25rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.form-label {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 600;
}

.form-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 20rpx;
  color: #ffffff;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.emoji-input {
  text-align: center;
  font-size: 40rpx;
  letter-spacing: 5rpx;
}

/* 分类选择 */
.form-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10rpx;
}

.select-option {
  padding: 15rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 26rpx;
}

.select-option.selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
}

/* 难度选择 */
.difficulty-select {
  display: flex;
  gap: 10rpx;
}

.difficulty-option {
  flex: 1;
  padding: 15rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24rpx;
}

.difficulty-option.selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
}

/* 标签输入 */
.tags-input {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.tag-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 15rpx;
  color: #ffffff;
  font-size: 26rpx;
}

.tag-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 5rpx;
  padding: 6rpx 12rpx;
  background: rgba(79, 172, 254, 0.2);
  border: 1rpx solid rgba(79, 172, 254, 0.4);
  border-radius: 12rpx;
  color: #4facfe;
  font-size: 24rpx;
}

.remove-tag {
  cursor: pointer;
  font-weight: bold;
  transition: color 0.2s ease;
}

.remove-tag:hover {
  color: #f5576c;
}

/* 复选框 */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.checkbox-item input {
  width: 40rpx;
  height: 40rpx;
  cursor: pointer;
}

.checkbox-label {
  font-size: 26rpx;
  color: #ffffff;
  cursor: pointer;
}

/* 表单按钮 */
.form-actions {
  display: flex;
  gap: 15rpx;
  margin-top: 30rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 18rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 确认对话框 */
.confirm-dialog {
  width: 80%;
  max-width: 400rpx;
  border-radius: 24rpx;
  padding: 40rpx;
  text-align: center;
}

.confirm-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15rpx;
}

.confirm-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30rpx;
}

.confirm-actions {
  display: flex;
  gap: 15rpx;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 15rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 26rpx;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-confirm {
  background: linear-gradient(135deg, #f5576c, #f093fb);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(245, 87, 108, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(245, 87, 108, 0.4);
}

/* Glass Card 样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  border: 1rpx solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1) !important;
}
</style>
