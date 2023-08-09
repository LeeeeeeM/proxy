import Dep from "./dep";
import { isObject } from "./utils";

const observe = (obj, toObserveKeys: string[] = []) => {
  if (!isObject(obj)) return obj;

  if (toObserveKeys && toObserveKeys.length) {
    toObserveKeys.forEach(key => {
      obj[key] = observe(obj[key])
    })
    return
  }

  Object.keys(obj).forEach((key) => {
    obj[key] = observe(obj[key]);
  });
  

  return defineRactive(obj);
};

const defineRactive = (obj, shallow = true) => {
  const dep: Dep = obj.__dep__ ? obj.__dep__ : new Dep();

  return new Proxy(obj, {
    get(target, key: string) {
      if (key === "__dep__") return dep;
      if (Dep.target) {
        dep.addSub(key, Dep.target);
        const child = target[key];
        if (child.__dep__ && !shallow) {
          child.__dep__.addSub(key, Dep.target);
        }
      }
      return Reflect.get(target, key);
    },
    set(target, key: string, newValue) {
      const value = Reflect.get(target, key);
      if (newValue === value) return false;
      Reflect.set(target, key, newValue);
      dep.notify(key);
      return true;
    },
  });
};

export default observe;
