import { to, post } from '@/utils/request'
import API from '@/constants/api'

export const getLicense = async (params?: any) => to(post(API.licenseApi.getLicenseList, params))
export const deleteLicense = async (params?: any) => to(post(API.licenseApi.deleteLicense, params))
export const addLicense = async (params?: any) => to(post(API.licenseApi.addLicense, params))
