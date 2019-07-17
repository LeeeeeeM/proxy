import parser from './parse/index'
import observer from './core/index'
import compile from './compile/index'
import { checkEmpty } from './utils/index'
import Watcher from './core/watcher'

function Lite(options) {
  this._init(options)
}

Lite.prototype._init = function(options) {
  this.$options = options
  this.render = this._parseTemplate(options.template)
  this._renderProxy = this._renderProxy.bind(this)
  this.updateDOM = this.updateDOM.bind(this)
  this.initData(this, options.data)
  this.renderWather = new Watcher(this._vm, this._renderProxy, this.updateDOM)
  this.compile()
  
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
  observer(vm.$data)
  vm._vm = new Proxy(this, {
    get(target, key) {
      return Reflect.get(target.$data, key)
    },
    set(target, key, value) {
      const oldValue = Reflect.get(target.$data, key)
      if (oldValue === value) return
      return Reflect.set(target, key, value)
    }
  })
}

Lite.prototype.compile = function () {
  this.$rootElement = document.querySelector(this.$options.el)
  if (!this.$rootElement) {
    console.error(`无法找到挂载的dom`)
  }
  this.$figment = this._renderProxy()
  this.$rootElement.appendChild(this.$figment)
}

Lite.prototype._renderProxy = function() {
  return compile.call(this._vm, this.render)
}

Lite.prototype.updateDOM = function () {
  this.$rootElement.removeChild(this.$figment)
  // 移除事件
  this.$figment = this._renderProxy()
  this.$rootElement.appendChild(this.$figment)
}


export default Lite