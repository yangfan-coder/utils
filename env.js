/* H5判断当前的环境 */

const env = () => {
    const ua = window.navigator.userAgent.toLocaleLowerCase()
    // h5
    if (ua.indexOf('xesapp') > -1) {
      return 'app'
    }

    // 小程序
    if (window.__wxjs_environment === 'miniprogram' || ua.indexOf('miniprogram') !== -1) {
      return 'wechat'
    }

    // 微信
    if (ua.indexOf('micromessenger') > -1) {
      return 'wx'
    }

    // 钉钉
    if (ua.indexOf('dingtalk') > -1) {
      return 'dingding'
    }

    // 浏览器：pc/mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return 'mobile' // mobile
    }
    
    // pc
    return 'pc' 
}

export default env