import updateQueue from "./updateQueue";
import Dep from "./dep";

let uuid = 0;

class Watcher {
  id: number;
  vm: any;
  value: any;
  exp: Function | string;
  cb: (newValue: any, value: any) => void;
  constructor(vm: any, exp: Function | string, cb: () => void) {
    this.id = ++uuid;
    this.vm = vm;
    this.value = this.get();
    this.exp = exp;
    this.cb = cb;
  }

  get() {
    const fn = this.exp;
    let value;
    Dep.target = this;
    if (typeof fn === "function") {
      value = fn.call(this.vm);
    } else {
      const exp = fn.split(".");
      value = exp.reduce((sum, item) => {
        return sum[item];
      }, this.vm);
    }
    return value;
  }

  run() {
    const newValue = this.get();
    if (newValue === this.value) return;
    this.cb.call(this.vm, newValue, this.value);
    this.value = newValue;
  }

  update() {
    updateQueue(this);
  }
}

export default Watcher;
