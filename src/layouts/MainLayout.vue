<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-none">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-avatar class="cursor-pointer" @click="goHomePage">
          <img src="https://oss.kinda.info/image/202307240013660.png" />
        </q-avatar>
        <q-toolbar-title class="cursor-pointer" @click="goHomePage">
          {{ title }}
        </q-toolbar-title>
        <q-btn flat label="个人博客" @click="goBlog" />
        <q-btn flat label="UniAPI" @click="goUniAPI" />
        <a v-show="false" ref="blogBtnRef" href="https://huaqinda.com" target="_blank" rel="noopener noreferrer"></a>
        <a v-show="false" ref="uniAPIBtnRef" href="http://uniapi.top" target="_blank" rel="noopener noreferrer"></a>
        <q-toggle :model-value="darkThemeStatus" @update:model-value="toggleDarkTheme" checked-icon="dark_mode"
          color="blue" unchecked-icon="sunny" />
        <q-btn round color="white" @click="goPersonalPage" v-if="userInfo.id">
          <q-avatar>
            <img :src="userInfo.avatar" />
          </q-avatar>
        </q-btn>
        <q-btn @click="goLogin" v-else>
          登陆
        </q-btn>
      </q-toolbar>

    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <q-item clickable v-ripple to="/dashboard">
            <q-item-section>看板</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/api-key">
            <q-item-section>APIKEY</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/info">
            <q-item-section>我的</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { useQuasar } from 'quasar';

const leftDrawerOpen = ref(false)
const $q = useQuasar();

const uniAPIBtnRef = ref(null);
const blogBtnRef = ref(null);

const appStore = useAppStore();
const userStore = useUserStore();
const { title, darkThemeStatus } = storeToRefs(appStore);
const { userInfo } = storeToRefs(userStore);
userStore.onGetUserInfo();

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleDarkTheme = () => {
  appStore.setDarkThemeStatus(!darkThemeStatus.value);
  $q.dark.toggle();
};

const router = useRouter()

const goLogin = () => {
  router.push('/sign/login')
}

const goPersonalPage = () => {
  router.push('/user/info')
}

const goHomePage = () => {
  router.push('/')
}

const goUniAPI = () => {
  uniAPIBtnRef.value && uniAPIBtnRef.value.click()
}

const goBlog = () => {
  blogBtnRef.value && blogBtnRef.value.click()
}
</script>
