<template>
  <view class="login-page">
    <StarBackground />
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- Logo区 -->
    <view class="logo-section">
      <view class="logo-container">
        <view class="logo-glow"></view>
        <text class="logo-icon">🌌</text>
      </view>
      
      <text class="logo-title">星空</text>
      <text class="logo-subtitle">探索属于你的宇宙</text>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form glass-card">
      <view class="form-tabs">
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'wechat' }"
          @click="loginType = 'wechat'"
        >
          <text class="tab-text">微信登录</text>
        </view>
        
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          <text class="tab-text">手机号</text>
        </view>
      </view>
      
      <!-- 微信登录 -->
      <view v-if="loginType === 'wechat'" class="wechat-login">
        <view class="login-tips">
          <text class="tips-text">一键登录，快速开启星空之旅</text>
        </view>
        
        <button 
          class="login-btn star-btn star-btn-primary"
          open-type="getPhoneNumber"
          @getphonenumber="handleWechatLogin"
        >
          <text class="btn-icon">💫</text>
          <text class="btn-text">微信一键登录</text>
        </button>
      </view>
      
      <!-- 手机号登录 -->
      <view v-else class="phone-login">
        <view class="input-group">
          <view class="input-item">
            <text class="input-label">手机号</text>
            <input 
              class="input-field"
              type="number"
              placeholder="请输入手机号"
              placeholder-class="placeholder"
              v-model="phone"
              maxlength="11"
            />
          </view>
          
          <view class="input-item">
            <text class="input-label">验证码</text>
            
            <view class="code-input">
              <input 
                class="input-field code-field"
                type="number"
                placeholder="请输入验证码"
                placeholder-class="placeholder"
                v-model="code"
                maxlength="6"
              />
              
              <view 
                class="code-btn"
                :class="{ disabled: countdown > 0 }"
                @click="sendCode"
              >
                <text class="code-btn-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <button 
          class="login-btn star-btn star-btn-primary"
          :disabled="!canSubmit"
          @click="handlePhoneLogin"
        >
          <text class="btn-text">登录</text>
        </button>
      </view>
      
      <!-- 协议 -->
      <view class="agreement">
        <view class="checkbox" @click="agreed = !agreed">
          <view class="checkbox-inner" :class="{ checked: agreed }">
            <text v-if="agreed" class="check-icon">✓</text>
          </view>
        </view>
        
        <text class="agreement-text">
          我已阅读并同意
          <text class="link" @click.stop="openAgreement">《用户协议》</text>
          和
          <text class="link" @click.stop="openPrivacy">《隐私政策》</text>
        </text>
      </view>
    </view>
    
    <!-- 游客入口 -->
    <view class="guest-entry">
      <text class="guest-text" @click="enterAsGuest">暂不登录，先看看 ➜</text>
    </view>
    
    <!-- 底部装饰 -->
    <view class="bottom-decoration">
      <view class="star-line"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarBackground from '@/components/StarBackground.vue'

// 登录类型
const loginType = ref<'wechat' | 'phone'>('wechat')

// 手机号登录数据
const phone = ref('')
const code = ref('')
const countdown = ref(0)
const agreed = ref(false)

// 能否提交
const canSubmit = computed(() => {
  return phone.value.length === 11 && code.value.length === 6 && agreed.value
})

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 发送验证码
const sendCode = () => {
  if (countdown.value > 0) return
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  // 模拟发送
  uni.showToast({ title: '验证码已发送', icon: 'success' })
  countdown.value = 60
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 微信登录
const handleWechatLogin = (e: any) => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  
  console.log('微信登录', e.detail)
  
  // 模拟登录成功
  setTimeout(() => {
    const userInfo = {
      avatar: 'https://picsum.photos/200',
      nickname: '星空旅人',
      constellation: '双鱼座'
    }
    
    uni.setStorageSync('token', 'mock_token_' + Date.now())
    uni.setStorageSync('userInfo', userInfo)
    
    uni.showToast({ 
      title: '登录成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1500)
      }
    })
  }, 1000)
}

// 手机号登录
const handlePhoneLogin = () => {
  if (!canSubmit.value) return
  
  // 模拟登录
  const userInfo = {
    avatar: 'https://picsum.photos/200',
    nickname: '星空旅人' + phone.value.slice(-4),
    constellation: '双鱼座'
  }
  
  uni.setStorageSync('token', 'mock_token_' + Date.now())
  uni.setStorageSync('userInfo', userInfo)
  
  uni.showToast({ 
    title: '登录成功',
    icon: 'success',
    success: () => {
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }
  })
}

// 游客进入
const enterAsGuest = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

// 打开协议
const openAgreement = () => {
  uni.showModal({
    title: '用户协议',
    content: '这里是用户协议内容...',
    showCancel: false
  })
}

const openPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '这里是隐私政策内容...',
    showCancel: false
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 50rpx;
}

/* 返回按钮 */
.back-btn {
  position: absolute;
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

/* Logo区 */
.logo-section {
  margin-top: 160rpx;
  margin-bottom: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.logo-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
  filter: blur(40rpx);
  animation: pulse 3s ease-in-out infinite;
}

.logo-icon {
  font-size: 100rpx;
  z-index: 1;
}

.logo-title {
  font-size: 56rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 40rpx rgba(100, 181, 246, 0.5);
  margin-bottom: 15rpx;
}

.logo-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 登录表单 */
.login-form {
  width: 100%;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.form-tabs {
  display: flex;
  margin-bottom: 40rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.tab-item {
  flex: 1;
  padding: 20rpx 0;
  text-align: center;
  position: relative;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -2rpx;
  left: 20%;
  right: 20%;
  height: 4rpx;
  background: linear-gradient(90deg, transparent, #64b5f6, transparent);
  border-radius: 2rpx;
}

.tab-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.6);
}

.tab-item.active .tab-text {
  color: #64b5f6;
  font-weight: 600;
}

/* 登录提示 */
.login-tips {
  text-align: center;
  margin-bottom: 40rpx;
}

.tips-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  margin-top: 30rpx;
}

.login-btn[disabled] {
  opacity: 0.5;
}

.btn-icon {
  font-size: 36rpx;
}

.btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 输入组 */
.input-group {
  margin-bottom: 30rpx;
}

.input-item {
  margin-bottom: 30rpx;
}

.input-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15rpx;
  display: block;
}

.input-field {
  height: 90rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #ffffff;
}

.placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.code-input {
  display: flex;
  gap: 20rpx;
}

.code-field {
  flex: 1;
}

.code-btn {
  width: 200rpx;
  height: 90rpx;
  background: rgba(100, 181, 246, 0.2);
  border: 1rpx solid rgba(100, 181, 246, 0.4);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-btn.disabled {
  opacity: 0.5;
}

.code-btn-text {
  font-size: 26rpx;
  color: #64b5f6;
  font-weight: 500;
}

/* 协议 */
.agreement {
  display: flex;
  align-items: flex-start;
  margin-top: 30rpx;
  gap: 15rpx;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.checkbox-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-inner.checked {
  background: #64b5f6;
  border-radius: 6rpx;
}

.check-icon {
  font-size: 24rpx;
  color: #ffffff;
}

.agreement-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.link {
  color: #64b5f6;
}

/* 游客入口 */
.guest-entry {
  margin-top: 20rpx;
}

.guest-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 底部装饰 */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  pointer-events: none;
}

.star-line {
  position: absolute;
  bottom: 100rpx;
  left: 10%;
  right: 10%;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.5), transparent);
}
</style>