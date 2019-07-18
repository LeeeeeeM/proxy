// 实例相关实现

const lifecycle = ['mounted', 'beforeDestroy']

function callHook(vm, lifePhase) {
  if (lifecycle.indexOf(lifePhase) < 0) return
  const phase = vm.$options[lifePhase]
  const fns = phase ? Array.isArray(phase) ? phase: [ phase ] : []
  fns.slice().forEach(fn => {
    fn.call(vm)
  })
}

export {
  callHook
}