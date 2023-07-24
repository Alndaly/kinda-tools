<template>
  <q-page class="q-pa-md index" :style-fn="myTweak">
    <q-banner rounded class="bg-primary text-white q-mb-md">
      欢迎使用Kinda的工具箱，我会慢慢的开发一些比较实用的小功能，方便以后使用，统一整理在这里。暂时建议使用电脑端Safrai/Chrome浏览器。
    </q-banner>
    <KindaTools></KindaTools>
  </q-page>
  <div class="flex justify-center items-center column q-pa-md bg-primary text-white">
    <div>
      Copyright © 2023 Kinda
    </div>
    <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2020037204号-3</a>
    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002016712" target="_blank">浙公网安备
      33011002016712号</a>
  </div>
</template>

<script setup lang="ts">
import KindaTools from 'components/KindaTools.vue';
import { ref } from 'vue';

const myTweak = (offset: number) => {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' }
}
</script>
<style lang="scss">
.body--dark {
  .index::after {
    background-color: #00000044;
  }
}

.body--light {
  .index::after {
    background-color: #00000022;
  }
}

.index::after {
  content: '';
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  backdrop-filter: blur(20px);
  width: 100%;
  height: 100%;
}

.index::before {
  content: '';
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-size: cover;
  background-image: url('https://oss.kinda.info/image/202307242146672.jpg') !important;
}
</style>
