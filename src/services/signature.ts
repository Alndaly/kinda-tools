import { to, post } from '@/utils/request'
import API from '@/constants/api'

export const getOssSignature = async (params?: any) => to(post(API.signatureApi.ossSignature, params))
