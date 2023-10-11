import { to, post } from '@/utils/request'
import API from '@/constants/api'

export const loginUser = async (params?: any) => to(post(API.userApi.userLogin, params))
export const updateUserInfo = async (params?: any) => to(post(API.userApi.userInfoUpdate, params))
export const userInfoUpdateEmail = async (params?: any) => to(post(API.userApi.userInfoUpdateEmail, params))
export const refreshLoginUser = async (params?: any) => to(post(API.userApi.userRefreshLogin, params))
export const createUserEmail = async (params?: any) => to(post(API.userApi.userCreateEmail, params))
export const createUser = async (params?: any) => to(post(API.userApi.userCreate, params))
export const getUserInfo = async (params?: any) => to(post(API.userApi.userInfo, params))
export const getApiKey = async (params?: any) => to(post(API.userApi.apiKey, params))
export const deleteApiKey = async (params?: any) => to(post(API.userApi.deleteApiKey, params))
export const addApiKey = async (params?: any) => to(post(API.userApi.addApiKey, params))
