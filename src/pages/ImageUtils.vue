<template>
  <q-page class="q-pa-md">
    {{ tab }}
    <q-file v-model="image" label="选择图片" filled counter :counter-label="counterLabelFn" max-files="1"
      style="max-width: 300px">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <q-btn color="primary" label="压缩图片" @click="uploadImage" />
    <div>原图：</div>
    <div>压缩后：</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { uploadFile } from '@/services/file';
import { getOssClient } from '@/services/file';

const route = useRoute()
const { operate } = route.query;
const tab = ref(operate)
const image = ref<File | null>(null)

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }: any) => {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
}

const uploadImage = async () => {
  if (image.value) {
    const ossClient = await getOssClient('kinda-tools');
    const attachment = await uploadFile(ossClient, '/image', image.value);
    console.log(111, attachment)
    const url = ossClient && ossClient.signatureUrl(attachment.name, { expires: 600 });
    console.log(222, url)
  }
}

</script>
