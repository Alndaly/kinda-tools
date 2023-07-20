<template>
  <q-page class="q-pa-md">
    {{ tab }}
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const { operate } = route.query;
const tab = ref(operate)
</script>
