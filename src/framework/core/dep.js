let uuid = 0

class Dep {
  constructor() {
    this.id = ++uuid
    // 存储key => [subs]
    // 每一个被Observe的对象都有一个Dep实例，用于存储订阅当前对象的key值变化的watcher
    this._subs = new Map()
  }

  notify(key) {
    // 通知对应的key值变化所要触发的watcher
    const subs = this._subs.get(key)
    if (subs && subs.size) {
      subs.forEach(sub => {
        sub.update()
      })
    }
  }

  addSub(key, sub) {
    const subs = this._subs.get(key)
    if (subs) {
      subs.add(sub)
    } else {
      this._subs.set(key, new Set([sub]))
    }
  }
}

Dep.target = null

export default Dep
