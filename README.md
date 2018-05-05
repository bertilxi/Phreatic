**WARNING: this is a WIP**

# Phreatic Dependency Injector

In many frameworks across languages, exists the implementation of this well known design pattern, like Spring MVC, Angular, .NET, etc.

Well, the idea of this was not to create just another IoC based dependency injector. The main motivation was the lack of a DI that resolves circular dependencies without messing too much with runtime, reflection, or overcomplicating the solution.

_**In a nutshell**: i need it, i do not found one, i made it._

### Objectives

* Be Awesome.
* Be super simple. No, really, simple or nothing.
* Well tested. Dependency Injection is the base of well a architectured system.

### Inspiration

* Spring framework
* Angular
* InversifyJS
* typescript-ioc

### Features

* Solves circular dependencies.
* Zero dependencies.
* Isomorphic/Universal.
* Inspired by **KISS** and **SOLID** principles.
* Lazy dependency resolution.
* Lightweigth **(~1kb GZIPPED)**.

### Caveats

* We do not deal with the circular dependencies made by **you and your imports**. _Please avoid doing the following kind of imports A => B => C => A_. Just use `@Inject("className")`.
* For runtime/complexity reasons, **there is no constructor injection**.
* Because the system that use the Injector could have a complex bussiness logic (dealing with asyncronicity and whatnot), there is an **OnInit** interface (inspired by angular implementation) to implement an **onInit()** callback in any Injectable, to run the code when all dependencies are ready to be resolved. Followed by a **ready()** callback to run when you know that your system is ready to do the dependency resolution, usually the bootstraping or init, after importing everything you need.

```Bash
npm install --save phreatic
# OR
yarn add phreatic
```

```Typescript
import { Inject, Injectable, get, createInjectable } from "phreatic";

@Injectable
export class User {
  public name = "user pepito";
  public password;
  @Inject("HttpService") public http;
}

export class Role {
  public name = "role pepito";
  public password;
}

@Injectable
export class HttpService {
  public name = "http service";
  @Inject("User") public user: User;
  @Inject("Role") public role: Role;
}

createInjectable(new Role());

const http = get(HttpService);
const user = get<any>("User");
// the same as
// const http = new HttpService();
// const user = new User();

// Valid uses
console.log(http.role.name);
console.log(http.user.name);
console.log(user.http.user.http.user.http.user.name);
console.log(user.http.user.http.user.http.name);
```
