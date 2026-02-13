# 菜单功能快速使用指南

## 📱 页面导航地图

```
应用入口
  └─ 菜单功能
      ├─ 首页: /pages/menu/index
      │   ├─ 「今日推荐」→ /pages/menu/random
      │   ├─ 「随机选」→ /pages/menu/random
      │   ├─ 「配置菜单」→ /pages/menu/config
      │   └─ 菜品卡片 → /pages/menu/order
      │
      ├─ 随机推荐: /pages/menu/random
      │   ├─ 点击转盘 → 旋转动画 (2-3秒)
      │   ├─ 显示推荐菜品
      │   └─ 双路线选择
      │       ├─ 自己做饭 (待实现)
      │       └─ 点外卖 (待实现)
      │
      ├─ 智能点餐: /pages/menu/order
      │   ├─ 选择人数
      │   ├─ 分类筛选
      │   ├─ 菜品选择
      │   └─ 浮动购物车确认
      │
      ├─ 菜单配置: /pages/menu/config
      │   ├─ 新增菜品
      │   ├─ 编辑菜品
      │   └─ 删除菜品
      │
      └─ 食谱详情: /pages/menu/recipe (待开发)
```

## 🚀 快速开始

### 1. 访问菜单首页
```javascript
uni.navigateTo({ url: '/pages/menu/index' });
```

### 2. 进入随机推荐
```javascript
uni.navigateTo({ url: '/pages/menu/random' });
```

### 3. 进入点餐页面
```javascript
uni.navigateTo({ url: '/pages/menu/order' });
```

## 🎨 设计规范速查

### 颜色
```css
深空蓝: #141e61
星云紫: #511ea2
午夜蓝: #0a0e27
流光蓝: #667eea
梦幻粉: #f093fb
活力青: #4facfe
```

### 常用组件类
```css
/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
}

/* 主按钮 */
.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50rpx;
  color: #ffffff;
}

/* 次按钮 */
.btn-secondary {
  background: transparent;
  border: 2rpx solid rgba(100, 181, 246, 0.5);
  border-radius: 50rpx;
}
```

### 动画速查
```css
/* 标准过渡 */
transition: all 0.3s ease;

/* 进场动画 */
@keyframes fly-in {
  0% { opacity: 0; transform: translateY(30rpx) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* 浮动效果 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

/* 闪烁效果 */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

## 🔌 API 使用

### MenuAPI 方法
```typescript
// 初始化默认菜品
MenuAPI.initDefaultItems()

// 获取所有菜品
const items = MenuAPI.getAll()

// 添加菜品
MenuAPI.add({ name, category, difficulty, ... })

// 更新菜品
MenuAPI.update(id, updates)

// 删除菜品
MenuAPI.delete(id)

// 随机获取菜品
const item = MenuAPI.getRandom()

// 按分类筛选
const items = MenuAPI.getByCategory('chinese')

// 获取可外卖菜品
const items = MenuAPI.getTakeout()
```

### 菜品数据结构
```typescript
interface FoodItem {
  id: string;                 // 唯一ID
  name: string;               // 菜品名称
  category: 'chinese' | 'western' | 'japanese' | 'korean' | 'simple';
  difficulty: 1 | 2 | 3;      // 难度等级
  tags: string[];             // 标签
  icon: string;               // emoji图标
  image?: string;             // 图片URL
  isTakeout: boolean;         // 是否可外卖
  recipe?: Recipe;            // 食谱信息
  createdAt: number;          // 创建时间戳
  updatedAt: number;          // 更新时间戳
}

interface Recipe {
  ingredients: string[];      // 食材清单
  steps: string[];            // 制作步骤
  time: string;               // 预计时间
  tips?: string;              // 小贴士
}
```

## 📊 组件 Props

### MenuCard 组件
```vue
<MenuCard 
  :item="foodItem"
  :show-badge="true"
  @click="handleClick"
/>

Props: {
  item: FoodItem,             // 必需
  showBadge?: boolean         // 默认 false
}

Events: {
  click: (item: FoodItem) => void
}
```

## 🎯 常见任务

### 任务 1: 添加新菜品
```typescript
const newItem = MenuAPI.add({
  name: '番茄鸡蛋面',
  category: 'chinese',
  difficulty: 1,
  tags: ['快手', '清汤'],
  icon: '🍝',
  isTakeout: false,
  recipe: { ... }
});

uni.$emit('menu-updated');  // 刷新页面
```

### 任务 2: 随机推荐菜品
```typescript
const recommended = MenuAPI.getRandom();
// 或按分类推荐
const recommended = MenuAPI.getRandomByCategory('chinese');
```

### 任务 3: 获取可外卖菜品
```typescript
const takeoutItems = MenuAPI.getTakeout();
```

### 任务 4: 实现转盘旋转
```typescript
const handleWheelClick = async () => {
  // 随机圈数 (2-4圈) + 随机角度 (0-360)
  const rounds = 2 + Math.random() * 2;
  const randomAngle = Math.random() * 360;
  const totalRotation = rounds * 360 + randomAngle;
  
  // 应用旋转动画
  wheelRotation.value = totalRotation;
  
  // 等待动画完成 (2-3秒)
  await new Promise(resolve => 
    setTimeout(resolve, 2000 + Math.random() * 1000)
  );
  
  // 显示结果
  recommendedFood.value = MenuAPI.getRandom();
};
```

## 🐛 调试技巧

### 查看存储的菜品数据
```javascript
// 浏览器控制台
const items = uni.getStorageSync('menu_items');
console.log(items);
```

### 清除所有菜品数据
```javascript
MenuAPI.clear();
uni.$emit('menu-updated');  // 刷新页面
```

### 监听菜品更新
```javascript
uni.$on('menu-updated', () => {
  // 菜品列表已更新，重新加载
  items.value = MenuAPI.getAll();
});
```

## 📝 开发检查清单

部署前检查：

- [ ] 转盘动画流畅 (帧率 ≥ 60fps)
- [ ] 星轨背景正常渲染
- [ ] 按钮交互反馈完整
- [ ] 菜品数据准确加载
- [ ] 浮动购物车不遮挡内容
- [ ] 响应式布局正常 (手机/平板)
- [ ] 返回按钮导航正确
- [ ] 没有控制台错误

## 🔗 相关文件

- 设计规范: `Documents/StarrySkyApp/DesignSystem.md`
- 功能设计: `Documents/StarrySkyApp/MenuDesign.md`
- 阶段一总结: `docs/MENU_PHASE1_SUMMARY.md`
- 阶段二总结: `docs/MENU_PHASE2_SUMMARY.md`
- API 实现: `src/api/menu.ts`
- 菜品卡片: `src/pages/menu/components/MenuCard.vue`

## 📞 反馈和建议

如发现以下问题，请反馈：

- [ ] 动画卡顿或闪烁
- [ ] 菜品数据错误或丢失
- [ ] 按钮点击无响应
- [ ] 样式不符合规范
- [ ] 路由导航异常

---

> 💡 提示：更新菜品后，需要调用 `uni.$emit('menu-updated')` 刷新所有相关页面
