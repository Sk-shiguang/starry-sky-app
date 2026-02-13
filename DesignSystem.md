# Starry Sky App 设计规范文档 v1.0

> 基于已实现风格整理，后续需求开发按此规范执行

---

## 一、设计原则

### 1.1 主题概念
**「星空探索」** — 沉浸式宇宙体验，科技感与梦幻感并存

### 1.2 核心关键词
- 深邃星空背景
- 流光动态效果
- 玻璃拟态卡片
- 呼吸发光元素

---

## 二、配色规范

### 2.1 主色调
| 名称 | 色值 | 用途 |
|------|------|------|
| 深空蓝 | `#141E61` | 背景渐变起点 |
| 星云紫 | `#511EA2` | 背景渐变终点 |
| 午夜蓝 | `#0a0e27` | 深色区域底色 |

### 2.2 强调色
| 名称 | 色值 | 用途 |
|------|------|------|
| 流光蓝 | `#667eea` | 主按钮、高亮边框 |
| 梦幻粉 | `#f093fb` | 次按钮、装饰元素 |
| 活力青 | `#4facfe` | 成功状态、清新元素 |
| 珊瑚红 | `#f5576c` | 警告、VIP标识 |
| 薄荷绿 | `#38f9d7` | 成功提示 |

### 2.3 渐变色组合
```css
/* 主按钮渐变 */
gradient-primary: linear-gradient(135deg, #667eea, #764ba2)

/* 次按钮渐变 */
gradient-secondary: linear-gradient(135deg, #f093fb, #f5576c)

/* 清新渐变 */
gradient-fresh: linear-gradient(135deg, #4facfe, #00f2fe)

/* 背景渐变 */
gradient-bg: linear-gradient(135deg, #141E61, #511EA2)
```

### 2.4 文字颜色
| 名称 | 色值 | 用途 |
|------|------|------|
| 主文字 | `#ffffff` | 标题、重要文字 |
| 次文字 | `rgba(255,255,255,0.8)` | 正文 |
| 辅助文字 | `rgba(255,255,255,0.6)` | 说明、时间 |
| 禁用文字 | `rgba(255,255,255,0.4)` | 不可点击状态 |

---

## 三、组件规范

### 3.1 卡片组件 (Glass Card)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3), 
              inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-card-hover {
  transform: translateY(-5rpx);
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}
```

### 3.2 按钮组件

#### 主按钮
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50rpx;
  padding: 24rpx 40rpx;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}
```

#### 次按钮
```css
.btn-secondary {
  background: transparent;
  border: 2rpx solid rgba(100, 181, 246, 0.5);
  border-radius: 50rpx;
  color: #ffffff;
}
```

### 3.3 输入框组件
```css
.input-field {
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  color: #ffffff;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.2);
}
```

### 3.4 图标容器
```css
.icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.25);
}
```

---

## 四、动效规范

### 4.1 动画时长
| 类型 | 时长 | 用途 |
|------|------|------|
| 微交互 | 200ms | 按钮点击、状态切换 |
| 标准过渡 | 300ms | 卡片hover、页面切换 |
| 入场动画 | 500-600ms | 元素飞入、弹窗出现 |
| 循环动画 | 2-10s | 呼吸效果、光环旋转 |

### 4.2 缓动函数
```css
/* 标准 */
transition: all 0.3s ease;

/* 弹性 */
transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 平滑 */
animation: float 8s ease-in-out infinite;
```

### 4.3 核心动画效果

#### 流光边框
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

#### 呼吸光环
```css
@keyframes ring-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}
```

#### 星星闪烁
```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
```

#### 飞入效果
```css
@keyframes fly-in {
  0% { opacity: 0; transform: translateY(30rpx) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## 五、页面布局规范

### 5.1 间距系统
| 名称 | 数值 | 用途 |
|------|------|------|
| xs | 10rpx | 紧密间距 |
| sm | 20rpx | 小间距 |
| md | 30rpx | 标准间距 |
| lg | 40rpx | 大间距 |
| xl | 60rpx | 区块间距 |

### 5.2 圆角系统
| 名称 | 数值 | 用途 |
|------|------|------|
| sm | 16rpx | 输入框、小按钮 |
| md | 24rpx | 卡片、图标容器 |
| lg | 32rpx | 大卡片、弹窗 |
| full | 50rpx | 按钮、头像 |

### 5.3 页面边距
```css
.page-container {
  padding: 40rpx 30rpx;
  min-height: 100vh;
}
```

---

## 六、字体规范

### 6.1 字体栈
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 6.2 字号规范
| 名称 | 大小 | 字重 | 用途 |
|------|------|------|------|
| H1 | 48rpx | 700 | 页面大标题 |
| H2 | 44rpx | 700 | 区块标题 |
| H3 | 36rpx | 600 | 卡片标题 |
| Body | 30rpx | 400 | 正文内容 |
| Caption | 24rpx | 400 | 辅助说明 |
| Small | 20rpx | 400 | 标签、徽章 |

---

## 七、背景特效规范

### 7.1 星轨背景
- 3层渐变轨道（蓝、粉、青）
- 浮动星星 15-20 颗
- 模糊半径 60-100rpx

### 7.2 动态元素
- 轨道动画时长：8-12s
- 星星闪烁：2s
- 呼吸效果：3s

---

## 八、使用示例

### 8.1 新页面模板
```vue
<template>
  <view class="page-container">
    <!-- 动态背景 -->
    <view class="star-trails">
      <view class="trail trail-1"></view>
      <view class="trail trail-2"></view>
      <view class="trail trail-3"></view>
    </view>
    
    <!-- 页面内容 -->
    <view class="content">
      <!-- 使用 glass-card 作为卡片容器 -->
      <!-- 使用 btn-primary 作为主要按钮 -->
    </view>
  </view>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 导入背景样式 */
.star-trails { /* ... */ }
</style>
```

---

## 九、版本记录

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2026-02-13 | 初版规范，基于已实现风格整理 |

---

> **后续开发约定：** 所有新功能页面必须遵循此规范，保持视觉一致性。
