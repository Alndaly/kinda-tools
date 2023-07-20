import cache from '@/utils/cache';
import { v4 as uuidv4 } from 'uuid';
import { updateLocalUploadKey } from '@/utils/file';

export const getOssClient = async (appName: string) => {
  if (appName === 'kinda-tools') {
    await updateLocalUploadKey();
    return new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: cache.get('access_key_id'),
      accessKeySecret: cache.get('access_key_secret'),
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: cache.get('security_token'),
      // 填写Bucket名称。
      bucket: 'kinda-tools'
    });
  }
}

export const uploadFile = async (ossClient: any, fileLocation: string, file: File) => {
  const fileName = uuidv4();
  // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
  // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
  // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
  let result = await ossClient.put(
    `${fileLocation}/${fileName + '.' + file.name.split('.').slice(-1)[0]}`,
    file,
    {
      'Host': 'upload.sunrise-luckyda.top'
    }
  );
  result = {
    ...result,
    url: result.url.replace('xiaododo.oss-cn-hangzhou.aliyuncs.com', 'upload.sunrise-luckyda.top')
  }
  return result;
}
