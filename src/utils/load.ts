export const loadJS = (url: string, callback?: any) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  callback && callback()
}
