# Starry Sky App 重设计方案

## 背景
Starry Sky App 当前以紫蓝渐变、玻璃拟态、3D 浮动效果为主，视觉基础优秀，但存在以下问题：
- **视觉层次感不足**：部分模块信息密集，容易造成用户阅读疲劳；
- **动态交互不足**：缺乏更细致的动效来提升整体的互动性与科技感；
- **样式复用性不高**：多处 CSS 代码重复，可抽象为模块化样式。

优化目标是强化星空主题，通过动态动效与清晰的布局结构，让用户体验更具沉浸感与流畅性。

---

## 优化方向

### 1. 配色方案

| 用途                | 渐变颜色（主色调）                        | 单色值（状态色） |
| ------------------- | ---------------------------------------- | ---------------- |
| 背景动态星轨         | `linear-gradient(135deg, #141E61, #511EA2)` | 无 |
| 按钮/高亮元素        | `linear-gradient(135deg, #667eea, #f093fb)` | `#f5576c`（警告/负）、`#38f9d7`（成功/正）|
| 文字/标题分级        | 主标题：#ffffff；副标题：rgba(255,255,255,0.8) | 无 |
| 毛玻璃背景/卡片容器   | `rgba(255,255,255,0.05)`；`backdrop-filter: blur(10px)` | 无 |

---

### 2. 首页（index）
#### 优化要点：
1. **顶部欢迎区改进：**
   - 添加一个动态星轨背景。
   - 交互增强：根据用户当前时间动态变化问候语。
2. **核心功能区精化：**
   - 使用边框流光动效（如 Hover 时动态渐变闪烁）。
   - 每个功能入口的按钮加入微小的缩放动画。
3. **模块统一布局：**
   - 调整 "热门目的地+快捷功能" 的网格布局比例，增加留白。统一卡片样式（毛玻璃风格）。
4. **天象事件展示：**
   - 可增加事件动态呈现，例如星星闪烁或光影流动（基于 CSS 动效）。

#### 优化代码实现（CSS/SCSS）：
```scss
.index-page {
  background: linear-gradient(135deg, #141e61, #511ea2); /* 星空渐变背景 */
}

.hero-card {
  border-radius: 32px;
  border: 2px solid rgba(102, 126, 234, 0.4);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }
}

.quick-icon {
  &:hover {
    background-size: 200%;
    animation: hover-gradient 2s infinite;
  }
}

@keyframes hover-gradient {
  0%, 100% { background-position: left top; }
  50% { background-position: bottom right; }
}
```

---

### 3. 我的页面（user）
#### 优化要点：
1. **头像区动效升级：**
   - 增加头像环绕旋转光环，随用户登录状态亮度动态变化。
   - Hover 时增加头像轻微浮动和光影震动。
2. **经验进度条：**
   - 加入星星碎片溢出动画，提示经验增长。
3. **成就徽章优化：**
   - 解锁徽章动态飞入效果，有背景光效根据代表稀有度调节明暗。
4. **功能菜单统一样式：**
   - 采用瀑布流布局方式，统一动效：按钮点击时出现轻微的波纹扩散动画。

#### 优化代码实现（CSS/SCSS）：
```scss
.avatar-section {
  .avatar-glow-ring {
    animation: ring-glow 8s linear infinite;
    @keyframes ring-glow {
      0%, 100% { transform: scale(1.0); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1.0; }
    }
  }
}

.exp-bar-fill {
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent);
    animation: shine 2s infinite;
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  }
}
```

---

### 4. 动效实现方案
- 动态背景实现：
```css
body {
  background: url('/static/images/stars-bg.gif') center fixed;
}
```
- 毛玻璃移动跟随：
```js
const tiltEffect = (event) => {
  const card = document.querySelector('.hero-card');
  const { clientX, clientY } = event;
  requestAnimationFrame(() => {
    card.style.transform = `rotate(${clientY/10}px)
  });
};