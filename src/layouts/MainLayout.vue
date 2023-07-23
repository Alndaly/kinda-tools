<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-avatar class="cursor-pointer" @click="goHomePage">
          <img src="https://oss.kinda.info/image/202307240013660.png" />
        </q-avatar>
        <q-toolbar-title class="cursor-pointer" @click="goHomePage">
          {{ title }}
        </q-toolbar-title>
        <q-toggle :model-value="darkThemeStatus" @update:model-value="toggleDarkTheme" checked-icon="dark_mode"
          color="blue" unchecked-icon="sunny" />
        <div>当前版本：{{ version }}</div>
      </q-toolbar>

    </q-header>

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
import { useQuasar } from 'quasar';

const $q = useQuasar();

const appStore = useAppStore();
const { version, title, darkThemeStatus } = storeToRefs(appStore);

const toggleDarkTheme = () => {
  appStore.setDarkThemeStatus(!darkThemeStatus.value);
  $q.dark.toggle();
};

const router = useRouter()

const goHomePage = () => {
  router.push('/')
}
</script>
