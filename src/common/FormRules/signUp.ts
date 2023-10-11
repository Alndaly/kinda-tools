import { testPattern } from '@/common/Regex/testPattern';

export const passwordAgainRules = (password: string) => [
  (val: string) =>
    (val !== null && val !== '') || '请再次输入密码',
  (val: string) =>
    (val === password) || '两次密码不一致'
]
export const emailRules = () => [
  (val: string) => (val && val.length > 0) || '请输入邮箱',
  (val: string) => testPattern.email(val) || '请输入正确的邮箱格式'
]
