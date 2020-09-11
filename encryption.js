/**
 * 签名工具类
 * header 参数加密处理
 * @see https://github.com/brix/crypto-js
 */

/* eslint-disable */
import CryptoJS from 'crypto-js/core';
import hmacSHA1 from 'crypto-js/hmac-sha1';

//初始化
const encrypt = {};

// header中包含的字段
const headersList =
  [
    'area',
    'gradeId',
    'devid',
    'v',
    'stu_id',
    'client_type',
    'timestamp',
    'accessid',
    'nonce',
    'algorithm',
    'version',
    'authorization'
  ];

// typeof共5种类型 number string boolean undefined object function
// 不合法的
const illegalType = ['undefined', 'object', 'function'];
const illegalValue = ['', null, 'undefined', undefined];

// value值不为空
const isNotNull = (value) => illegalValue.indexOf(value) === -1;

// value值为简单类型
const allowable = (value) => illegalType.indexOf(typeof value) === -1;

// json字符串转化json
const ToJSON = (str) => {
  if (typeof str !== 'string') return str;
  if (typeof str === 'object') return str;
  try {
    const obj = JSON.parse(str);
    return (obj && typeof obj === 'object') ? obj : {}
  } catch (e) {
    console.error(`老铁，加密的错误信息： ${e}`);
    return {};
  }
};

// 去掉不合法的key(不是简单类型的，null，空) 去掉前后空格
const trim = (value) => {
  return (typeof (value) === 'string') ? value.trim() : value
};

// 过滤headers里面的参数
const filterHeaders = (obj, headerKeys) => {
  let headerObj = {},
    getHeaders = obj.headers || obj.header,
    hlist = Object.keys(getHeaders),
    i = 0,
    len = 0;
    let headers = headersList.concat(headerKeys)

  for (i = 0, len = hlist.length; i < len; i++) {
    if (headers.indexOf(hlist[i]) !== -1) {
      headerObj[hlist[i]] = getHeaders[hlist[i]];
    }
  }
  return headerObj;
};

// 截取url上的参数，优先级高于params的
const getUrlParams = (obj) => {
  if (!obj.url) return {};
  let urlParams = {},
    url = obj.url,
    i = 0,
    len = 0,
    list = null,
    num = null;
  if (isNotNull(url) && url.indexOf('?') > -1) {
    list = url.substring(url.indexOf('?') + 1).split('&');
    for (i = 0, len = list.length; i < len; i++) {
      num = list[i].indexOf('=');
      urlParams[list[i].substring(0, num)] = list[i].substring(num + 1);
    }
  }
  return urlParams;
};

// 处理data，兼容Content-Type ="application/x-www-form-urlencoded"，data为字符串json类型
const filterData = (obj) => {
  let data = {},
    dataResults = null,
    list = null,
    i = 0,
    len = 0,
    num = 0;
  if (obj.headers && obj.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    list = (obj.data).split('&');
    for (i = 0, len = list.length; i < len; i++) {
      num = list[i].indexOf('=');
      data[list[i].substring(0, num)] = list[i].substring(num + 1);
    }
  } else {
    dataResults = obj.data || obj.formData;
    data = ToJSON(dataResults);
  }
  return data;
};

// key有效的集合，用于排序
const sortObjects = (newObj) => {
  let finallyStr = '';
  const keys = Object.keys(newObj).sort();
  for (let i = 0; i < keys.length; i += 1) {
    if (allowable(newObj[keys[i]]) && isNotNull(newObj[keys[i]])) {
      finallyStr += `${keys[i]}=${trim(newObj[keys[i]])}&`;
    }
  }
  finallyStr = finallyStr.replace(/(&$)/, '');
  // finallyStr = decodeURIComponent(finallyStr);
  return finallyStr;
}
// 处理加密对象, 排序
const encryptObj = (obj, headerKeys) => {
  if (typeof (obj) !== 'object') return '';
  const data = filterData(obj);
  const headers = filterHeaders(obj, headerKeys);
  const urlParams = getUrlParams(obj);
  const params = obj.params || {};
  const newObjects = Object.assign({}, data, params, urlParams, headers);
  return sortObjects(newObjects)
};

// 获取uuid
const uuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '';
  var uuid = s.join('');
  return uuid;
}
// 获取 nonce
encrypt.nonce = () => {
  // 时间戳，uuid，openid，stuid
  const timestamp = new Date().getTime();
  const nonce = timestamp + uuid();
  return nonce;
};

// 增加对象方法sign加密
encrypt.sign = (obj, signKey, headerKeys) => {
  const str = encryptObj(obj, headerKeys);
  const sign = hmacSHA1(str, signKey).toString(CryptoJS.enc.Hex).toUpperCase();
  return sign;
};

export default encrypt;
