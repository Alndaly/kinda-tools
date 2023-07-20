import { getOssSignature } from '@/services/signature'
import cache from '../cache'

export const updateLocalUploadKey = async () => {
  // 如果本地缓存的上传密钥已经过期了那么就刷新
  if (!cache.get('SecurityToken')) {
    const [res, err] = await getOssSignature()
    const {
      data: {
        body: {
          credentials: {
            access_key_id, access_key_secret, security_token
          }
        }
      }
    } = res;
    cache.set('security_token', security_token, 2000)
    cache.set('access_key_secret', access_key_secret, 2000)
    cache.set('access_key_id', access_key_id, 2000)
  }
}
