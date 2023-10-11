<template>
  <q-card class="no-shadow bg-transparent" :style="`padding: ${$q.screen.gt.xs ? '0 100px' : '0 20px'} `">
    <q-card-section>
      <div>
        <div class="col text-h4 text-weight-bold ellipsis">欢迎使用UniAPI服务</div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md" id="loginForm">
        <q-input outlined v-model="email" label="邮箱" name="email" lazy-rules :rules="emailRules()" />

        <q-input outlined type="password" v-model="password" name="password" label="密码" lazy-rules :rules="[
          (val: string) =>
            (val !== null && val !== '') || '请输入密码',
        ]" />
      </q-form>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn form="loginForm" type="submit" label="登录" :loading="loginLoading"
        class="bg-primary text-white text-capitalize signin full-width" color="primary" style="font-size: 20px" />
      <div class="text-subtitle1 q-my-md">or</div>
      <div class="text-center items-center text-body1">
        没有账号？
        <q-btn flat rectangle class="q-focusable q-hoverable text-capitalize" @click="goSignUp">
          注册
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { emailRules } from '@/common/FormRules/signUp';
const router = useRouter();
const userStore = useUserStore();
const email = ref<string>('');
const password = ref<string>('');
const loginLoading = ref<boolean>(false);

async function onSubmit() {
  loginLoading.value = true;
  const res = await userStore.onLoginUser({
    email: email.value,
    password: password.value,
  });
  if (res) {
    loginLoading.value = false;
    router.push('/');
  } else {
    loginLoading.value = false;
  }
}
function goSignUp() {
  router.push('signUp');
}
</script>
<style lang="scss">
.signin {
  background-image: linear-gradient(310deg, #2dce89, #2dcecc) !important;
  border-radius: 8px;
}
</style>
