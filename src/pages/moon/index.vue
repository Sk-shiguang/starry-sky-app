<template>
  <PageTransition type="scale" :duration="500">
    <view class="moon-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 标题 -->
    <view class="page-header">
      <text class="page-title">月相查询</text>
      
      <text class="page-subtitle">{{ currentDate }}</text>
    </view>
    
    <!-- 今日月相 -->
    <view class="moon-today glass-card"
>
      <view class="moon-display"
>
        <view class="moon-visual"
>
          <view class="moon-phase" :class="currentPhase.class"
>
            <view class="moon-shadow"></view>
          </view>
          
          <view class="moon-glow"></view>
        </view>
        
        <view class="moon-info"
>
          <text class="phase-name">{{ currentPhase.name }}</text>
          
          <text class="phase-desc">{{ currentPhase.desc }}</text>
          
          <view class="illumination"
>
            <text class="illum-label">照亮比例</text>
            
            <view class="illum-bar"
>
              <view class="illum-fill" :style="{ width: currentPhase.illumination + '%' }"></view>
            </view>
            
            <text class="illum-value">{{ currentPhase.illumination }}%</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 月出月落时间 -->
    <view class="moon-times glass-card"
>
      <view class="time-item"
>
        <view class="time-icon-wrapper"
>
          <text class="time-icon">🌅</text>
        </view>
        
        <view class="time-info"
>
          <text class="time-label">月出时间</text>
          
          <text class="time-value">{{ moonData.rise }}</text>
        </view>
      </view>
      
      <view class="time-divider"></view>
      
      <view class="time-item"
>
        <view class="time-icon-wrapper"
>
          <text class="time-icon">🌇</text>
        </view>
        
        <view class="time-info"
>
          <text class="time-label">月落时间</text>
          
          <text class="time-value">{{ moonData.set }}</text>
        </view>
      </view>
    </view>
    
    <!-- 月相日历 -->
    <view class="moon-calendar"
>
      <view class="calendar-header"
>
        <text class="calendar-title">月相日历</text>
        
        <view class="month-selector"
>
          <text class="month-btn" @click="prevMonth">‹</text>
          
          <text class="current-month">{{ currentYear }}年{{ currentMonth }}月</text>
          
          <text class="month-btn" @click="nextMonth">›</text>
        </view>
      </view>
      
      <view class="weekdays"
>
        <text v-for="day in weekdays" :key="day" class="weekday">{{ day }}</text>
      </view>
      
      <view class="days-grid"
>
        <view 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="day-cell"
          :class="{ 
            'other-month': !day.isCurrentMonth,
            'is-today': day.isToday,
            'has-phase': day.phase
          }"
          @click="selectDay(day)"
        >
          <text class="day-number">{{ day.date }}</text>
          
          <text v-if="day.phase" class="day-phase">{{ day.phase }}</text>
        </view>
      </view>
    </view>
    
    <!-- 月相说明 -->
    <view class="phase-info glass-card"
>
      <text class="info-title">月相小知识</text>
      
      <view class="info-content"
>
        <text class="info-text">{{ moonInfo }}</text>
      </view>
      
      <view class="phases-legend"
>
        <view v-for="p in phases" :key="p.name" class="legend-item"
>
          <text class="legend-icon">{{ p.icon }}</text>
          
          <text class="legend-name">{{ p.name }}</text>
        </view>
      </view>
    </view>
  </view>
  </PageTransition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'
import PageTransition from '@/components/PageTransition.vue'

// 当前日期
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const selectedDate = ref(today.getDate())

const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 月相数据
const currentPhase = ref({
  name: '蛾眉月',
  class: 'waxing-crescent',
  desc: '新月之后，月亮逐渐变亮，呈现弯弯的月牙形状',
  illumination: 15
})

const moonData = ref({
  rise: '10:23',
  set: '23:45'
})

// 星期
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 月相类型
const phases = [
  { name: '新月', icon: '🌑' },
  { name: '蛾眉月', icon: '🌒' },
  { name: '上弦月', icon: '🌓' },
  { name: '盈凸月', icon: '🌔' },
  { name: '满月', icon: '🌕' },
  { name: '亏凸月', icon: '🌖' },
  { name: '下弦月', icon: '🌗' },
  { name: '残月', icon: '🌘' }
]

