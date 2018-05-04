import { store } from "./Store";
import { eventBus } from "./EventBus";

const classes = {};
const instances = {};

store.set("classes", classes);
store.set("instances", instances);

export interface Constructor<T> {
  new (...args: T[]): T;
}

export function resolveDependency(clazz: string) {
  let dependency = instances[clazz];
  if (!dependency) {
    dependency = classes[clazz];
    dependency = dependency ? new dependency() : undefined;
  }
  if (!dependency) {
    // tslint:disable-next-line:no-console
    console.warn(`Undefined dependency ${clazz}`);
  }
  return dependency;
}

export function Inject(clazz: string): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        return resolveDependency(clazz);
      },
      enumerable: true,
      configurable: true
    });
    eventBus.on("DI:READY", () => {
      if (target && target.onInit && typeof target.onInit === "function") {
        target.onInit();
      }
    });
  };
}

function checkNotExists(name) {
  const exists = !!instances[name] || !!classes[name];
  if (exists) {
    throw new Error(`Name ${name} is already taken, please use another.`);
  }
}

export function get<T>(clazz: Constructor<T> | string): T {
  const className: string = (clazz && (clazz as any).name) || clazz;
  return resolveDependency(className) as T;
}

export function createInjectable(instance: any, clazz?: any) {
  const className = (clazz && clazz.name) || clazz || instance.constructor.name;
  if (!className || className === "Object") {
    throw new Error("Could not infer Injectable class name");
  }
  instances[className] = instance;
}

export function ready() {
  eventBus.emit("DI:READY");
}

export interface OnInit {
  onInit: () => void;
}

export function Injectable<T>(target: Constructor<T>) {
  checkNotExists(target.name);
  classes[target.name] = target;
  return target;
}

export function Singleton<T>(target: Constructor<T>) {
  Injectable(target);
  const f: any = () => {
    return get(target.name);
  };
  Object.defineProperty(f, "name", { value: target.name });
  return f;
}
