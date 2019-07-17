function checkEmpty(tree) {
  for (let i in tree) {
    return false
  }
  return true
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export {
  checkEmpty,
  isObject
}