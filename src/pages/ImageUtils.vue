<template>
  <q-page :style-fn="myTweak" class="q-pa-md">
    <q-banner rounded class="bg-primary text-white">
      压缩等级不完全代表压缩比例，即压缩等级X形成的图片大小不等于原图片大小*X/100。
    </q-banner>
    <div class="q-mt-md">
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
      <div v-if="origin_image_size">原文件大小: {{ origin_image_size }} KB</div>
    </div>

    <div class="q-mt-md column">
      <q-form @submit="onZipImage">
        <div class="column q-gutter-sm">
          <div class="column">
            <q-input type="number" :rules="zipDegreeRules" outlined class="col-xs-12 col-sm-12 col-md-9" dense
              v-model="zip_degree" label="压缩等级" hint="0-100对应压缩后文件由小到大" />
          </div>
          <div class="row justify-end q-mb-md">
            <q-btn color="primary" label="压缩图片" type="submit" :loading="zipStatus" />
          </div>
        </div>
      </q-form>

      <div v-if="!ziped_image_url" class="success-ziped-box flex full-width items-center justify-center rounded-borders">
        压缩完成后的图片将会显示在这里</div>
      <div>
        <q-img fit="cover" class="rounded-borders ziped-image" v-if="ziped_image_url" :src="ziped_image_url">
        </q-img>
        <div class="row q-gutter-md">
          <div v-if="ziped_image_size">压缩后文件大小: {{ ziped_image_size }} KB</div>
          <a v-if="ziped_image_url" :href="ziped_image_url" download>下载压缩后图片</a>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile, getOssClient } from '@/services/file';
import { imageZip } from '@/services/image'
import { to } from '@/utils/request';
import { useQuasar } from 'quasar';
import message from '@/utils/message';

const $q = useQuasar();
const inputRef = ref(null);
const uploadStatus = ref(false);
const zipStatus = ref(false);
const ziped_image_url = ref<string | null>(null);
const ziped_image_size = ref<number | null>(null);
const origin_image_url = ref<string | null>(null);
const origin_image_size = ref<number | null>(null);
const zip_degree = ref(50);

const zipDegreeRules = [
  (val: number) => (val <= 100 && val >= 0) || '请输入0-100内的整数',
  (val: number) => (val % 1 == 0) || '请输入整数',
]

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
  origin_image_size.value = files[0].size / 1024
  uploadStatus.value = false;
}

const onZipImage = async () => {
  zipStatus.value = true;
  const [res, err] = await imageZip({ image_url: origin_image_url.value, zip_degree: zip_degree.value });
  if (err) {
    message.error('出错啦');
    zipStatus.value = false;
    return;
  }
  console.log(res);
  zipStatus.value = false;
  ziped_image_url.value = res.data.image_url;
  ziped_image_size.value = res.data.image_size / 1024;
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

.success-ziped-box {
  min-height: 200px;
  border: 1px dotted #aaa;
}

.image-upload-box:hover {
  background-color: #cccccc33;
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
