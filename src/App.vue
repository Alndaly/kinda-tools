<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAppStore } from './stores/app';
const time = new Date();
const hour = time.getHours();
const $q = useQuasar();
const appStore = useAppStore();
if (hour > 18 || hour < 6) {
  // 设置为夜间模式
  $q.dark.set(true);
  appStore.setDarkThemeStatus(true);
}
// 设置为夜间模式
$q.dark.set(false);
appStore.setDarkThemeStatus(false);
</script>
