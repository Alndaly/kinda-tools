import { getUserInfo, loginUser, createUserEmail, createUser, refreshLoginUser, updateUserInfo } from '@/services/user'
import { defineStore } from 'pinia';
import cache from '@/utils/cache/index'
import message from '../utils/message';

interface UserInfoState {
  _userInfo: {
    id: number | null,
    nickname: string,
    avatar: string,
    username: string,
    email: string,
  }
  _password: string
}

interface UserLogin {
  email: string,
  password: string,
}

interface UserUpdate {
  email: string,
  code: string,
  avatar: string,
  nickname: string
}

export const useUserStore = defineStore('user', {
  state: (): UserInfoState => ({
    _userInfo: {
      id: null,
      nickname: '',
      username: '',
      avatar: '',
      email: '',
    },
    _password: ''
  }),
  getters: {
    userInfo: (state) => state._userInfo,
  },
  actions: {
    async onUpdateUserInfo({ email, code, avatar, nickname }: UserUpdate) {
      const [res, err] = await updateUserInfo({ email, code, avatar, nickname })
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      return true
    },
    async onLoginUser({ email, password }: UserLogin) {
      const [res, err] = await loginUser({
        email,
        password
      });
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      const {
        access_token,
        refresh_token
      } = res;
      cache.set('access_token', access_token);
      cache.set('refresh_token', refresh_token);
      return true;
    },
    async onRefreshLoginUser() {
      const refresh_token = cache.get('refresh_token')
      const [res, err] = await refreshLoginUser({
        refresh_token,
      });
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      cache.set('access_token', res.access_token);
      cache.set('refresh_token', res.refresh_token);
      return res;
    },
    async onGetUserInfo() {
      const [res, err] = await getUserInfo({});
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      this._userInfo = res;
    },
    async onGetCode(email: string) {
      const [res, err] = await createUserEmail({
        email
      });
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      return res
    },
    async onCreateUser(email: string, password: string, code: string) {
      const [res, err] = await createUser({
        email, password, code
      });
      if (err) {
        message.error(err?.message || '出错啦')
        return
      }
      return res
    }
  },
});
