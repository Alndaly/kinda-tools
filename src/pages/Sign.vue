<template>
  <q-layout>
    <q-page-container style="height: 100vh">
      <q-page class="fit row reverse wrap" :class="$q.screen.gt.xs ? 'justify-center items-center' : ''"
        :style-fn="myTweak">
        <div class="col-md-6 col-sm-12 col-xs-12 q-mb-md">
          <router-view></router-view>
        </div>
        <q-card v-if="$q.screen.gt.sm" class="col-md-6 col-sm-12 col-xs-12 q-mb-md no-shadow no-border window-height"
          square>
          <q-img src="/images/login.jpg" :img-class="$q.dark.isActive ? 'custom-image' : ''" no-native-menu fit="cover"
            style="height: 100%; width: 100%">
            <div class="absolute absolute-center text-center bg-transparent">
              <div class="text-h5 text-weight-bolder" style="font-family: 'LXGWWenKaiGBScreen'">
                醉后不知天在水，满船清梦压星河。
              </div>
              <div class="text-h6 q-mt-sm" style="font-family: 'LXGWWenKaiGBScreen'">
                唐珙《题龙阳县青草湖》
              </div>
            </div>
          </q-img>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
const myTweak = (offset: number) => {
  return [
    { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' },
    { height: offset ? `calc(100vh - ${offset}px)` : '100vh' },
  ];
};

const $q = useQuasar();

const d = new Date();
const hour = d.getHours(); //得到小时数
if ((hour >= 18 && hour <= 24) || (hour >= 0 && hour <= 6)) {
  $q.dark.toggle();
}
</script>

<style lang="scss">
.back {
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
}

.custom-image {
  filter: saturate(50%);
}
</style>
