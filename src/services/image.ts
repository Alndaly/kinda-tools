import { to, post } from '@/utils/request'
import API from '@/constants/api'

export const imageZip = async (params?: any) => to(post(API.imageApi.imageZip, params))
