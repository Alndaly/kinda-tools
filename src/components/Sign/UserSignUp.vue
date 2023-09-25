<template>
  <q-card class="no-shadow bg-transparent" :style="`padding: ${$q.screen.gt.xs ? '0 100px' : '0 20px'} `">
    <q-card-section>
      <div class="q-pt-lg">
        <div class="col text-h4 text-weight-bold ellipsis">注册</div>
        <div class="col q-mt-sm text-body1 ellipsis">期待你的加入</div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent.stop="onSubmit" class="q-gutter-md" id="registerForm">
        <q-input outlined v-model="email" ref="emailInstance" type="email" clearable name="email" label="邮箱" lazy-rules
          :rules="emailRules()" />
        <q-input outlined v-model="verifyCode" label="验证码" name="verifyCode" lazy-rules :rules="[
          (val: string) => (val && val.length > 0) || '请输入验证码',
        ]">
          <template v-slot:after>
            <q-btn :label="ableToGetCode ? getCodeButtonLabel : `${timeLeft}s后再次请求`
              " :loading="getCodeStatus === 'doing'" color="primary" flat :disable="!ableToGetCode" @click="getCode" />
          </template>
        </q-input>

        <q-input outlined type="password" v-model="password" label="密码" name="pasasword" lazy-rules :rules="[
          (val: string) =>
            (val !== null && val !== '') || '请输入密码',
        ]" />
        <q-input outlined type="password" v-model="passwordAgain" label="确认密码" name="passwordAgain" lazy-rules
          :rules="passwordAgainRules(password)" />
      </q-form>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn form="registerForm" type="submit" :loading="signUpLoading" label="注册"
        class="bg-primary text-white text-capitalize signin full-width" color="primary" style="font-size: 20px" />
      <div class="text-subtitle1 q-my-md">or</div>
      <div class="text-center items-center text-body1">
        <q-btn flat rectangle class="text-success q-focusable q-hoverable text-capitalize" @click="goLogin">
          返回登录
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { passwordAgainRules, emailRules } from '@/common/FormRules/signUp';
import message from '@/utils/message';

const router = useRouter();
const userStore = useUserStore();
const email = ref<string>('');
const verifyCode = ref<string>('');
const password = ref<string>('');
const passwordAgain = ref<string>('');
const timeLeft = ref<number>(60); // 默认的计时器时间
const ableToGetCode = ref<boolean>(true);
const getCodeStatus = ref<'success' | 'doing' | 'todo' | 'failed'>('todo');
const getCodeButtonLabel = ref<string>('获取验证码');
const signUpLoading = ref<boolean>(false);

// DOM实例
const emailInstance = ref<any>(null);

/**
 * 提交表单->注册
 */
async function onSubmit() {
  signUpLoading.value = true;
  const res = await userStore.onCreateUser(
    email.value,
    password.value,
    verifyCode.value
  );
  if (res) {
    signUpLoading.value = false;
    message.success('注册成功');
    router.push('/login');
  } else {
    signUpLoading.value = false;
  }
}

/**
 * 开始倒计时
 */
function startCountDown() {
  const timeInterval = setInterval(() => {
    timeLeft.value--;
    if (!(timeLeft.value > 0)) {
      window.clearInterval(timeInterval);
      ableToGetCode.value = true;
    }
  }, 1000);
  return timeInterval;
}

/**
 * 去登陆页面
 */
function goLogin() {
  router.push('login');
}

/**
 * 获取验证码
 */
async function getCode() {
  const validateEmailRes = await emailInstance.value.validate();
  if (!validateEmailRes) return;
  ableToGetCode.value = false;
  getCodeStatus.value = 'doing';
  const res = await userStore.onGetCode(email.value);
  if (res) {
    message.success('邮件发送成功');
    getCodeStatus.value = 'success';
    startCountDown();
  } else {
    ableToGetCode.value = true;
    getCodeStatus.value = 'failed';
  }
}
</script>
<style lang="scss">
.signin {
  background-image: linear-gradient(310deg, #2dce89, #2dcecc) !important;
  border-radius: 8px;
}
</style>
