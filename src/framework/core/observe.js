import { isObject } from '../utils/index'
import Dep from './dep'

// Observe对象，如果有属性value是对象，则递归
function observe(obj) {
  if (!isObject(obj)) {
    return obj
  }

  Object.keys(obj).forEach(key => {
    obj[key] = observe(obj[key])
  })

  return defineRactive(obj)
}

function defineRactive(obj) {
  const dep = obj.__dep__ ? obj.__dep__ : new Dep()

  return new Proxy(obj, {
    get(target, key) {
      if (key === '__dep__') {
        return dep
      }
      if (Dep.target) {
        dep.addSub(key, Dep.target)
        const child = target[key]
        if (isObject(child)) {
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
      Reflect.set(target, key, value)
      observe(value)
      dep.notify(key)
      return true
    }
  })
}

export default observe