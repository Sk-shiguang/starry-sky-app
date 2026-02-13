/**
 * 菜单 API 模块
 * 使用 uni-app Storage 实现本地数据存储
 * 遵循 MenuDesign.md 中的 FoodItem 接口定义
 */

/**
 * 食品项目接口定义
 */
export interface FoodItem {
  id: string;           // 唯一ID
  name: string;         // 菜品名称
  category: 'chinese' | 'western' | 'japanese' | 'korean' | 'simple';  // 分类
  difficulty: 1 | 2 | 3;  // 难度: 1简单 2中等 3复杂
  tags: string[];       // 标签: ['辣', '清淡', '快手']
  icon: string;         // 菜品emoji图标
  image?: string;       // 菜品图片（可选）
  isTakeout: boolean;   // 是否可外卖
  recipe?: Recipe;      // 食谱信息（自己做饭时显示）
  createdAt: number;    // 创建时间戳
  updatedAt: number;    // 更新时间戳
}

/**
 * 食谱接口定义
 */
export interface Recipe {
  ingredients: string[];    // 食材清单
  steps: string[];          // 制作步骤
  time: string;             // 预计时间
  tips?: string;            // 小贴士
}

// 菜品分类映射
const CATEGORY_MAP = {
  chinese: '中餐',
  western: '西餐',
  japanese: '日料',
  korean: '韩料',
  simple: '简餐'
};

const STORAGE_KEY = 'menu_items';

/**
 * 菜单 API 类
 */
