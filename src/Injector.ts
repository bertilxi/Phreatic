let classes = {};
let instances = {};

export type ClassLike<T> = Constructor<T> | string;
export interface Constructor<T> {
  new (...args: any[]): T;
}

const resolveConstructor = target => {
  const params = Reflect.getMetadata("design:paramtypes", target) || [];

  const injectedArgs = params.map(param => {
    if (!param || !param.name) {
      throw new Error(
        `the injected class in ${target.name} constructor is not defined`
      );
    }

    return get(param.name);
  });

  return new target(...injectedArgs);
};

function resolveDependency(clazz: string) {
  const ClazzConstructor = classes[clazz];
  const isSingleton =
    ClazzConstructor.prototype._type === "singleton" && instances[clazz];
  try {
    return isSingleton
      ? instances[clazz]
      : resolveConstructor(ClazzConstructor);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(`No Singleton or Injectable : ${clazz}`);
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
      get: () => get(clazz),
      enumerable: true,
      configurable: true
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

export function Injectable<T>(target: Constructor<T>) {
  const { name } = target;
  checkNotExists(name);
  classes[name] = target;
  instances[name] = instances[name] || resolveConstructor(target);
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
