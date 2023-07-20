import { defineStore } from 'pinia';

interface AppStore {
  _version: string,
  _title: string,
  _darkThemeStatus: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    _version: '0.0.1',
    _title: 'Kinda的工具箱',
    _darkThemeStatus: false
  }),
  getters: {
    version: (state) => state._version,
    title: (state) => state._title,
  },
  actions: {
    setDarkThemeStatus(status: boolean) {
      this._darkThemeStatus = status
    }
  },
});
