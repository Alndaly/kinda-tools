import { defineStore } from 'pinia';

interface AppStore {
  _version: string,
  _title: string,
  _darkThemeStatus: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    _version: '0.0.1',
    _title: 'UniAPI管理台',
    _darkThemeStatus: false
  }),
  getters: {
    version: (state) => state._version,
    title: (state) => state._title,
    darkThemeStatus: (state) => state._darkThemeStatus
  },
  actions: {
    setDarkThemeStatus(newStatus: boolean) {
      this._darkThemeStatus = newStatus
    }
  },
});
