import parser from './parse/index'
import observer from './core/index'
import compile from './compile/index'
import { checkEmpty } from './utils/index'
import Watcher from './core/watcher'
import { callHook } from './instance/index'

function Lite(options) {
  this._init(options)
}

Lite.prototype._init = function(options) {
  this.$options = options
  this.render = this._parseTemplate(options.template)
  this._renderProxy = this._renderProxy.bind(this)
  this.updateDOM = this.updateDOM.bind(this)
  this.initData(this, options.data)
  this._initMethods()
  // 渲染次数
  this._renderTimes = 0;
  this._renderWather = new Watcher(this, () => {
    // 需要每次发生变化返回的值不一样
    return ++this._renderTimes;
  }, this.updateDOM)
  this.compile()
  callHook(this, 'mounted')
}

Lite.prototype._parseTemplate = function(template) {
  const result = parser.parse(template, {}).jsonTemplate
  if (checkEmpty(result)) {
    console.error(`模板不能为空`)
  }
  return result
}

Lite.prototype.initData = function(vm, data) {
  if (typeof data === 'function') {
    vm.$data = data()
  } else if (typeof data === 'object') {
    vm.$data = data
  } else {
    vm.$data = {}
    console.error(`${data}必须是对象`)
  }
  observer(vm, ['$data'])

  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return Reflect.get(vm.$data, key)
      },
      set(value) {
        const oldValue = Reflect.get(vm.$data, key)
        if (oldValue === value) return
        return Reflect.set(vm.$data, key, value)
      }
    })
  })
}

Lite.prototype._initMethods = function () {
  const vm = this
  const methods = this.$options.methods
  if (!methods) return
  Object.entries(methods).forEach(([key, method]) => {
    Object.defineProperty(vm, key, {
      writable: false,
      value: method.bind(vm)
    })
  })
}

Lite.prototype.compile = function () {
  this.$rootElement = document.querySelector(this.$options.el)
  if (!this.$rootElement) {
    console.error(`无法找到挂载的dom`)
  }
  this.renderVnode()
  this.$rootElement.appendChild(this.$vnode)
}

Lite.prototype.renderVnode = function () {
  this._renderProxy()
}

Lite.prototype._renderProxy = function() {
  const vm = this
  if (vm._lastRemoveMethods && vm._lastRemoveMethods.length) {
    vm._lastRemoveMethods.forEach(method => method())
  }
  vm._lastRemoveMethods = []
  vm.$vnode = compile.call(vm, vm.render)
}

Lite.prototype.updateDOM = function () {
  console.log(`更新DOM`)
  // 移除事件
  this.$rootElement.removeChild(this.$vnode)
  this.renderVnode()
  this.$rootElement.appendChild(this.$vnode)
}

export default Lite
