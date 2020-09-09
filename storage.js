/* 
  *
  * @Class
  * 封装的session、local的方法
  * 
  * @return {Object} 返回新的对象[Local\Session]
  *
*/

const illegalValue = ['', null, 'undefined', undefined]

const setObj = val => {
  let newVal = illegalValue.indexOf(val) === -1 ? val : ''
  if (typeof val === 'object') {
    newVal = JSON.stringify(val)
  }
  return newVal
}

const getObj = val => {
  let newVal = illegalValue.indexOf(val) === -1 ? val : ''
  try {
    newVal = JSON.parse(newVal)
  } catch (error) {
    newVal = val
  }
  return newVal
}

class Local {
  get(key) {
    return getObj(localStorage.getItem(key) || '')
  }

  set(key, val) {
    localStorage.setItem(key, setObj(val))
  }

  delete(key) {
    localStorage.removeItem(key)
  }

  // 清空所有
  clear() {
    localStorage.clear()
  }
}

class Session {
  get(key) {
    return getObj(sessionStorage.getItem(key) || '')
  }

  set(key, val) {
    sessionStorage.setItem(key, setObj(val))
  }

  delete(key) {
    sessionStorage.removeItem(key)
  }

  // 清空所有
  clear() {
    sessionStorage.clear()
  }
}

const session = new Session()
const local = new Local()

export { local, session }
