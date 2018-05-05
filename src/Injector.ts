import { eventBus } from "./EventBus";

let classes = {};
let instances = {};

export interface Constructor<T> {
  new (...args: T[]): T;
}

export type ClassLike<T> = Constructor<T> | string;

function resolveDependency(clazz: string) {
  const ClazzConstructor = classes[clazz];
  if (ClazzConstructor.prototype._type === "singleton" && instances[clazz]) {
    return instances[clazz];
  }
  try {
    return new ClazzConstructor();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(`No singleton or defined Injectable ${clazz}`);
  }
}

function checkNotExists(name) {
  const exists = !!instances[name] || !!classes[name];
  if (exists) {
    throw new Error(`Name ${name} is already taken, please use another.`);
  }
}

export function clearContainer() {
  classes = {};
  instances = {};
}

export function Inject<T>(clazz: ClassLike<T>): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        return get(clazz);
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

export function get<T>(clazz: ClassLike<T>): T {
  const className: string = (clazz && (clazz as any).name) || clazz;
  return resolveDependency(className) as T;
}

export function createInjectable<T>(instance: any, clazz?: ClassLike<T>) {
  const className =
    (clazz && (clazz as any).name) || clazz || instance.constructor.name;
  if (!className || className === "Object") {
    throw new Error("Could not infer Injectable class name");
  }
  const fake: any = () => {
    return instance;
  };
  Object.defineProperty(fake, "name", { value: className });
  Injectable(fake);
}

export function ready() {
  eventBus.emit("DI:READY");
}

export interface OnInit {
  onInit: () => void;
}

export function Injectable<T>(target: Constructor<T>) {
  const name = target.name;
  checkNotExists(name);
  if (target.prototype._type === "singleton") {
    instances[name] = instances[name] || new target();
  }
  classes[name] = target;
  return target;
}

export function Singleton<T>(target: Constructor<T>) {
  target.prototype._type = "singleton";
  Injectable(target);
  const f: any = () => {
    return instances[target.name];
  };
  Object.defineProperty(f, "name", { value: target.name });
  return f;
}
