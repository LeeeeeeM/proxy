// 负责解析后模板的编译工作

function traverseNode(node) {
  const vm = this
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

  if (node.children && node.children.length) {
    node.children.forEach(n => {
      element.appendChild(traverseNode.call(vm, n))
    })
  }

  return element
}

export default traverseNode