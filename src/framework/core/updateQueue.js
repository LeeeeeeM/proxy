let queue = new Set()

function flush() {
  queue.forEach(watcher => {
    watcher.run()
  })
  queue.clear()
}

function updateQueue(watcher) {
  queue.add(watcher)
  Promise.resolve().then(() => flush())
}

export default updateQueue
