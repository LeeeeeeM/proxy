import Dep from './dep'
import updateQueue from './updateQueue'

let id = 0

class Watcher {
  constructor(vm, exp, cb) {
    this.id = ++id
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get()
  }

  get() {
    const fn = this.exp
    let value
    Dep.target = this
    if (typeof fn === 'function') {
      value = fn.call(this.vm)
    } else {
      const exp = fn.split('.')
      value = exp.reduce((sum, item) => {
        return sum[item]
      }, this.vm)
    }
    return value
  }

  run() {
    const value = this.get()
    if (this.value === value) return
    this.cb.call(this.vm, value, this.value)
    this.value = value
  }

  update() {
    updateQueue(this)
  }
}

export default Watcher
