import { v4 as uuidv4 } from 'uuid';
import cache from '@/utils/cache/index';
import qs from 'qs';
import { useUserStore } from '@/stores/user';
import message from '../message';

// 默认刷新状态，确保一旦遇到token过期的状况就能更新
let isTokenRefreshing = true;
// 防止多次请求token获取接口（限制三次，三次以后直接显示账号信息错误）
let refreshTokenTimes = 0;
// 被拦截的请求数组
let subscribers: any[] = [];

// 处理被缓存的请求
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  });
  // 处理完后清空缓存请求数组
  subscribers = [];
}

async function refreshToken() {
  if (refreshTokenTimes >= 3) {
    message.error('登陆信息已过期，即将跳转到登陆页面');
    cache.clear()
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    return;
  }
  isTokenRefreshing = true;
  refreshTokenTimes++;
  const userStore = useUserStore();
  const res = await userStore.onRefreshLoginUser();
  isTokenRefreshing = false;
  if (res) {
    onAccessTokenFetched();
  } else {
    refreshToken()
  }
}

// 将请求缓存到请求数组中
function addSubscriber(callback: any) {
  subscribers.push(callback)
}

const checkTokenRefreshStatus = (url: string, data: any, method: any) => {
  // 刷新token的函数,这需要添加一个开关，防止重复请求
  if (isTokenRefreshing) {
    refreshToken();
  }
  isTokenRefreshing = false;
  // 将当前的请求保存在观察者数组中
  const retryOriginalRequest = new Promise((resolve) => {
    addSubscriber(() => {
      resolve(request(url, data, method));
    });
  });
  return retryOriginalRequest;
};

export const request = (url: string, data: any, method: 'POST' | 'GET') => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Trace-Id', uuidv4())
  if (cache.directGet('access_token')) {
    headers.append('Authorization', 'Bearer ' + cache.directGet('access_token'));
  }
  return new Promise(async (resolve, reject) => {
    const options: any = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
    if (method === 'POST') {
      options.body = JSON.stringify({ ...data }) // body data type must match "Content-Type" header
    }
    let finalUrl = url;
    if (method === 'GET') {
      finalUrl = finalUrl + '?' + qs.stringify(data)
    }
    const response = await fetch(finalUrl, options);
    if (!response.ok) {
      // 权限问题
      if (response.status === 401) {
        resolve(checkTokenRefreshStatus(url, data, method))
        return
      }
      reject(response)
      return
    }
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      // 请求正常
      const backData = await response.json()
      resolve(backData)
      return;
    }
    resolve(response.body)
  })
}
