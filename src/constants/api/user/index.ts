import { uniApiUrlPrefix } from '@/configs/urls';

export default {
  userLogin: uniApiUrlPrefix + '/user/token',
  userInfoUpdateEmail: uniApiUrlPrefix + '/user/info/update/email',
  userInfoUpdate: uniApiUrlPrefix + '/user/info/update',
  userRefreshLogin: uniApiUrlPrefix + '/user/token/refresh',
  userCreateEmail: uniApiUrlPrefix + '/user/create/email',
  userCreate: uniApiUrlPrefix + '/user/create',
  userInfo: uniApiUrlPrefix + '/user/',
  apiKey: uniApiUrlPrefix + '/user/api-key/',
  deleteApiKey: uniApiUrlPrefix + '/user/api-key/delete',
  addApiKey: uniApiUrlPrefix + '/user/api-key/add',
}
