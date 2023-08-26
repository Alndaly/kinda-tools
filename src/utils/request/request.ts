import { v4 as uuidv4 } from 'uuid';
import cache from '@/utils/cache/index';
import qs from 'qs';

interface ApiData {
  code: number,
  message: string,
  data: any,
}

export const request = (url: string, data: any, method: 'POST' | 'GET') => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
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
      options.body = JSON.stringify({ ...data, traceId: uuidv4() }) // body data type must match "Content-Type" header
    }
    let finalUrl = url;
    if (method === 'GET') {
      finalUrl = finalUrl + '?' + qs.stringify(data)
    }
    const response = await fetch(finalUrl, options);
    if (!response.ok) {
      reject(response)
      return;
    }
    if (response.headers.get('Content-Type') === 'application/json') {
      // 请求正常
      const backData: ApiData = await response.json()
      resolve(backData)
      return;
    }
    resolve(response.body)
  })
}
