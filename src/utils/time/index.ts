/**
   * 计算时间差
   * @param {*} timeStamp
   */
export const differTime = (timeStamp: number) => {
  const nowTimeStamp = new Date().getTime();
  const differ = nowTimeStamp - timeStamp;
  const seconds = Math.floor(differ / 1000);
  if (seconds < 10) {
    return '刚刚';
  }
  if (seconds < 60) {
    return `${seconds}秒前`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}天前`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks}星期前`;
  }
  const months = Math.floor(weeks / 4);
  if (months < 12) {
    return `${months}月前`;
  }
  const years = Math.floor(months / 12);
  return `${years}年内`;
}
