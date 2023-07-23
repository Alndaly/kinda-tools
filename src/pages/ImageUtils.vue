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
          <q-btn color="primary" label="压缩图片" />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div>压缩后：</div>
          <q-btn color="primary" label="下载" @click="downLoadZipedImage" />
        </div>
      </template>

    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { uploadFile } from '@/services/file';
import { getOssClient } from '@/services/file';

const inputRef = ref(null);
const uploadStatus = ref(false);
const zipStatus = ref(false);
const origin_image = ref<File | null>(null);
const ziped_image = ref<string | null>(null);
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
  origin_image.value = files[0];
  const data = await uploadImage(files[0]);
  origin_image_url.value = data
  uploadStatus.value = false;
}

const downLoadZipedImage = () => {
  console.log(111)
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
