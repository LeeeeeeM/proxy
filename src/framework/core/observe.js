import { isObject } from '../utils/index'
import Dep from './dep'

// Observe对象，如果有属性value是对象，则递归
function observe(obj, toObserveKeys = []) {
  if (!isObject(obj)) {
    return obj
  }

  if (toObserveKeys && toObserveKeys.length) {
    toObserveKeys.forEach(key => {
      obj[key] = observe(obj[key])
    })
    return
  }

  Object.keys(obj).forEach(key => {
    obj[key] = observe(obj[key])
  })

  return defineRactive(obj)
}

function defineRactive(obj, shallow = true) {
  const dep = obj.__dep__ ? obj.__dep__ : new Dep()

  return new Proxy(obj, {
    get(target, key) {
      if (key === '__dep__') {
        return dep
      }
      if (Dep.target) {
        dep.addSub(key, Dep.target)
        const child = target[key]
        if (isObject(child) && !shallow) {
          Object.keys(child).forEach(skey => {
            child.__dep__.addSub(skey, Dep.target)
          })
        }
      }
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const oldValue = Reflect.get(target, key)
      if (oldValue === value) return false
      Reflect.set(target, key, observe(value))
      dep.notify(key)
      return true
    }
  })
}

export default observe