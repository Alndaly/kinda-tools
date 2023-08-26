import { to, post } from '@/utils/request'
import API from '@/constants/api'

export const chat = async (params?: any) => to(post(API.aiApi.chat, params))
