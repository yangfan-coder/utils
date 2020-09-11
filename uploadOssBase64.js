// import Vue from 'vue'
const OSS = require('ali-oss')
const ENV = process.env.ENV_TYPE
const ENVS = ['dev', 'qa']
const bucket = ENVS.includes(ENV) ? 'xesapp-xesapi-test' : 'xesapp-xesapi'
const createOssClient = ({ securityToken, accessKeySecret, accessKeyId }) => {
  const CLIENT = new OSS({
    region: 'oss-cn-beijing',
    endpoint: 'https://oss-cn-beijing.aliyuncs.com',
    bucket,
    accessKeyId,
    accessKeySecret,
    stsToken: securityToken // 测试环境 900s\生产环境 1h
  })
  return CLIENT
}
// base64转文件
const base64ToFile = code => {
  const PATH = code.split(';base64,')
  const CONTENT_TYPE = PATH[0].split(':')[1]
  const RAW = window.atob(PATH[1])
  const RAW_LENGTH = RAW.length

  const U_INT8_ARRAY = new Uint8Array(RAW_LENGTH)

  for (let i = 0; i < RAW_LENGTH; ++i) {
    U_INT8_ARRAY[i] = RAW.charCodeAt(i)
  }
  return new File([U_INT8_ARRAY], 'img', {
    type: CONTENT_TYPE
  })
}
const uploadbase64Img = async (base64img, oss = {}) => {
  if (base64img === '' && !oss[securityToken]) {
    console.warn(`警告：uploadbase64Img() 方法为传递base64的url 和token`)
    return
  }

  const UP_CLIENT = await createOssClient(oss)
  const IMG_FILE = base64ToFile(base64img)

  const PATH_NAME = `${oss.storePath}${+new Date()}.jpg`

  let ossUrl = ''
  try {
    // 文件目录 /evaluation/sts/test/1585124486728/时间戳.jpg
    const RESULT = await UP_CLIENT.multipartUpload(PATH_NAME, IMG_FILE)

    if (ENVS.includes(ENV)) {
      ossUrl = RESULT.res.requestUrls[0].split('?')[0]
    } else {
      ossUrl = RESULT.res.requestUrls[0].split('?')[0]
      ossUrl = `https://static-xesapi.speiyou.cn${ossUrl.split('com')[1]}`
    }
  } catch (error) {
    throw new Error(`uploadbase64Img()：上传阿里云报错，具体的报错信息如下：${error}`)
  }
  return ossUrl
}
export default uploadbase64Img
