let classes = {};
let instances = {};

export interface Constructor<T> {
  new (...args: any[]): T;
}
export type ClassLike<T> = Constructor<T> | string | symbol | any;

const checkDefined = (param, name) => {
  if (!param || !param.name) {
    throw new Error(
      `One of the injected class in ${name} constructor is not defined`
    );
  }
};

const resolveConstructor = target => {
  const params = Reflect.getMetadata("design:paramtypes", target) || [];

  const injectedArgs = params.map(param => {
    checkDefined(param, target.name);
    return get(param.name);
  });

  return new target(...injectedArgs);
};

function resolveDependency(className: string) {
  const mClass = classes[className];
  const singleton =
    mClass.prototype._type === "singleton" && instances[className];

  return singleton || resolveConstructor(mClass);
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
      get: () => get(clazz),
      enumerable: true,
      configurable: true
    });
  };
}

export function get<T>(clazz: ClassLike<T>): T {
  const className: string = (clazz && clazz.name) || clazz;
  return resolveDependency(className) as T;
}

export function createInjectable<T>(instance: any, clazz?: ClassLike<T>) {
  const className = (clazz && clazz.name) || clazz || instance.constructor.name;
  if (!className || className === "Object") {
    throw new Error("Could not infer Injectable class name");
  }
  const f: any = () => instance;
  Object.defineProperty(f, "name", { value: className });
  Injectable(f);
}

export function Injectable<T>(target: Constructor<T>) {
  const { name } = target;
  checkNotExists(name);
  classes[name] = target;
  instances[name] = resolveConstructor(target);
  return target;
}

export function Singleton<T>(target: Constructor<T>) {
  const { name } = target;
  target.prototype._type = "singleton";
  Injectable(target);
  const f: any = () => instances[name];
  Object.defineProperty(f, "name", { value: name });
  return f;
}
