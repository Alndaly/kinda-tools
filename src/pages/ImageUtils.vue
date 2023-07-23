<template>
  <q-page :style-fn="myTweak">
    <q-splitter v-model="splitterModel" class="full-width" style="height: 100%;">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="full-width image-upload-box flex justify-center items-center rounded-borders column cursor-pointer"
            :style="{ backgroundColor: uploadStatus ? '#f2f2f2' : '', backgroundImage: `url(${origin_image_url})` }"
            @click="onUploadFile">
            <div class="column justify-center items-center q-gutter-xs" v-if="!uploadStatus">
              <q-icon name="cloud_upload" style="font-size: 2em" class="text-primary" />
              <div>
                点击上传图片
              </div>
            </div>
            <div class="column justify-center items-center q-gutter-xs" v-if="uploadStatus">
              <q-icon name="refresh" style="font-size: 2em" class="text-primary refresh" />
              <div>上传中...</div>
            </div>
            <input ref="inputRef" multiple="false" accept="image/*" name="image" id="image" type="file" v-show="false"
              @change="handleChange" />
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <q-btn color="primary" label="压缩图片" @click="onZipImage" :loading="zipStatus" />
          <q-img v-if="ziped_image_url" :src="ziped_image_url" />
        </div>
      </template>

    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile, getOssClient } from '@/services/file';
import { imageZip } from '@/services/image'
import { to } from '@/utils/request';
import message from '@/utils/message';

const inputRef = ref(null);
const uploadStatus = ref(false);
const zipStatus = ref(false);
const ziped_image_url = ref<string | null>(null);
const origin_image_url = ref<string | null>(null);
const splitterModel = ref(50); // start at 50%

const uploadImage = async (file: File) => {
  if (file) {
    const ossClient = await getOssClient('kinda-tools');
    const attachment = await uploadFile(ossClient, '/image', file);
    const url = ossClient && ossClient.signatureUrl(attachment.name, { expires: 600 });
    return url;
  }
  return null;
}

const onUploadFile = () => {
  if (uploadStatus.value) return;
  inputRef.value && inputRef.value.click();
}

const handleChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  uploadStatus.value = true;
  const data = await uploadImage(files[0]);
  origin_image_url.value = data
  uploadStatus.value = false;
}

const onZipImage = async () => {
  zipStatus.value = true;
  const [res, err] = await imageZip({ image_url: origin_image_url.value, zip_degree: 20 });
  if (err) {
    message.error('出错啦');
    zipStatus.value = false;
    return;
  }
  console.log(res);
  zipStatus.value = false;
  ziped_image_url.value = res.data.image_url;
  message.success('压缩成功');
}

const myTweak = (offset: number) => {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' }
}

</script>
<style lang="scss">
.image-upload-box {
  min-height: 200px;
  border: 1px dotted #aaa;
  transition: all .1s ease-in-out;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.image-upload-box:hover {
  background-color: #f2f2f2;
}

.refresh {
  -webkit-animation: rotate-center 1s ease-in-out infinite both;
  animation: rotate-center 1s ease-in-out infinite both;
}

@keyframes rotate-center {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
