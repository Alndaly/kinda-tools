<template>
  <q-card flat bordered class="q-pa-md">
    <q-input disable class="q-mb-md" outlined @update:model-value="onChangeEmail" v-model="userInfo.email" label="邮箱"
      ref="emailInstance" />
    <q-input v-if="showCodeInputBox" class="q-mb-md" outlined v-model="code" label="验证码">
      <template v-slot:after>
        <q-btn :label="ableToGetCode ? getCodeButtonLabel : `${timeLeft}s后再次请求`
          " :loading="getCodeStatus === 'doing'" color="primary" flat :disable="!ableToGetCode" @click="getCode" />
      </template>
    </q-input>
    <q-input class="q-mb-md" outlined v-model="userInfo.nickname" label="昵称" />
    <div class="row justify-end">
      <q-btn class="q-mr-md" outline color="primary" label="保存" @click="onSaveNewUserInfo" />
      <q-btn outline color="negative" label="恢复" @click="onRecoverUserInfo" />
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { userInfoUpdateEmail } from '@/services/user';
import { ref } from 'vue';
import message from '@/utils/message';

const emailInstance = ref<any>(null);

const code = ref('');
const timeLeft = ref<number>(60); // 默认的计时器时间
const ableToGetCode = ref<boolean>(true);
const showCodeInputBox = ref<boolean>(false);
const getCodeStatus = ref<'success' | 'doing' | 'todo' | 'failed'>('todo');
const getCodeButtonLabel = ref<string>('获取验证码');

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const onShowCodeInputBox = () => {
  showCodeInputBox.value = true
}
const onHideCodeInputBox = () => {
  showCodeInputBox.value = false
}

const onSaveNewUserInfo = async () => {
  const res = await userStore.onUpdateUserInfo({ email: userInfo.value.email, code: code.value, avatar: userInfo.value.avatar, nickname: userInfo.value.nickname })
  if (res) {
    message.success('更新成功')
  }
}

const onChangeEmail = (e: any) => {
  onShowCodeInputBox()
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
 * 获取验证码
 */
async function getCode() {
  const validateEmailRes = await emailInstance.value.validate();
  if (!validateEmailRes) return;
  ableToGetCode.value = false;
  getCodeStatus.value = 'doing';
  const [res, err] = await userInfoUpdateEmail({ email: userInfo.value.email });
  if (res) {
    message.success('邮件发送成功');
    getCodeStatus.value = 'success';
    startCountDown();
  } else {
    message.error('邮件发送失败');
    ableToGetCode.value = true;
    getCodeStatus.value = 'failed';
  }
}
const onRecoverUserInfo = () => {
  userStore.onGetUserInfo()
  onHideCodeInputBox()
}
</script>