class MenuAPI {
  /**
   * 初始化默认菜品（如果没有数据）
   */
  static initDefaultItems(): void {
    const existing = uni.getStorageSync(STORAGE_KEY);
    if (existing && Array.isArray(existing) && existing.length > 0) {
      return;
    }

    const defaultItems: FoodItem[] = [
      {
        id: 'item_1',
        name: '红烧牛肉面',
        category: 'chinese',
        difficulty: 2,
        tags: ['辣', '下饭'],
        icon: '🍜',
        isTakeout: true,
        recipe: {
          ingredients: ['牛肉 200g', '面条 150g', '青菜 适量', '豆瓣酱 1勺', '生抽 2勺'],
          steps: ['牛肉切块焯水', '热锅凉油爆香豆瓣酱', '加入牛肉翻炒', '加水烧开转小火炖30分钟', '煮面条沥干放入碗中', '浇上汤汁即可'],
          time: '50分钟',
          tips: '牛肉焯水时加料酒去腥，炖的时候要保持小火'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_2',
        name: '日式便当',
        category: 'japanese',
        difficulty: 2,
        tags: ['清淡', '营养'],
        icon: '🍱',
        isTakeout: true,
        recipe: {
          ingredients: ['米饭 100g', '鸡蛋 1个', '番茄 1个', '黄瓜 适量', '午餐肉 50g'],
          steps: ['米饭盛入便当盒', '番茄切块铺垫', '煎鸡蛋后切块', '黄瓜切条', '午餐肉煎热', '排盘装盒'],
          time: '20分钟',
          tips: '可提前一晚准备，冷便当也很好吃'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_3',
        name: '蔬菜沙拉',
        category: 'western',
        difficulty: 1,
        tags: ['清淡', '健身'],
        icon: '🥗',
        isTakeout: true,
        recipe: {
          ingredients: ['生菜 100g', '番茄 1个', '黄瓜 1根', '玉米粒 50g', '沙拉酱 2勺'],
          steps: ['所有蔬菜洗净切块', '放入沙拉碗中', '加入沙拉酱混合即可'],
          time: '10分钟',
          tips: '可以根据个人口味添加不同的蔬菜'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_4',
        name: '担担面',
        category: 'chinese',
        difficulty: 2,
        tags: ['辣', '下饭'],
        icon: '🍲',
        isTakeout: true,
        recipe: {
          ingredients: ['面条 150g', '花生酱 2勺', '芝麻酱 1勺', '辣油 1勺', '葱段 适量'],
          steps: ['煮面条至熟沥干', '花生酱和芝麻酱混合', '加热水调匀', '加入辣油和盐调味', '面条放入碗中', '倒入酱汁撒葱段即可'],
          time: '15分钟',
          tips: '酱料要充分混合，可以根据个人口味调整辣度'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_5',
        name: '番茄鸡蛋面',
        category: 'chinese',
        difficulty: 1,
        tags: ['快手', '清汤'],
        icon: '🍝',
        isTakeout: false,
        recipe: {
          ingredients: ['面条 150g', '番茄 2个', '鸡蛋 2个', '盐 适量', '油 2勺'],
          steps: ['番茄切块，鸡蛋打入碗中', '热油锅炒番茄出汁', '加水烧开加面条', '煮至半熟时打入鸡蛋', '调味即可'],
          time: '12分钟',
          tips: '番茄要炒出汁液才能有好味道'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_6',
        name: '韩式烤肉',
        category: 'korean',
        difficulty: 2,
        tags: ['烧烤', '宴请'],
        icon: '🥩',
        isTakeout: true,
        recipe: {
          ingredients: ['牛肉片 300g', '生抽 3勺', '糖 2勺', '葱段 适量', '芝麻油 1勺'],
          steps: ['混合生抽、糖、芝麻油制作腌料', '牛肉片腌制30分钟', '烤盘预热至高温', '烤肉片2-3分钟每面', '撒葱段和芝麻'],
          time: '35分钟（含腌制）',
          tips: '腌制时间越长味道越好，烤的时候火候要掌握好'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_7',
        name: '番茄意面',
        category: 'western',
        difficulty: 2,
        tags: ['意大利', '清淡'],
        icon: '🍝',
        isTakeout: false,
        recipe: {
          ingredients: ['意面 150g', '番茄酱 3勺', '洋葱 1/4个', '大蒜 2瓣', '橄榄油 2勺'],
          steps: ['洋葱和大蒜切碎', '热油炒香洋葱和蒜', '加入番茄酱炒匀', '加水烧开转小火炖10分钟', '煮意面沥干', '混合酱汁即可'],
          time: '25分钟',
          tips: '番茄酱要充分炒香才能出好味道'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'item_8',
        name: '榨菜肉丝面',
        category: 'simple',
        difficulty: 1,
        tags: ['快手', '下饭'],
        icon: '🍜',
        isTakeout: false,
        recipe: {
          ingredients: ['面条 150g', '肉丝 100g', '榨菜 50g', '青葱 适量', '盐 适量'],
          steps: ['热油炒肉丝至变色', '加入榨菜炒香', '加水烧开放面条', '煮至面熟调味', '撒葱段即可'],
          time: '10分钟',
          tips: '榨菜本身很咸，要少加盐'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    try {
      uni.setStorageSync(STORAGE_KEY, defaultItems);
    } catch (e) {
      console.error('初始化菜品失败:', e);
    }
  }

  /**
   * 获取所有菜品
   */
  static getAll(): FoodItem[] {
    try {
      const items = uni.getStorageSync(STORAGE_KEY);
      return Array.isArray(items) ? items : [];
    } catch (e) {
      console.error('获取菜品失败:', e);
      return [];
    }
  }

  /**
   * 添加菜品
   */
  static add(item: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>): FoodItem {
    const items = this.getAll();
    const newItem: FoodItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    items.push(newItem);
    try {
      uni.setStorageSync(STORAGE_KEY, items);
      return newItem;
    } catch (e) {
      console.error('添加菜品失败:', e);
      throw e;
    }
  }

  /**
   * 更新菜品
   */
  static update(id: string, updates: Partial<Omit<FoodItem, 'id' | 'createdAt'>>): FoodItem | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      console.warn('菜品不存在:', id);
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: Date.now()
    };

    items[index] = updatedItem;
    try {
      uni.setStorageSync(STORAGE_KEY, items);
      return updatedItem;
    } catch (e) {
      console.error('更新菜品失败:', e);
      throw e;
    }
  }

  /**
   * 删除菜品
   */
  static delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === items.length) {
      console.warn('菜品不存在，删除失败:', id);
      return false;
    }

    try {
      uni.setStorageSync(STORAGE_KEY, filteredItems);
      return true;
    } catch (e) {
      console.error('删除菜品失败:', e);
      throw e;
    }
  }

  /**
   * 按分类筛选菜品
   */
  static getByCategory(category: string): FoodItem[] {
    const items = this.getAll();
    if (category === 'all') {
      return items;
    }
    return items.filter(item => item.category === category);
  }

  /**
   * 随机获取一个菜品
   */
  static getRandom(): FoodItem | null {
    const items = this.getAll();
    if (items.length === 0) {
      return null;
    }
    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * 按分类随机获取菜品
   */
  static getRandomByCategory(category: string): FoodItem | null {
    const items = this.getByCategory(category);
    if (items.length === 0) {
      return null;
    }
    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * 获取菜品总数
   */
  static getCount(): number {
    return this.getAll().length;
  }

  /**
   * 按难度获取菜品
   */
  static getByDifficulty(difficulty: 1 | 2 | 3): FoodItem[] {
    const items = this.getAll();
    return items.filter(item => item.difficulty === difficulty);
  }

  /**
   * 获取可外卖的菜品
   */
  static getTakeout(): FoodItem[] {
    const items = this.getAll();
    return items.filter(item => item.isTakeout);
  }

  /**
   * 清空所有菜品（谨慎使用）
   */
  static clear(): void {
    try {
      uni.setStorageSync(STORAGE_KEY, []);
    } catch (e) {
      console.error('清空菜品失败:', e);
    }
  }
}

export default MenuAPI;
