let classes = {};
let instances = {};

export interface Constructor<T = any> {
  new (...arguments_: any[]): T;
}
export type ClassLike<T = any> = Constructor<T> | string;

const checkDefined = (parameter: Constructor, name: string) => {
  if (!parameter || !parameter.name) {
    throw new Error(
      `One of the injected class in ${name} constructor is not defined`
    );
  }
};

const resolveConstructor = (target: Constructor) => {
  const parameters =
    (Reflect as any).getMetadata("design:paramtypes", target) || [];

  const injectedArguments = parameters.map((parameter) => {
    checkDefined(parameter, target.name);
    return get(parameter.name);
  });

  return new target(...injectedArguments);
};

function resolveDependency(className: string) {
  const mClass = classes[className];

  if (mClass.prototype._type === "singleton") {
    instances[className] = instances[className] || resolveConstructor(mClass);
    return instances[className];
  }

  return resolveConstructor(mClass);
}

function checkNotExists(name: string) {
  const exists = !!instances[name] || !!classes[name];
  if (exists) {
    throw new Error(`Name ${name} is already taken, please use another.`);
  }
}

export function clearContainer() {
  classes = {};
  instances = {};
}

export function Inject<T>(clazz: ClassLike<T> | string): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: () => get(clazz),
      enumerable: true,
      configurable: true,
    });
  };
}

const getName = (object: Constructor) => (object ? object.name : undefined);

export function get<T>(clazz: ClassLike<T> | string): T | any {
  const className = getName(clazz as Constructor<T>) || (clazz as string);
  return resolveDependency(className) as T;
}

export function createInjectable<T>(instance: any, clazz?: ClassLike<T>) {
  const className =
    getName(clazz as Constructor<T>) ||
    (clazz as string) ||
    instance.constructor.name;

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
  return target;
}

export function Singleton<T>(target: Constructor<T>) {
  const { name, prototype } = target;
  prototype._type = "singleton";
  Injectable(target);
  function f() {
    return resolveConstructor(classes[name]);
  }
  Object.defineProperty(f, "name", { value: name });
  return f as any;
}
