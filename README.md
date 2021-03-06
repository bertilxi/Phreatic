![Phreatic Dependency Injector](logo.png?raw=true "Phreatic Dependency Injector")

In many frameworks across languages, exists the implementation of this well known design pattern, like Spring MVC, Angular, .NET, etc.

Well, the idea of this was not to create just another IoC based dependency injector. The main motivation was the lack of a DI that resolves circular dependencies without messing too much with runtime, reflection, or overcomplicating the solution.

### Installation

[![Greenkeeper badge](https://badges.greenkeeper.io/bertilxi/Phreatic.svg)](https://greenkeeper.io/)

```Bash
npm install --save phreatic
# OR
yarn add phreatic
```

### Objectives

- Be Awesome.
- Be super simple.
- Well tested. Dependency Injection is the base of well a architectured system.

### Inspiration

- Spring framework
- Angular
- InversifyJS
- typescript-ioc

### Features

- Solves circular dependencies.
- Zero dependencies.
- Isomorphic/Universal.
- Inspired by **KISS** and **SOLID** principles.
- Lazy dependency resolution.

### Caveats

- We do not deal with the circular dependencies made by **you and your imports**. _Please avoid doing the following kind of imports `A => B => C => A`_. Just use `@Inject("className")`.

### Example

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

### Development

Just the usual.

```Bash
# Install deps
yarn
# Change the code
# Build it
yarn build
# Test it
yarn test
# submit your Pull Request or Open an issue
```
