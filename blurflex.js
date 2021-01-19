/* 失去焦点的兼容处理 针对iOS */

// 滚动到可视区
const handleBlur = () => {
  const root = document.querySelector('#root');

  if (root) {
    if ('scrollIntoView' in root) {
      root.scrollIntoView();
    } else {
      clearTimeout(time);
      time = window.setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 200);
    }
  }
};
