import Watcher from "./watcher";

let queue = new Set<Watcher>();
let nextTick: null | Promise<void> = null;

const flush = () => {
  queue.forEach((watcher: Watcher) => {
    watcher.run();
  });
  queue.clear();
};

const updateQueue = (watcher: Watcher) => {
  queue.add(watcher);
  if (nextTick) return;
  nextTick = Promise.resolve().then(() => {
    flush();
    nextTick = null;
  })
};

export default updateQueue;
