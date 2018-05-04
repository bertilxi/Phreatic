import { store } from "./Store";

const injectables = {};
store.set("injectables", injectables);

export function resolveDependency(clazz: string) {
  const dep = injectables[clazz];
  if (!dep) {
    throw new Error("Undefined dependency");
  }
  return dep;
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
  };
}

function checkNotExists(name) {
  const exists = !!injectables[name];
  if (exists) {
    throw new Error(`Name ${name} is already taken, please use another.`);
  }
}

export function doInjectable(instance: any, clazz?: any) {
  const className = (clazz && clazz.name) || clazz || instance.constructor.name;
  if (!className || className === "Object") {
    throw new Error("Could not infer Injectable class name");
  }
  injectables[className] = instance;
}

export function Injectable() {
  return (target: any) => {
    const instance = new target();
    checkNotExists(target.name);
    injectables[target.name] = instance;
  };
}
