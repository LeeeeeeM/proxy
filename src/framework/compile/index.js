// 负责解析后模板的编译工作

function compileDirective(node) {
  const vm = this

  if (node.shown) {
    if (!node.shown.call(vm)) return null
  }

  const element = document.createElement(node.type)
  Object.entries(node.attr).forEach(([key, attr]) => {
    let value
    if (typeof attr === 'function') {
      value = attr.call(vm)
    } else {
      value = attr
    }
    if (key === 'value' && node.type === 'span') {
      element.textContent = value
    } else {
      element.setAttribute(key, value)
    }
  })

  // 添加事件

  if (node.events) {
    Object.entries(node.events).forEach(([name, value]) => {
      element.addEventListener(name, vm[value])
      vm._lastRemoveMethods.push(() => {
        element.removeEventListener(name, vm[value])
      })
    })
  }

  if (node.children && node.children.length) {
    node.children.forEach(n => {
      const renderNode = compile.call(vm, n)
      renderNode && element.appendChild(renderNode)
    })
  }

  return element
}


function compile(node) {
  const vm = this
  return compileDirective.call(vm, node)
}

export default compile