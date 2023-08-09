import Watcher from "./watcher";

let uuid = 0;

class Dep {
  id: number;
  subs: Map<string, Set<Watcher>>;
  static target: Watcher | null;
  constructor() {
    this.id = ++uuid;
    this.subs = new Map<string, Set<Watcher>>();
  }

  notify(key: string) {
    const watchers: Set<Watcher> | undefined = this.subs.get(key);
    if (watchers) {
      watchers.forEach((watcher) => {
        watcher.update();
      });
    }
  }

  addSub(key: string, watcher: Watcher) {
    const watchers: Set<Watcher> | undefined = this.subs.get(key);
    if (watchers) {
      watchers.add(watcher);
    } else {
      this.subs.set(key, new Set([watcher]));
    }
  }
}

Dep.target = null;

export default Dep;
