// 捕获await 的异步报错
// https://www.jianshu.com/p/2935c0330dd2
export default function awaitCatch(promise) {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err])
}