// 日历数据
const calendarDays = computed(() => {
  const days = []
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const prevLastDay = new Date(year, month - 1, 0)
  
  const firstDayWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()
  const prevTotalDays = prevLastDay.getDate()
  
  // 上月日期
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const date = prevTotalDays - i
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      phase: getPhaseForDate(year, month - 1, date)
    })
  }
  
  // 当月日期
  const today = new Date()
  for (let i = 1; i <= totalDays; i++) {
    const isToday = year === today.getFullYear() && 
                   month === today.getMonth() + 1 && 
                   i === today.getDate()
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      phase: getPhaseForDate(year, month, i)
    })
  }
  
  // 下月日期
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      phase: getPhaseForDate(year, month + 1, i)
    })
  }
  
  return days
})

// 获取某天的月相（简化模拟）
const getPhaseForDate = (year: number, month: number, date: number) => {
  const dayOfMonth = date
  if (dayOfMonth === 1) return '🌑'
  if (dayOfMonth === 8) return '🌓'
  if (dayOfMonth === 15) return '🌕'
  if (dayOfMonth === 22) return '🌗'
  return ''
}

// 月相说明
const moonInfo = ref(`月相是指从地球上看到的月球被太阳照明部分的形状。月球绕地球公转一周约需29.5天，这期间我们会看到月亮呈现出不同的形状，这就是月相变化。

今天是蛾眉月，月亮呈现细细的月牙形状。这个时期的月亮在黄昏后出现在西方天空，是拍摄月亮与地景合影的好时机。`)

// 选择日期
const selectDay = (day: any) => {
  if (!day.isCurrentMonth) return
  selectedDate.value = day.date
}

// 切换月份
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.moon-page {
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

/* 今日月相 */
.moon-today {
  padding: 40rpx;
  margin-bottom: 30rpx;
}

.moon-display {
  display: flex;
  align-items: center;
}

.moon-visual {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-right: 40rpx;
}

.moon-phase {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f5f3e8;
  position: relative;
  overflow: hidden;
  box-shadow: inset -20rpx -20rpx 40rpx rgba(0, 0, 0, 0.1);
}

.moon-shadow {
  position: absolute;
  top: 0;
  right: 0;
  width: 85%;
  height: 100%;
  background: #2a2a4a;
  border-radius: 50%;
}

.moon-glow {
  position: absolute;
  top: -20rpx;
  left: -20rpx;
  right: -20rpx;
  bottom: -20rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 243, 232, 0.3) 0%, transparent 70%);
  filter: blur(20rpx);
}

.moon-info {
  flex: 1;
}

.phase-name {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15rpx;
  display: block;
}

.phase-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 25rpx;
  display: block;
}

.illumination {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.illum-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.illum-bar {
  flex: 1;
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
}

.illum-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.illum-value {
  font-size: 26rpx;
  color: #64b5f6;
  font-weight: 600;
}

/* 月出月落时间 */
.moon-times {
  display: flex;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.time-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.time-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25rpx;
}

.time-icon {
  font-size: 40rpx;
}

.time-info {
  display: flex;
  flex-direction: column;
}

.time-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8rpx;
}

.time-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.time-divider {
  width: 1rpx;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 30rpx;
}

/* 月相日历 */
.moon-calendar {
  margin-bottom: 30rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.calendar-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.month-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 28rpx;
  color: #ffffff;
}

.current-month {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 15rpx;
}

.weekday {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  padding: 15rpx 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10rpx;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.05);
}

.day-cell.other-month {
  opacity: 0.4;
}

.day-cell.is-today {
  background: rgba(100, 181, 246, 0.3);
  border: 1rpx solid rgba(100, 181, 246, 0.5);
}

.day-number {
  font-size: 26rpx;
  color: #ffffff;
}

.day-phase {
  font-size: 24rpx;
  margin-top: 4rpx;
}

/* 月相说明 */
.phase-info {
  padding: 30rpx;
}

.info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20rpx;
  display: block;
}

.info-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  padding: 25rpx;
  margin-bottom: 25rpx;
}

.info-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
}

.phases-legend {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.legend-icon {
  font-size: 40rpx;
}

.legend-name {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}
</style>