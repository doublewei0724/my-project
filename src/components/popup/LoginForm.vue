<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { closeToast, showLoadingToast, showToast } from 'vant'
import { usePopupStore } from '@/stores/popup'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()
const popupStore = usePopupStore()

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const username = ref('mor_2314')
const password = ref('83r5^_')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    closeToast()
    showToast({ message: t('login.empty_error'), type: 'fail' })
    return
  }
  closeToast()
  showLoadingToast({
    // 登入中
    message: t('login.loading'),
    forbidClick: true,
  })

  try {
    const response = await axios.post('https://fakestoreapi.com/auth/login', {
      username: username.value,
      password: password.value,
    })

    if (response.data.token) {
      userStore.setToken(response.data.token)
      // 登入成功
      closeToast()
      showToast({ message: t('login.success'), type: 'success' })
      popupStore.closePopup()

      setTimeout(() => {
        popupStore.closePopup()
      }, 500)
    }
  } catch (error: any) {
    closeToast()
    showToast({ message: t('login.fail'), type: 'fail' })
    console.error('Login Error:', error)
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold tracking-wide text-white">{{ t('login.title') }}</h2>
      <p class="mt-2 text-sm text-gray-400">{{ t('login.desc') }}</p>
    </div>

    <div class="w-full space-y-4">
      <div class="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <van-field
          v-model="username"
          :label="t('login.username')"
          :placeholder="t('login.placeholder_user')"
          label-class="!text-gray-400"
          class="!bg-transparent !py-4"
        />
        <van-field
          v-model="password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :label="t('login.password')"
          :placeholder="t('login.placeholder_pass')"
          :right-icon="isPasswordVisible ? 'closed-eye' : 'eye-o'"
          label-class="!text-gray-400"
          class="!bg-transparent !py-4"
          @click-right-icon="togglePasswordVisibility"
        />
      </div>

      <button
        @click="handleLogin"
        class="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
      >
        {{ t('login.confirm') }}
      </button>

      <p class="text-center text-xs text-gray-500">
        {{ t('login.test_account') }}: mor_2314 / {{ t('login.password') }}: 83r5^_
      </p>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-field__control) {
  color: white !important;
}
:deep(.van-cell__value) {
  color: white !important;
}
</style>
