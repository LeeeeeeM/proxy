let queue = new Set()
let nextTick = null

function flush() {
  queue.forEach(watcher => {
    watcher.run()
  })
  queue.clear()
}

function updateQueue(watcher) {
  queue.add(watcher)
  if (nextTick) return
  nextTick = Promise.resolve().then(() => {
    nextTick = null
    flush()
  })
}

export default updateQueue
