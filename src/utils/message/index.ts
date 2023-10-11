import { Notify } from 'quasar'
export default {
  error(message: string) {
    Notify.create({
      type: 'negative',
      position: 'top',
      message,
      timeout: 1000,
    });
  },
  success(message: string) {
    Notify.create({
      type: 'positive',
      position: 'top',
      message,
      timeout: 1000,
    });
  },
  info(message: string) {
    Notify.create({
      type: 'info',
      position: 'top',
      message,
      timeout: 1000,
    });
  },
  warning(message: string) {
    Notify.create({
      type: 'warning',
      position: 'top',
      message,
      timeout: 1000,
    });
  }
}
