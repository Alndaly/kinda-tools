<template>
  <div class="row q-col-gutter-sm">
    <div v-for="tool in tools" :key="tool.id" class="col-xs-12 col-sm-6 col-md-3">
      <q-card class="tool-card cursor-pointer" @click="goToolPage(tool.path)">
        <q-img :src="tool.image" />
        <q-card-section>
          <div class="text-h6">{{ tool.title }}</div>
          <div class="text-subtitle2">开发者：{{ tool.author }}</div>

        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ tool.detail }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const tools = ref([
  {
    id: 0,
    image: 'https://oss.kinda.info/image/202307201418918.jpg',
    title: '图片压缩',
    detail: '压缩图片大小',
    author: 'Kinda Hall',
    path: '/image?operate=zip'
  },
  {
    id: 1,
    image: 'https://oss.kinda.info/image/202307201418918.jpg',
    title: 'AI聊天',
    detail: '和AI对话',
    author: 'Kinda Hall',
    path: '/ai/chat'
  }
])

const goToolPage = (path: string) => {
  router.push(path)
}

</script>
<style lang="scss">
.tool-card {
  transition: all .3s ease-in-out;
}

.tool-card:hover {
  transform: translateY(-5px);
}
</style>
