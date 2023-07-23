<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="goHomePage">
          {{ title }}
        </q-toolbar-title>
        <div>{{ version }}</div>
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

const appStore = useAppStore();
const { version, title } = storeToRefs(appStore);

const router = useRouter()

const goHomePage = () => {
  router.push('/')
}
</script>
